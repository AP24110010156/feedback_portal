const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const upload = require("../middleware/upload");
const {
  registerUser,
  loginUser,
  getUserProfile,
  updateUserProfile,
  placeOrder,
  getMyOrders,
  addToWishlist,
  removeFromWishlist,
  getWishlist,
} = require("../controllers/userController");

// Auth routes
router.post("/register", registerUser);
router.post("/login", loginUser);

// Profile routes (protected)
router.get("/profile", protect, getUserProfile);
router.put("/profile", protect, upload.single("profilePic"), updateUserProfile);

// Order routes (protected)
router.post("/orders", protect, placeOrder);
router.get("/orders", protect, getMyOrders);

// Wishlist routes (protected)
router.get("/wishlist", protect, getWishlist);
router.post("/wishlist/:itemId", protect, addToWishlist);
router.delete("/wishlist/:itemId", protect, removeFromWishlist);

module.exports = router;
