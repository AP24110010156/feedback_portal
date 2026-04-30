const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Admin = require("../models/Admin/Admins");
const AddItem = require("../models/Admin/Additem");
const Vendor = require("../models/Vendor/Vendors");

// Generate JWT token
const generateToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
};

// @desc    Admin Login
// @route   POST /api/admin/login
// @access  Public
const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const admin = await Admin.findOne({ email });
    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    res.status(200).json({
      message: "Login successful",
      token: generateToken(admin._id, admin.role),
      admin: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        role: admin.role,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Register new Admin
// @route   POST /api/admin/register
// @access  Public (can restrict later)
const adminRegister = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existing = await Admin.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: "Admin already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const admin = await Admin.create({ name, email, password: hashedPassword });

    res.status(201).json({
      message: "Admin created",
      token: generateToken(admin._id, admin.role),
      admin: { id: admin._id, name: admin.name, email: admin.email },
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Add a new item/product
// @route   POST /api/admin/items
// @access  Admin
const addItem = async (req, res) => {
  try {
    const { name, description, price, category, stock, tags, vendor } =
      req.body;
    const image = req.file ? req.file.filename : "";

    const item = await AddItem.create({
      name,
      description,
      price,
      category,
      stock,
      image,
      tags,
      vendor,
    });

    res.status(201).json({ message: "Item added successfully", item });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Get all items
// @route   GET /api/admin/items
// @access  Admin
const getAllItems = async (req, res) => {
  try {
    const items = await AddItem.find().populate("vendor", "name businessName");
    res.status(200).json(items);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Update an item
// @route   PUT /api/admin/items/:id
// @access  Admin
const updateItem = async (req, res) => {
  try {
    const item = await AddItem.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!item) return res.status(404).json({ message: "Item not found" });
    res.status(200).json({ message: "Item updated", item });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Delete an item
// @route   DELETE /api/admin/items/:id
// @access  Admin
const deleteItem = async (req, res) => {
  try {
    const item = await AddItem.findByIdAndDelete(req.params.id);
    if (!item) return res.status(404).json({ message: "Item not found" });
    res.status(200).json({ message: "Item deleted" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Get all vendors
// @route   GET /api/admin/vendors
// @access  Admin
const getAllVendors = async (req, res) => {
  try {
    const vendors = await Vendor.find().select("-password");
    res.status(200).json(vendors);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Approve a vendor
// @route   PUT /api/admin/vendors/:id/approve
// @access  Admin
const approveVendor = async (req, res) => {
  try {
    const vendor = await Vendor.findByIdAndUpdate(
      req.params.id,
      { isApproved: true },
      { new: true }
    ).select("-password");
    if (!vendor) return res.status(404).json({ message: "Vendor not found" });
    res.status(200).json({ message: "Vendor approved", vendor });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Delete a vendor
// @route   DELETE /api/admin/vendors/:id
// @access  Admin
const deleteVendor = async (req, res) => {
  try {
    const vendor = await Vendor.findByIdAndDelete(req.params.id);
    if (!vendor) return res.status(404).json({ message: "Vendor not found" });
    res.status(200).json({ message: "Vendor removed" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = {
  adminLogin,
  adminRegister,
  addItem,
  getAllItems,
  updateItem,
  deleteItem,
  getAllVendors,
  approveVendor,
  deleteVendor,
};
