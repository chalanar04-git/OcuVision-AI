const pool = require("../config/db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Register User
const registerUser = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      role
    } = req.body;

    // Check required fields
    if (!name || !email || !password || !role) {
      return res.status(400).json({
        success: false,
        message: "All fields are required"
      });
    }

    // Allow only valid roles
    const validRoles = [
      "patient",
      "doctor",
      "admin"
    ];

    if (!validRoles.includes(role)) {
      return res.status(400).json({
        success: false,
        message: "Invalid role selected"
      });
    }

    // Check if user already exists
    const existingUser = await pool.query(
      "SELECT * FROM users WHERE email = $1",
      [email]
    );

    if (existingUser.rows.length > 0) {
      return res.status(400).json({
        success: false,
        message: "User already exists"
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(
      password,
      10
    );

    // Create user with selected role
    const newUser = await pool.query(
      `INSERT INTO users
        (name, email, password, role)
       VALUES
        ($1, $2, $3, $4)
       RETURNING
        id,
        name,
        email,
        role`,
      [
        name,
        email,
        hashedPassword,
        role
      ]
    );

    res.status(201).json({
      success: true,
      message: "Registration successful",
      user: newUser.rows[0]
    });

  } catch (error) {
    console.error(
      "Registration error:",
      error.message
    );

    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};


// Login User
const loginUser = async (req, res) => {
  try {
    const {
      email,
      password,
      role
    } = req.body;

    // Check required fields
    if (!email || !password || !role) {
      return res.status(400).json({
        success: false,
        message: "Email, password and role are required"
      });
    }

    // Find user
    const result = await pool.query(
      "SELECT * FROM users WHERE email = $1",
      [email]
    );

    if (result.rows.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid email or password"
      });
    }

    const user = result.rows[0];

    // Check password
    const isMatch = await bcrypt.compare(
      password,
      user.password
    );

    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Invalid email or password"
      });
    }

    // Check selected role against database role
    if (user.role !== role) {
      return res.status(403).json({
        success: false,
        message: "Selected role does not match this account"
      });
    }

    // Create JWT
    const token = jwt.sign(
      {
        id: user.id,
        role: user.role
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1d"
      }
    );

    res.json({
      success: true,
      message: "Login successful",
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });

  } catch (error) {
    console.error(
      "Login error:",
      error.message
    );

    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};


module.exports = {
  registerUser,
  loginUser
};