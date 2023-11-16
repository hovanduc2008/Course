const express = require("express");
const router = express.Router();
const contactController = require("../../controllers/contactController");

const ROLES_LIST = require("../../config/roles_list");

const verifyRoles = require("../../middleware/verifyRoles");

const verifyJWT = require("../../middleware/verifyJWT");

router
    .route("/")
    .get(contactController.getAllContact)
    .post(
        verifyJWT,
        verifyRoles(ROLES_LIST.Admin, ROLES_LIST.Editor),
        contactController.createContact,
    );

router
    .route("/:id")
    .get(contactController.getContact)
    .put(
        verifyJWT,
        verifyRoles(ROLES_LIST.Admin, ROLES_LIST.Editor),
        contactController.updateContact,
    )
    .delete(
        verifyJWT,
        verifyRoles(ROLES_LIST.Admin, ROLES_LIST.Editor),
        contactController.deleteContact,
    );

module.exports = router;
