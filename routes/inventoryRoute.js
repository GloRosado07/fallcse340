// Needed Resources 
const express = require("express")
const router = new express.Router() 
const invController = require("../controllers/invController")
const utilities = require("../utilities/")
const invValidate = require('../utilities/inventory-validation')

/*  **********************************
*  GET Routes
* ********************************* */

// Route to inventory management
router.get("/", 
    //utilities.checkLogin,
    utilities.handleErrors(invController.buildManagementView)
);

// Route to build inventory by classification view
router.get("/type/:classificationId", utilities.handleErrors(invController.buildByClassificationId));

// Route to build car product details
router.get("/detail/:invId", utilities.handleErrors(invController.buildByInvId));

// Inexistent route for 500-type error
router.get("/faildirection", utilities.handleErrors(invController.badFunction))

// Route to build add classification view
router.get("/inventory/add-classification",
    //utilities.checkLogin,
    utilities.handleErrors(invController.buildAddClassView)
    );

// Route to build add vehicle view
router.get("/inventory/add-inventory",
    utilities.checkLogin,
    utilities.handleErrors(invController.buildAddVehicleView)
    );

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
    invValidate.classificationRules(),
    invValidate.checkClassData,
    utilities.handleErrors(invController.addClassification)
);

// Route to add a vehicle
router.post(
    "/inventory/add-inventory",
    utilities.checkLogin,
    invValidate.inventoryRules(),
    invValidate.checkInventoryData,
    utilities.handleErrors(invController.addVehicle)
);

// Update vehicle data
router.post(
    "/update/",
    utilities.checkLogin,
    invValidate.inventoryRules(),
    invValidate.checkUpdateData,
    utilities.handleErrors(invController.updateInventory))


module.exports = router;
