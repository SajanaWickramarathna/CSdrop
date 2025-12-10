const express = require("express");
const router = express.Router();
//Insert model
const contatMs = require("../Models/contactModel");
//Insert UserControll
const contactUScontroll = require("../Controllers/contactUScontroll");

router.get("/", contactUScontroll.getAllMs);
router.post("/", contactUScontroll.addMs);
router.get("/:id", contactUScontroll.getByID);
router.put("/:id", contactUScontroll.replyUser);
router.delete("/:id", contactUScontroll.deletecontactM);

//export
module.exports = router;