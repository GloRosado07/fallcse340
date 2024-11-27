// Needed Resources 
const express = require("express")
const router = new express.Router() 
const utilities = require("../utilities/")
const accountController = require("../controllers/accountController")
const regValidate = require('../utilities/account-validation')


/*  **********************************
*  GET Routes
* ********************************* */

// Route to login view
router.get("/login",
    utilities.handleErrors(accountController.buildLogin)
    );

// Route to register view
router.get("/register",
    utilities.handleErrors(accountController.buildRegister)
    );


    // Process the registration data
router.post(
    "/register",
    utilities.handleErrors(accountController.registerAccount)
  )



/*  **********************************
*  POST Routes
* ********************************* */

// Process the login attempt
router.post(
    "/login",
    (req, res) => {
      res.status(200).send('login process')
    }
  )

  // Process the registration data
router.post(
  "/register",
  regValidate.registationRules(),
  regValidate.checkRegData,
  utilities.handleErrors(accountController.registerAccount)
)

router.post('/register', utilities.handleErrors(accountController.registerAccount))

  module.exports = router;