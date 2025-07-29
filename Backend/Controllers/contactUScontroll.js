const contact = require("../Models/contactModel");
const nodemailer = require("nodemailer");
const Notification = require("../Models/notification");
const User = require("../Models/user");

// Email transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "sajanaanupama123@gmail.com",
    pass: "melc veit raso vsqm", // App password
  },
});

// Get all messages
const getAllMs = async (req, res, next) => {
  let Ms;
  try {
    Ms = await contact.find();
  } catch (err) {
    console.log(err);
  }
  if (!Ms) {
    return res.status(404).json({ message: "No Messages Found" });
  }
  return res.status(200).json({ Ms });
};

// Add message with auto-incremented contact_id
const addMs = async (req, res, next) => {
  const { name, gmail, phoneNumber, message } = req.body;
  let lastEntry = await contact.findOne().sort({ contact_id: -1 });
  const newId = lastEntry ? lastEntry.contact_id + 1 : 1;

  let Ms;
  try {
    Ms = new contact({ contact_id: newId, name, gmail, phoneNumber, message });
    await Ms.save();

    const mailOptions = {
      from: `"${name}" <${gmail}>`,
      to: "sajanaanupama123@gmail.com",
      replyTo: gmail,
      subject: "New Contact Us Form Submission",
      text: `You have received a new message:\n\nName: ${name}\nEmail: ${gmail}\nPhone: ${phoneNumber}\nMessage: ${message}\n\nPlease respond soon.`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log("Error sending email to admin:", error);
      } else {
        console.log("Email sent to admin: " + info.response);
      }
    });

    // ✅ Notify all customer supporters
    const supporters = await User.find({ role: 'customer_supporter' });
    const notifications = supporters.map((support) => ({
      user_id: support.user_id,
      message: `New contact form submitted by ${name}. Contact ID: ${newId}`,
    }));
    await Notification.insertMany(notifications);

  } catch (err) {
    console.log(err);
  }
  if (!Ms) {
    return res.status(404).json({ message: "Unable to add message" });
  }
  return res.status(200).json({ Ms });
};

// Get by contact_id
const getByID = async (req, res, next) => {
  const id = parseInt(req.params.id);
  let Ms;
  try {
    Ms = await contact.findOne({ contact_id: id });
  } catch (err) {
    console.log(err);
  }
  if (!Ms) {
    return res.status(404).json({ message: "Unable to Find message" });
  }
  return res.status(200).json({ Ms });
};

// Update reply and send email
const replyUser = async (req, res, next) => {
  const id = parseInt(req.params.id);
  const { name, gmail, phoneNumber, message, reply } = req.body;

  let Ms;
  try {
    Ms = await contact.findOneAndUpdate(
      { contact_id: id },
      { name, gmail, phoneNumber, message, reply },
      { new: true }
    );

    const mailOptions = {
      from: "KHB Associates pvt ltd <sajanaanupama123@gmail.com>",
      to: gmail,
      subject: "Reply to Your Contact Form Submission",
      text: `Dear ${name},\n\nThanks for reaching out.\n\nYour message: "${message}"\n\nReply: "${reply}"\n\nBest regards,\ncs drop team`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log("Error sending email:", error);
      } else {
        console.log("Email sent: " + info.response);
      }
    });
  } catch (err) {
    console.log(err);
  }

  if (!Ms) {
    return res.status(404).json({ message: "Unable to Reply Message" });
  }
  return res.status(200).json({ Ms });
};

// Delete by contact_id
const deletecontactM = async (req, res, next) => {
  const id = parseInt(req.params.id);
  let Ms;
  try {
    Ms = await contact.findOneAndDelete({ contact_id: id });
  } catch (err) {
    console.log(err);
  }

  if (!Ms) {
    return res.status(404).json({ message: "Unable to delete contact Message" });
  }
  return res.status(200).json({ Ms });
};

exports.getAllMs = getAllMs;
exports.addMs = addMs;
exports.getByID = getByID;
exports.replyUser = replyUser;
exports.deletecontactM = deletecontactM;
