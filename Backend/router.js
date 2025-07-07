const express = require("express");
const router = express.Router();

const brandRoutes = require("./Routes/brandRoutes");
const categoryRoutes = require("./Routes/categoryRoutes");
const orderRoutes = require('./Routes/orderRoutes');
const productRoutes = require("./Routes/productRoutes");
const cartRoutes = require('./Routes/CartRoutes');
const notification = require('./Routes/notificationRoutes');
const cutomerRoutes = require("./Routes/customerRoutes");
const userRoutes = require("./Routes/userRoutes");
const adminRoutes = require("./Routes/adminRoutes");
const supporterRoutes = require("./Routes/customerSupporterRoutes");
const contactrouter = require('./Routes/contactroute');
const ticketRouter = require('./Routes/ticketroute');
const chatRouter = require('./Routes/chatRoute');


router.use("/brands", brandRoutes); 
router.use("/categories", categoryRoutes);
router.use("/products", productRoutes);
router.use("/cart", cartRoutes);
router.use("/orders", orderRoutes);
router.use("/notifications", notification);
router.use("/users", userRoutes);
router.use("/customers", cutomerRoutes);
router.use("/admins", adminRoutes);
router.use("/supporters", supporterRoutes);
router.use("/contact", contactrouter);
router.use("/tickets", ticketRouter);
router.use("/chats", chatRouter);



module.exports = router;
