const Ticket = require("../Models/ticketModel");
const Notification = require("../Models/notification");
const User = require("../Models/user");

// Get all tickets
const getAllTickets = async (req, res, next) => {
  let tickets;
  try {
    tickets = await Ticket.find();
  } catch (err) {
    console.log(err);
  }
  if (!tickets) {
    return res.status(404).json({ message: "No Tickets Found" });
  }
  return res.status(200).json({ tickets });
};

// Get tickets by user ID
const getTicketsByUserID = async (req, res, next) => {
  const user_id = req.params.user_id;
  let tickets;
  try {
    tickets = await Ticket.find({ user_id: user_id });
  } catch (err) {
    console.log(err);
  }
  if (!tickets) {
    return res.status(404).json({ message: "No Tickets Found" });
  }
  return res.status(200).json({ tickets });
};
// Delete ticket by ticket_id
// Delete ticket by ticket_id (custom incremented id)
const deleteTicket = async (req, res) => {
  try {
    const ticket = await Ticket.findOneAndDelete({ ticket_id: parseInt(req.params.id) });
    if (!ticket) {
      return res.status(404).json({ message: "Ticket not found" });
    }

    await Notification.create({
      user_id: ticket.user_id,
      message: `Your ticket has been deleted. Ticket ID: ${ticket.ticket_id}`,
    });

    res.status(200).json({ ticket });
  } catch (err) {
    console.error("Delete ticket error:", err);
    res.status(500).json({ message: "Failed to delete ticket", error: err.message });
  }
};


// Add new ticket with auto-incremented ticket_id
const addTicket = async (req, res, next) => {
  const { user_id, name, gmail, phoneNumber, Categories, message, priority } = req.body;

  let lastTicket = await Ticket.findOne().sort({ ticket_id: -1 });
  const newId = lastTicket ? lastTicket.ticket_id + 1 : 1;

  let ticket;
  try {
    ticket = new Ticket({
      ticket_id: newId,
      name,
      user_id,
      gmail,
      phoneNumber,
      Categories,
      message,
      priority,
    });
    await ticket.save();

    // 🔔 Notification for User
    await Notification.create({
      user_id: Number(user_id),
      message: `Your ticket has been created successfully. Ticket ID: ${ticket.ticket_id}`,
    });

     // Notify admins
    // 🔔 Notify all Customer Supporters
    const supporters = await User.find({ role: 'customer_supporter' });
    const supporterNotifications = supporters.map(support => ({
      user_id: support.user_id,
      message: `New support ticket requires attention. Ticket ID: ${ticket.ticket_id}`,
    }));
    await Notification.insertMany(supporterNotifications);

  } catch (err) {
    console.log(err);
  }
  if (!ticket) {
    return res.status(404).json({ message: "Unable to add ticket" });
  }
  return res.status(200).json({ ticket });
};

// Get ticket by ticket_id
const getTicketByID = async (req, res, next) => {
  const id = parseInt(req.params.id);
  let ticket;
  try {
    ticket = await Ticket.findOne({ ticket_id: id });
  } catch (err) {
    console.log(err);
  }
  if (!ticket) {
    return res.status(404).json({ message: "Unable to Find Ticket" });
  }
  return res.status(200).json({ ticket });
};

// Update ticket by ticket_id
const updateTicket = async (req, res, next) => {
  const id = parseInt(req.params.id);
  const { name, gmail, phoneNumber, Categories, message, status, priority } = req.body;

  let ticket;
  try {
    ticket = await Ticket.findOneAndUpdate(
      { ticket_id: id },
      {
        name,
        gmail,
        phoneNumber,
        Categories,
        message,
        status,
        priority,
      },
      { new: true }
    );

    // 🔔 Notification for User
    await Notification.create({
      user_id: Number(ticket.user_id),
      message: `Your ticket status has been updated to ${status}. Ticket ID: ${ticket.ticket_id}`,
    });

  } catch (err) {
    console.log(err);
  }
  if (!ticket) {
    return res.status(404).json({ message: "Unable to Update Ticket" });
  }
  return res.status(200).json({ ticket });
};




exports.getAllTickets = getAllTickets;
exports.getTicketsByUserID = getTicketsByUserID;
exports.addTicket = addTicket;
exports.getTicketByID = getTicketByID;
exports.updateTicket = updateTicket;
exports.deleteTicket = deleteTicket;