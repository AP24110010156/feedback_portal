const express = require("express");
const router = express.Router();
const { protect, adminOnly } = require("../middleware/authMiddleware");
const upload = require("../middleware/upload");
const {
  adminLogin,
  adminRegister,
  addItem,
  getAllItems,
  updateItem,
  deleteItem,
  getAllVendors,
  approveVendor,
  deleteVendor,
} = require("../controllers/adminController");

// Auth routes
router.post("/login", adminLogin);
router.post("/register", adminRegister);

// Item routes (protected)
router.post("/items", protect, adminOnly, upload.single("image"), addItem);
router.get("/items", protect, adminOnly, getAllItems);
router.put("/items/:id", protect, adminOnly, updateItem);
router.delete("/items/:id", protect, adminOnly, deleteItem);

// Vendor management routes (protected)
router.get("/vendors", protect, adminOnly, getAllVendors);
router.put("/vendors/:id/approve", protect, adminOnly, approveVendor);
router.delete("/vendors/:id", protect, adminOnly, deleteVendor);

module.exports = router;
