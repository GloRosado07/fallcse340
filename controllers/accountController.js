const utilities = require("../utilities/")
const accountModel = require("../models/account-model") // Import accountModel
const bcrypt = require("bcryptjs")


/* ****************************************
*  Deliver login view
* *************************************** */
async function buildLogin(req, res, next) {
    let nav = await utilities.getNav()
    res.render("account/login", {
        title: "Login",
        errors: null,
        nav,
    })
}

/* ****************************************
*  Deliver registration view  week3
* *************************************** */
async function buildRegister(req, res, next) {
    let nav = await utilities.getNav()
    res.render("account/register", {
      title: "Register",
      errors: null,
      nav,
    })
}


/* ****************************************
*  Deliver root view
* *************************************** */
async function buildAccountRootView(req, res, next) {
  let nav = await utilities.getNav()
  let invManagement
  let updateLink

  const userInformation = await utilities.getJWTInfo(req)
  let userName = userInformation.account_firstname

  // Render Inventory Management
  let isStaff = await authZ.isStaff(req)

  if (isStaff) {
    invManagement =  '<h3>Inventory Management</h3>'
    invManagement += '<div class="management-view">'
    invManagement += '<a href="/inv/">Manage Inventory</a>'
    invManagement += '</div>'
  } else {
    invManagement = null
  }
  updateLink = `<a href="/account/edit/${userInformation.account_id}">Edit Account Information</a>`
  

  // Render Review Management
  let reviewHistory = await accountModel.getReviewByAccountId(userInformation.account_id)
  let reviewManagement = '<ul id="reviewDisplay">'
  
  reviewHistory.forEach(function (row) {
    reviewManagement += `<li>Reviewed the ${row.inv_year} ${row.inv_make} ${row.inv_model} on ${formatDate(row.review_date)} | `
    reviewManagement += `<a href='/account/review/edit/${row.review_id}'>Edit</a> | `
    reviewManagement += `<a href='/account/review/delete/${row.review_id}'>Delete</a>`
    reviewManagement += `</li>`
  })

  reviewManagement += '</ul>'

  res.render("account/management", {
    title: "Account Management",
    errors: null,
    nav,
    updateLink,
    invManagement,
    reviewManagement
  })
}


/* ****************************************
*  Process Registration
* *************************************** */
async function registerAccount(req, res) {
    let nav = await utilities.getNav()
    const { account_firstname, account_lastname, account_email, account_password } = req.body

//week4 login registration account//
    // Hash the password before storing
  let hashedPassword
  try {
    // regular password and cost (salt is generated automatically)
    hashedPassword = await bcrypt.hashSync(account_password, 10)
  } catch (error) {
    req.flash("notice", 'Sorry, there was an error processing the registration.')
    res.status(500).render("account/register", {
      title: "Registration",
      nav,
      errors: null,
    })
  }

  //week4 login registration account//
  
    const regResult = await accountModel.registerAccount(
      account_firstname,
      account_lastname,
      account_email,
      hashedPassword  //week4 login registration account//
    )
  
    if (regResult) {
      req.flash(
        "notice",
        `Congratulations, you\'re registered ${account_firstname}. Please log in.`
      )
      res.status(201).render("account/login", {
        title: "Login",
        nav,
      })
    } else {
      req.flash("notice", "Sorry, the registration failed.")
      res.status(501).render("account/register", {
        title: "Registration",
        nav,
      })
    }
  }

  /* ****************************************
 *  Process login request
 * ************************************ */
async function accountLogin(req, res) {
  let nav = await utilities.getNav()
  let userData = await utilities.getUser(req)
  const { account_email, account_password } = req.body
  const accountData = await accountModel.getAccountByEmail(account_email)
  if (!accountData) {
   req.flash("notice", "Please check your credentials and try again.")
   res.status(400).render("account/login", {
    title: "Login",
    nav,
    userData,
    errors: null,
    account_email,
   })
  return
  }
  try {
   if (await bcrypt.compare(account_password, accountData.account_password)) {
   delete accountData.account_password
   const accessToken = jwt.sign(accountData, process.env.ACCESS_TOKEN_SECRET, { expiresIn: 3600 })
   if(process.env.NODE_ENV === 'development') {
     res.cookie("jwt", accessToken, { httpOnly: true, maxAge: 3600 * 1000 })
     } else {
       res.cookie("jwt", accessToken, { httpOnly: true, secure: true, maxAge: 3600 * 1000 })
     }
   return res.redirect("/account/")
   }
  } catch (error) {
   return new Error('Access Forbidden')
  }
 }

/* ****************************************
*  Update user process
* *************************************** */
async function updateUserAccount(req, res) {
  let nav = await utilities.getNav()
  let userData = await utilities.getUser(req)
  const { account_id, account_firstname, account_lastname, account_email } = req.body

  const updateData = await accountModel.updateDataAccount(
    account_id,
    account_firstname,
    account_lastname,
    account_email
  )

  if (updateData) {
    req.flash(
      "notice",
      "Congratulations, your information has been updated."
    )
    res.status(201).redirect("/account")
  } else {
    req.flash("notice", "Sorry, the update has failed.")
    res.status(501).render("account/", {
      title: "Account Management",
      errors: null,
      userData,
      nav,
    })
  }
}

/* ****************************************
*  Update account view
* *************************************** */
async function buildUpdateAccount(req, res, next) {
  let nav = await utilities.getNav()
  let userData = await utilities.getUser(req)

  const account_id = req.params.userId

  const accountData = await accountModel.getAccountById(account_id)

  res.render("account/update", {
    title: "Account Management",
    errors: null,
    nav,
    userData,
    account_firstname:accountData.account_firstname,
    account_lastname:accountData.account_lastname,
    account_email:accountData.account_email,
    account_id:account_id
  })
}

  module.exports = {
    buildLogin,
    buildRegister,
    buildAccountRootView,
    registerAccount,
    accountLogin,
    updateUserAccount,
    buildUpdateAccount,    
}

