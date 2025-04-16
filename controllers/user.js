import User from "../models/user.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

// REGISTER
export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        message: "Already Signed Up Using this email!",
      });
    }

    if (name && email && password) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      const newUser = new User({ name, email, password: hashedPassword });
      const doc = await newUser.save();

      return res.status(201).json({
        message: "Registration Successful",
      });
    } else {
      return res.status(400).json({ message: "All fields are required" });
    }
  } catch (error) {
    console.log("Error registering the user", error);
    res.status(500).json({ message: "Registration Failed" });
  }
};

// LOGIN
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (email && password) {
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(400).json({ message: "User not registered" });
      }

      const passwordMatched = await bcrypt.compare(password, user.password);
      if (!passwordMatched) {
        return res.status(400).json({ message: "Invalid email or password" });
      }

      const token = jwt.sign({ userID: user._id }, process.env.JWT_SECRET_KEY, {
        expiresIn: "1h",
      });

      return res.status(200).json({
        message: "Login Successful",
        token,
      });
    } else {
      return res.status(400).json({ message: "All fields are required" });
    }
  } catch (error) {
    console.log("Error logging in user", error);
    return res.status(500).json({
      message: "Unable to Login",
    });
  }
};
