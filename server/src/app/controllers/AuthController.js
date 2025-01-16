const { createToken } = require("../utils/jwt");
const config = require("../../../config.json");
const User = require("../models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = await createToken({ userId: user.id });

    res.cookie("token", token, {
      httpOnly: true,
      secure: config.NODE_ENV === "production",
      sameSite: "strict",
    });

    return res.status(200).json({
      message: "Logged in successfully",
      id: user.id,
      email: user.email,
      name: `${user.first_name} ${user.last_name}`,	
      status: user.status,
      photo_path: user.photo_path,
      token,
    });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({ error: "Error during login" });
  }
};

const logout = (req, res) => {
  try {
    res.clearCookie("token");
    return res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    console.error("Logout error:", error);
    return res.status(500).json({ error: "Error during logout" });
  }
};

const profile = async (req, res) => {
  try {
    const user = await User.findByPk(req.userId, {
      attributes: { exclude: ["password"] },
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    return res.status(200).json(user);
  } catch (error) {
    console.error("Profile error:", error);
    return res.status(500).json({ error: "Error retrieving user" });
  }
};

const verifyToken = (req, res) => {
  const { token } = req.cookies;

  if (!token) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  jwt.verify(token, config.JWT_SECRET, async (err, decodedToken) => {
    if (err) {
      console.error("Token verification error:", err);
      return res.status(401).json({ error: "Unauthorized" });
    }

    const user = await User.findByPk(decodedToken.userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    return res.status(200).json({
      message: "Token verified",
      id: user.id,
      email: user.email,
      name: `${user.first_name} ${user.last_name}`,
      status: user.status,
      photo_path: user.photo_path,
      token,
    });
  });
};

module.exports = { login, logout, profile, verifyToken };
