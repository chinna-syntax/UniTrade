const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const app = express();
const auth = require("./middleware/auth");

// ─── IN-MEMORY DATABASE ──────────────────────────────────────────────────────
// Pre-seeded hostel exchange items with real Unsplash photos — no MongoDB needed

let products = [
  {
    _id: "p001",
    useremail: "senior@college.edu",
    title: "Used Mattress (Single Bed)",
    description: "Barely used mattress from my first year. Good condition, no stains. Comes with a bed sheet. Perfect for hostel rooms.",
    address: { city: "Mumbai", state: "Maharashtra" },
    price: "800",
    owner: "Senior Student",
    ownerpicture: "",
    catagory: "Furniture",
    subcatagory: "Beds & Mattresses",
    productpic1: "https://picsum.photos/seed/mattress42/600/450",
    createdAt: new Date("2024-01-10"),
  },
  {
    _id: "p002",
    useremail: "senior@college.edu",
    title: "Engineering Drafter Set",
    description: "Full drafter set with T-square, set squares, protractor, and compass. Used for 2 semesters. All instruments intact.",
    address: { city: "Pune", state: "Maharashtra" },
    price: "350",
    owner: "Senior Student",
    ownerpicture: "",
    catagory: "Books & Education",
    subcatagory: "Stationery",
    productpic1: "https://picsum.photos/seed/drafter17/600/450",
    createdAt: new Date("2024-01-12"),
  },
  {
    _id: "p003",
    useremail: "senior@college.edu",
    title: "Second-hand WiFi Router (TP-Link)",
    description: "TP-Link router with dual-band support. Works perfectly. Selling because I'm moving out. Can share internet with multiple devices.",
    address: { city: "Bangalore", state: "Karnataka" },
    price: "600",
    owner: "Senior Student",
    ownerpicture: "",
    catagory: "Electronics & Appliances",
    subcatagory: "Networking Devices",
    productpic1: "https://picsum.photos/seed/router88/600/450",
    createdAt: new Date("2024-01-15"),
  },
  {
    _id: "p004",
    useremail: "senior@college.edu",
    title: "Wooden Study Table",
    description: "Solid wooden study table with a drawer and shelf. Fits perfectly in a standard hostel room. Self-pickup only.",
    address: { city: "Delhi", state: "Delhi" },
    price: "1200",
    owner: "Senior Student",
    ownerpicture: "",
    catagory: "Furniture",
    subcatagory: "Tables & Desks",
    productpic1: "https://picsum.photos/seed/desk23/600/450",
    createdAt: new Date("2024-01-18"),
  },
  {
    _id: "p005",
    useremail: "senior@college.edu",
    title: "Engineering Textbooks Bundle (3rd Year CS)",
    description: "Full set of 3rd year Computer Science textbooks: OS, DBMS, Computer Networks, and Algorithms. All in good condition with minimal annotations.",
    address: { city: "Hyderabad", state: "Telangana" },
    price: "500",
    owner: "Senior Student",
    ownerpicture: "",
    catagory: "Books & Education",
    subcatagory: "Textbooks",
    productpic1: "https://picsum.photos/seed/books55/600/450",
    createdAt: new Date("2024-01-20"),
  },
  {
    _id: "p006",
    useremail: "senior@college.edu",
    title: "Table Fan (Bajaj) — Working Condition",
    description: "Bajaj table fan, 3-speed settings, works perfectly fine. Selling because I'm buying a bigger fan. Great for hostel summers.",
    address: { city: "Chennai", state: "Tamil Nadu" },
    price: "450",
    owner: "Senior Student",
    ownerpicture: "",
    catagory: "Electronics & Appliances",
    subcatagory: "Fans",
    productpic1: "https://picsum.photos/seed/fan31/600/450",
    createdAt: new Date("2024-01-22"),
  },
  {
    _id: "p007",
    useremail: "senior@college.edu",
    title: "Atlas Cycle — Hostel Daily Ride",
    description: "Atlas cycle in good working condition. Gear-less, lightweight. Used for 2 years for campus commuting. Tyres recently changed.",
    address: { city: "Jaipur", state: "Rajasthan" },
    price: "1800",
    owner: "Senior Student",
    ownerpicture: "",
    catagory: "Mobiles",
    subcatagory: "Bicycles",
    productpic1: "https://picsum.photos/seed/cycle77/600/450",
    createdAt: new Date("2024-01-24"),
  },
  {
    _id: "p008",
    useremail: "senior@college.edu",
    title: "Scientific Calculator (Casio FX-991)",
    description: "Casio FX-991ES Plus scientific calculator. Essential for Engineering maths. Works perfectly, all keys functional.",
    address: { city: "Kolkata", state: "West Bengal" },
    price: "280",
    owner: "Senior Student",
    ownerpicture: "",
    catagory: "Books & Education",
    subcatagory: "Stationery",
    productpic1: "https://picsum.photos/seed/calc99/600/450",
    createdAt: new Date("2024-01-26"),
  },
];

// In-memory messages and contacts
let messages = [];
let contacts = [];

// ─── ROUTES ──────────────────────────────────────────────────────────────────

app.use(cors());
app.use(bodyParser.json());

// Keep the API compatible with both local Express development and Vercel's
// same-domain /api function routing.
app.use((req, res, next) => {
  const passthroughPaths = ["/api/check-status", "/api/new-messages", "/api/newchats", "/api/contact"];
  if (req.path.startsWith("/api/") && !passthroughPaths.includes(req.path)) {
    req.url = req.url.replace(/^\/api/, "");
  }
  next();
});

// --- Auth / Status Routes ---
app.get("/api/check-status", (req, res) => {
  res.status(200).json({ status: "Backend is running (No DB)" });
});

app.get("/auth-endpoint", auth, (req, res) => {
  res.json({ isAuthenticated: true });
});

// Dummy login — always succeeds, no password check
app.post("/login", (req, res) => {
  res.status(200).json({
    message: "Login Successful",
    token: "demo-token-no-auth-needed",
    email: "senior@college.edu",
    name: "Senior Student",
    picture: "",
    phone: "9999999999",
  });
});

// Dummy register — always succeeds
app.post("/register", (req, res) => {
  res.status(201).json({ message: "User Created Successfully (Demo Mode)" });
});

// Google auth — returns dummy user
app.post("/google-auth", (req, res) => {
  res.status(200).json({
    token: "demo-token-no-auth-needed",
    email: "senior@college.edu",
    name: "Senior Student",
    picture: "",
    phone: "",
  });
});

// Forgot/reset password — mock success
app.post("/forgot-password", (req, res) => {
  res.status(200).json({ message: "Password reset OTP sent (Demo Mode — no real email sent)" });
});
app.post("/reset-password", (req, res) => {
  res.status(200).json({ message: "Password reset successful (Demo Mode)" });
});

// ─── PRODUCT ROUTES ──────────────────────────────────────────────────────────

app.post("/add_product", auth, (req, res) => {
  try {
    const { title, description, address, price, name, catagory, subcatagory } = req.body;

    const errors = [];
    if (!title || title.trim().length < 3) errors.push("Title must be at least 3 characters");
    if (!description || description.trim().length < 10) errors.push("Description must be at least 10 characters");
    if (!address) errors.push("Location is required");
    if (!price || isNaN(price) || price <= 0) errors.push("Valid price is required");
    if (!name || name.trim().length === 0) errors.push("Seller name is required");
    if (!catagory) errors.push("Category is required");
    if (!subcatagory) errors.push("Subcategory is required");

    if (errors.length > 0) {
      return res.status(400).json({ message: "Validation failed", errors });
    }

    const newProduct = {
      _id: "p" + Date.now(),
      useremail: req.user.userEmail,
      title: title.trim(),
      description: description.trim(),
      address,
      price,
      owner: name.trim(),
      ownerpicture: "",
      catagory,
      subcatagory,
      // Always use placeholder image — no Cloudinary upload needed
      productpic1: PLACEHOLDER_IMG,
      createdAt: new Date(),
    };

    products.push(newProduct);
    res.status(200).json({ message: "Product saved successfully.", productId: newProduct._id });
  } catch (err) {
    console.error("Error saving product:", err);
    res.status(500).json({ message: "Failed to save the product." });
  }
});

app.get("/myads_view", auth, (req, res) => {
  const userProducts = products.filter((p) => p.useremail === req.user.userEmail);
  res.json(userProducts);
});

app.delete("/myads_delete/:id", auth, (req, res) => {
  const idx = products.findIndex(
    (p) => p._id === req.params.id && p.useremail === req.user.userEmail
  );
  if (idx === -1) return res.status(404).json({ error: "Product not found" });
  const [deleted] = products.splice(idx, 1);
  res.json(deleted);
});

app.post("/previewad/:id", auth, (req, res) => {
  const product = products.find((p) => p._id === req.params.id);
  if (!product) return res.status(404).json({ error: "Product not found" });
  const own = product.useremail === req.user.userEmail;
  res.json({ product, own });
});

app.post("/previewad/notloggedin/:id", (req, res) => {
  const product = products.find((p) => p._id === req.params.id);
  if (!product) return res.status(404).json({ error: "Product not found" });
  res.json({ product });
});

app.get("/getProducts", (req, res) => {
  res.status(200).json(products);
});

app.get("/getProductsbyCategory/:category", (req, res) => {
  const { category } = req.params;
  const result = products.filter(
    (p) => p.catagory === category || p.subcatagory === category
  );
  res.status(200).json(result);
});

app.get("/search", (req, res) => {
  const { q } = req.query;
  if (!q) return res.status(200).json(products);
  const regex = new RegExp(q, "i");
  const result = products.filter((p) => regex.test(p.title));
  res.status(200).json(result);
});

app.get("/getProductsbyemail", (req, res) => {
  const { useremail } = req.query;
  const result = products.filter((p) => p.useremail === useremail);
  res.status(200).json(result);
});

// ─── PROFILE ROUTES ──────────────────────────────────────────────────────────

app.post("/send-verification-email", auth, (req, res) => {
  res.status(200).json({ message: "Verification OTP sent (Demo Mode)" });
});

app.post("/verify-email", auth, (req, res) => {
  res.json({
    message: "Email verification successful (Demo Mode)",
    email: "senior@college.edu",
    token: "demo-token-no-auth-needed",
    name: "Senior Student",
  });
});

app.get("/verification-status", (req, res) => {
  res.json({ isVerified: true });
});

app.post("/profile_edit", auth, (req, res) => {
  const { name, imageUrl, phoneNumber } = req.body;
  res.status(200).json({ name, picture: imageUrl, phone: phoneNumber });
});

app.get("/profilesearch", (req, res) => {
  res.json({ name: "Senior Student", picture: "" });
});

// ─── CHAT ROUTES ─────────────────────────────────────────────────────────────

app.post("/sendMessage", auth, (req, res) => {
  const { id, message: messageContent, to } = req.body;
  const product = products.find((p) => p._id === id);
  if (!product) return res.status(400).json({ success: false, message: "Invalid product" });

  const newMessage = {
    _id: "m" + Date.now(),
    from: req.user.userEmail,
    to,
    message: messageContent,
    product_id: id,
    createdAt: new Date(),
  };
  messages.push(newMessage);
  res.status(200).json({ success: true, message: "Message sent successfully" });
});

app.get("/api/new-messages", auth, (req, res) => {
  const { id, to } = req.query;
  const mailfrom = req.user.userEmail;
  const result = messages.filter(
    (m) =>
      m.product_id === id &&
      ((m.from === mailfrom && m.to === to) || (m.to === mailfrom && m.from === to))
  );
  res.json(result);
});

app.get("/api/newchats", auth, (req, res) => {
  const mailfrom = req.user.userEmail;
  const relevant = messages.filter((m) => m.from === mailfrom || m.to === mailfrom);
  // Get latest message per product
  const chatMap = {};
  relevant.forEach((m) => {
    if (!chatMap[m.product_id] || chatMap[m.product_id].createdAt < m.createdAt) {
      chatMap[m.product_id] = m;
    }
  });
  const chats = Object.values(chatMap).sort((a, b) => b.createdAt - a.createdAt);
  chats.forEach((c) => {
    c.user = { name: "Hostel Resident", picture: "" };
  });
  res.json(chats);
});

app.post("/deletechat/:id", auth, (req, res) => {
  const { id } = req.params;
  const mailfrom = req.user.userEmail;
  const before = messages.length;
  messages = messages.filter(
    (m) => !(m.product_id === id && (m.from === mailfrom || m.to === mailfrom))
  );
  if (messages.length < before) {
    res.status(200).json({ message: "Chat deleted" });
  } else {
    res.status(404).json({ message: "Chat not found" });
  }
});

// ─── CONTACT ROUTES ───────────────────────────────────────────────────────────

app.post("/api/contact", (req, res) => {
  const { name, email, subject, message } = req.body;
  if (!name || !email || !subject || !message) {
    return res.status(400).json({ success: false, message: "All fields are required" });
  }
  const newContact = { _id: "c" + Date.now(), name, email, subject, message, status: "new", createdAt: new Date() };
  contacts.push(newContact);
  res.status(201).json({ success: true, message: "Your message has been sent successfully." });
});

app.get("/api/contact", (req, res) => {
  res.status(200).json({ success: true, contacts });
});

// ─── ADMIN ROUTES ─────────────────────────────────────────────────────────────

const adminAuth = require("./middleware/adminAuth");

app.get("/admin/check", adminAuth, (req, res) => {
  res.json({ isAdmin: true, email: req.user.userEmail });
});

app.get("/admin/stats", adminAuth, (req, res) => {
  res.json({
    overview: {
      totalUsers: 1,
      totalProducts: products.length,
      totalMessages: messages.length,
      totalContacts: contacts.length,
      newContacts: contacts.filter((c) => c.status === "new").length,
      verifiedUsers: 1,
      newUsersThisMonth: 1,
      newProductsThisMonth: products.length,
      verificationRate: "100.0",
    },
    productsByCategory: [{ _id: "Furniture", count: 2 }, { _id: "Books & Education", count: 2 }, { _id: "Electronics & Appliances", count: 2 }],
    productsPerDay: [],
    usersPerDay: [],
    topSellers: [{ _id: "senior@college.edu", productCount: products.length, owner: "Senior Student" }],
    priceStats: { avgPrice: 650, maxPrice: 1200, minPrice: 350, totalValue: 3900 },
    recentProducts: products.slice(0, 5),
    recentUsers: [{ name: "Senior Student", email: "senior@college.edu", isEmailVerified: true, createdAt: new Date() }],
    recentContacts: contacts.slice(0, 5),
  });
});

app.get("/admin/users", adminAuth, (req, res) => {
  res.json({
    users: [{ _id: "123", name: "Senior Student", email: "senior@college.edu", isEmailVerified: true, isAdmin: true, productCount: products.length, createdAt: new Date() }],
    pagination: { page: 1, limit: 10, total: 1, pages: 1 },
  });
});

app.get("/admin/products", adminAuth, (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const search = req.query.search || "";
  const category = req.query.category || "";
  let result = products;
  if (search) result = result.filter((p) => new RegExp(search, "i").test(p.title) || new RegExp(search, "i").test(p.owner));
  if (category) result = result.filter((p) => p.catagory === category);
  const start = (page - 1) * limit;
  res.json({ products: result.slice(start, start + limit), pagination: { page, limit, total: result.length, pages: Math.ceil(result.length / limit) } });
});

app.delete("/admin/users/:id", adminAuth, (req, res) => {
  res.json({ message: "User deleted (Demo Mode)" });
});

app.delete("/admin/products/:id", adminAuth, (req, res) => {
  const idx = products.findIndex((p) => p._id === req.params.id);
  if (idx === -1) return res.status(404).json({ message: "Product not found" });
  products.splice(idx, 1);
  res.json({ message: "Product deleted successfully" });
});

app.patch("/admin/users/:id/toggle-admin", adminAuth, (req, res) => {
  res.json({ message: "Admin status toggled (Demo Mode)", isAdmin: true });
});

app.patch("/admin/users/:id/toggle-verified", adminAuth, (req, res) => {
  res.json({ message: "Email verification toggled (Demo Mode)", isEmailVerified: true });
});

app.get("/admin/categories", adminAuth, (req, res) => {
  const cats = [...new Set(products.map((p) => p.catagory))];
  res.json(cats);
});

app.get("/admin/contacts", adminAuth, (req, res) => {
  res.json({ contacts, pagination: { page: 1, limit: 10, total: contacts.length, pages: 1 } });
});

app.patch("/admin/contacts/:id/status", adminAuth, (req, res) => {
  const { status } = req.body;
  const contact = contacts.find((c) => c._id === req.params.id);
  if (!contact) return res.status(404).json({ message: "Contact not found" });
  contact.status = status;
  res.json({ message: "Status updated", contact });
});

app.delete("/admin/contacts/:id", adminAuth, (req, res) => {
  const idx = contacts.findIndex((c) => c._id === req.params.id);
  if (idx === -1) return res.status(404).json({ message: "Contact not found" });
  contacts.splice(idx, 1);
  res.json({ message: "Contact deleted successfully" });
});

app.post("/admin/init", (req, res) => {
  res.json({ message: "Admin already initialized (Demo Mode)" });
});

// ─── START SERVER ─────────────────────────────────────────────────────────────

if (require.main === module) {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`UniTrade API running on port ${PORT}`);
    console.log(`Loaded ${products.length} marketplace products`);
  });
}

module.exports = app;
