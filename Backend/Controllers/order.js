const nodemailer = require("nodemailer");
const Order = require("../Models/order");
const Cart = require("../Models/Cart");
const User = require("../Models/user");
const Product = require("../Models/product");
const Notification = require("../Models/notification"); // Import Notification

// Configure Nodemailer
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "sajanaanupama123@gmail.com",
    pass: "melc veit raso vsqm",
  },
});

const sendEmail = (to, subject, text, html) => {
  const mailOptions = {
    from: "sajanaanupama123@gmail.com",
    to,
    subject,
    text,
    html,
  };
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) console.error("❌ Email error:", error);
    else console.log("📧 Email sent:", info.response);
  });
};

// CREATE ORDER
exports.createOrder = async (req, res) => {
  try {
    const { user_id, email, shipping_address, payment_method, total_price } =
      req.body;
    if (!user_id || !email || !shipping_address || !payment_method)
      return res.status(400).json({ message: "All fields are required" });

    if (!["COD", "Payment Slip"].includes(payment_method))
      return res.status(400).json({ message: "Invalid payment method" });

    if (payment_method === "Payment Slip" && !req.file)
      return res.status(400).json({ message: "Payment slip is required" });

    const cart = await Cart.findOne({ user_id: Number(user_id) });
    if (!cart || !cart.items.length)
      return res.status(400).json({ message: "Cart is empty" });

    const user = await User.findOne({ user_id: Number(user_id) });

    const newOrder = new Order({
      user_id: Number(user_id),
      items: cart.items.map((item) => ({
        product_id: Number(item.product_id),
        quantity: item.quantity,
        price: item.price,
      })),
      total_price,
      shipping_address,
      status: "pending",
      payment_status: payment_method === "COD" ? "pending" : "paid",
      payment_method,
      payment_slip: req.file ? req.file.filename : null,
    });

    await newOrder.save();
    await Cart.findOneAndDelete({ user_id: Number(user_id) });

    const productDetailsText = newOrder.items
      .map((p) => `Product ID: ${p.product_id}, Qty: ${p.quantity}`)
      .join("\n");

    const productDetailsHTML = newOrder.items
      .map((p) => `<li>Product ID: ${p.product_id}, Qty: ${p.quantity}</li>`)
      .join("");

    // Customer email
    sendEmail(
      email,
      "🛒 Order Confirmation - CS Drop",
      `Hi ${user?.firstName || "Customer"},\nThanks for ordering!\nOrder ID: ${
        newOrder.order_id
      }\nTotal: LKR${newOrder.total_price}\n\n${productDetailsText}`,
      `<h3>Hi ${user?.firstName || "Customer"},</h3>
   <p>Thanks for your order with <strong>CS Drop</strong>.</p>
   <p><strong>Order ID:</strong> ${newOrder.order_id}</p>
   <p><strong>Total:</strong> LKR${newOrder.total_price}</p>
   <ul>${productDetailsHTML}</ul>`
    );

    // Admin email
    sendEmail(
      "sajanaanupama123@gmail.com",
      "📦 New Order Received - CS Drop",
      `New order from ${user?.firstName || "N/A"} (${user?.email})\nOrder ID: ${
        newOrder.order_id
      }\nTotal: LKR${newOrder.total_price}\n${productDetailsText}`,
      `<h3>New Order Received</h3>
   <p><strong>Customer:</strong> ${user?.firstName || "N/A"} (${
        user?.email
      })</p>
   <p><strong>Order ID:</strong> ${newOrder.order_id}</p>
   <p><strong>Total:</strong> LKR${newOrder.total_price}</p>
   <ul>${productDetailsHTML}</ul>`
    );

    // 🔔 Notification for User
    await Notification.create({
      user_id: Number(user_id),
      message: `Your order has been placed successfully! Order ID: ${newOrder.order_id}`,
    });

    // Notify admins
    const admins = await User.find({ role: 'admin' });
    const adminNotifications = admins.map(admin => ({
      user_id: admin.user_id,
      message: `New order placed by ${user?.firstName || "Customer"}. Order ID: ${newOrder.order_id}`,
    }));
    await Notification.insertMany(adminNotifications);

    return res
      .status(201)
      .json({ message: "Order placed successfully", order: newOrder });
  } catch (error) {
    console.error("❌ createOrder Error:", error);
    return res.status(500).json({ message: "Internal Server Error", error });
  }
};

// GET USER ORDERS
exports.getUserOrders = async (req, res) => {
  try {
    const { user_id } = req.params;
    const orders = await Order.find({ user_id: Number(user_id) }).sort({
      created_at: -1,
    });
    res.status(200).json(orders);
  } catch (error) {
    console.error("❌ getUserOrders Error:", error);
    res.status(500).json({ message: "Internal Server Error", error });
  }
};

// GET ALL ORDERS
// GET ALL ORDERS
exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find().sort({ created_at: -1 });
    const users = await User.find();

    const ordersWithUser = orders.map((order) => {
      const user = users.find((u) => u.user_id === order.user_id);
      return {
        ...order._doc,
        user_name: user ? `${user.firstName} ${user.lastName}` : "Unknown",
      };
    });

    res.status(200).json(ordersWithUser);
  } catch (error) {
    console.error("❌ getAllOrders Error:", error);
    res.status(500).json({ message: "Internal Server Error", error });
  }
};


// UPDATE ORDER STATUS Admin
exports.updateOrderStatus = async (req, res) => {
  try {
    const { order_id } = req.params;
    const { status } = req.body;

    const updatedOrder = await Order.findOneAndUpdate(
      { order_id: Number(order_id) },
      { status },
      { new: true }
    );

    if (!updatedOrder)
      return res.status(404).json({ message: "Order not found" });

    const user = await User.findOne({ user_id: updatedOrder.user_id });
    if (!user) return res.status(404).json({ message: "User not found" });

    // 🔔 Notification
    await Notification.create({
      user_id: Number(updatedOrder.user_id),
      message: `Order ${updatedOrder.order_id} status updated to ${status}`,
    });

    // 📧 Send Email Notification
    sendEmail(
      user.email,
      "📦 Order Status Update - CS Drop",
      `Hi ${user.firstName || "Customer"},\nYour order (ID: ${
        updatedOrder.order_id
      }) status has been updated to "${status}".`,
      `<h3>Hi ${user.firstName || "Customer"},</h3>
   <p>Your order (ID: <strong>${
     updatedOrder.order_id
   }</strong>) status has been updated to "<strong>${status}</strong>".</p>`
    );

    res
      .status(200)
      .json({ message: "Order status updated", order: updatedOrder });
  } catch (error) {
    console.error("❌ updateOrderStatus Error:", error);
    res.status(500).json({ message: "Internal Server Error", error });
  }
};

// GET ORDER BY ID - new
exports.getOrderById = async (req, res) => {
  try {
    const { order_id } = req.params;
    const order = await Order.findOne({ order_id: Number(order_id) });
    if (!order) return res.status(404).json({ message: "Order not found" });
    // const productDetails = await Promise.all(
    //   order.items.map(async (item) => {
    //     const product = await Product.findOne({ product_id: item.product_id });
    //     return {
    //       ...item,
    //       product_name: product ? product.product_name : "Unknown",
    //       product_price: product ? product.product_price : 0,
    //     };
    //   })
    // );
    res.status(200).json(order);
  } catch (error) {
    console.error("❌ getOrderById Error:", error);
    res.status(500).json({ message: "Internal Server Error", error });
  }
};

// CANCEL ORDER
exports.cancelOrder = async (req, res) => {
  try {
    const { order_id } = req.params;

    const cancelledOrder = await Order.findOneAndUpdate(
      { order_id: order_id, status: { $nin: ["shipped", "delivered"] } },
      { status: "cancelled" },
      { new: true }
    );

    if (!cancelledOrder)
      return res.status(400).json({ message: "Order cannot be cancelled" });

    // 🔔 Notification
    await Notification.create({
      user_id: Number(cancelledOrder.user_id),
      message: `Your order ${cancelledOrder.order_id} has been cancelled.`,
    });

    res
      .status(200)
      .json({ message: "Order cancelled successfully", order: cancelledOrder });
  } catch (error) {
    console.error("❌ cancelOrder Error:", error);
    res.status(500).json({ message: "Internal Server Error", error });
  }
};

// GET ANALYTICS
exports.getAnalytics = async (req, res) => {
  try {
    const { timeRange } = req.query;

    const now = new Date();
    let startDate;

    switch (timeRange) {
      case "today":
        startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        break;
      case "week":
        startDate = new Date(now);
        startDate.setDate(now.getDate() - 7);
        break;
      case "month":
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
        break;
      case "year":
        startDate = new Date(now.getFullYear(), 0, 1);
        break;
      default:
        startDate = null;
    }

    let orders = startDate
      ? await Order.find({ created_at: { $gte: startDate } }).sort({ created_at: 1 })
      : await Order.find().sort({ created_at: 1 });

    const users = await User.find();

    // The rest of your existing analytics logic here...
    const totalOrders = orders.length;
    const totalRevenue = orders.reduce((sum, order) => sum + (order.total_price || 0), 0);
    const averageOrderValue = totalOrders ? totalRevenue / totalOrders : 0;
    const conversionRate = 100;

    const totalCustomers = new Set(orders.map((order) => order.user_id)).size;

    const statusCounts = {};
    orders.forEach((order) => {
      statusCounts[order.status] = (statusCounts[order.status] || 0) + 1;
    });

    const paymentMethodCounts = {};
    orders.forEach((order) => {
      paymentMethodCounts[order.payment_method] = (paymentMethodCounts[order.payment_method] || 0) + 1;
    });

    const productSales = {};
    orders.forEach((order) => {
      order.items.forEach((item) => {
        productSales[item.product_id] = (productSales[item.product_id] || 0) + item.quantity;
      });
    });

    const topSellingProducts = Object.entries(productSales)
      .map(([product_id, quantity]) => ({ product_id, quantity }))
      .sort((a, b) => b.quantity - a.quantity)
      .slice(0, 5);

    const customerStats = {};
    orders.forEach((order) => {
      const userId = order.user_id;
      if (!customerStats[userId]) {
        customerStats[userId] = { orders: 0, total: 0 };
      }
      customerStats[userId].orders += 1;
      customerStats[userId].total += order.total_price;
    });

    const topCustomers = Object.entries(customerStats)
      .map(([user_id, data]) => {
        const customer = users.find((c) => c.user_id === Number(user_id));
        return {
          user_id,
          name: customer ? `${customer.firstName} ${customer.lastName}` : "Unknown",
          ...data,
        };
      })
      .sort((a, b) => b.total - a.total)
      .slice(0, 5);

    const recentOrders = orders
      .slice(-5)
      .reverse()
      .map((order) => {
        const customer = users.find((u) => u.user_id === order.user_id);
        return {
          id: order.order_id,
          customerName: customer ? `${customer.firstName} ${customer.lastName}` : "Unknown",
          date: order.created_at,
          amount: order.total_price,
          status: order.status.toLowerCase(),
        };
      });

    const salesDataMap = {};
    orders.forEach((order) => {
      const date = order.created_at.toISOString().split('T')[0];
      if (!salesDataMap[date]) {
        salesDataMap[date] = { date, sales: 0, orders: 0 };
      }
      salesDataMap[date].sales += order.total_price;
      salesDataMap[date].orders += 1;
    });

    const salesData = Object.values(salesDataMap).sort((a, b) => new Date(a.date) - new Date(b.date));

    const categoryDistribution = [
      { name: "Electronics", value: 50000 },
      { name: "Clothing", value: 30000 },
      { name: "Accessories", value: 20000 },
    ];

    res.status(200).json({
      totalOrders,
      totalCustomers,
      totalRevenue,
      averageOrderValue,
      conversionRate,
      statusCounts,
      paymentMethodCounts,
      topSellingProducts,
      topCustomers,
      recentOrders,
      salesData,
      categoryDistribution,
    });
  } catch (error) {
    console.error("❌ getAnalytics Error:", error);
    res.status(500).json({ message: "Internal Server Error", error });
  }
};



// GET USER ORDER SUMMARY
exports.getUserOrderSummary = async (req, res) => {
  try {
    const { user_id } = req.params;

    const orders = await Order.find({ user_id: Number(user_id) });

    const summary = {
      totalOrders: orders.length,
      pending: 0,
      processing: 0,
      shipped: 0,
      delivered: 0,
      cancelled: 0,
    };

    orders.forEach((order) => {
      const status = order.status.toLowerCase();
      if (summary.hasOwnProperty(status)) {
        summary[status]++;
      }
    });

    res.status(200).json(summary);
  } catch (error) {
    console.error("❌ getUserOrderSummary Error:", error);
    res.status(500).json({ message: "Internal Server Error", error });
  }
};


