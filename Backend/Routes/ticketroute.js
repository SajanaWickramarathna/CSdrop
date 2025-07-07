const express = require("express");
const router = express.Router();
const ticketController = require("../Controllers/ticketControll");

router.get("/", ticketController.getAllTickets);
router.post("/", ticketController.addTicket);
router.get("/ticket/:id", ticketController.getTicketByID);
router.get("/tickets/:user_id", ticketController.getTicketsByUserID);
router.put("/:id", ticketController.updateTicket);
router.delete("/:id", ticketController.deleteTicket);

module.exports = router;