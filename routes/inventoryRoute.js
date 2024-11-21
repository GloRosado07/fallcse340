// Needed Resources 
const express = require("express")
const router = new express.Router() 
const invController = require("../controllers/invController")
const utilities = require("../utilities/")

/*  **********************************
*  GET Routes
* ********************************* */

// Route to build inventory by classification view
router.get("/type/:classificationId", utilities.handleErrors(invController.buildByClassificationId));

// Route to build car product details
router.get("/detail/:invId", utilities.handleErrors(invController.buildByInvId));

// Inexistent route for 500-type error
router.get("/faildirection", utilities.handleErrors(invController.badFunction))

// Route to build inventory view
router.get("/getInventory/:classification_id", utilities.handleErrors(invController.getInventoryJSON))

// Route to build edit view by inventory id
router.get("/edit/:invId", 
    //utilities.checkLogin,
    utilities.handleErrors(invController.buildEditByInvId)
    );

/*  **********************************
*  POST Routes
* ********************************* */
// Route for register a new classification
router.post(
    "/inventory/add-classification",
    //utilities.checkLogin,
    utilities.handleErrors(invController.addClassification)
);



module.exports = router;