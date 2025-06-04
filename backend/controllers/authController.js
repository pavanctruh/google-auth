const { default: axios } = require("axios");
const { oauth2client } = require("../utils/googleConfig");
const UserModel = require("../models/userModel");
const jwt = require('jsonwebtoken');

const googleLogin = async (req, res) => {
  try {
    console.log("📩 Incoming request body:", req.body);
    const { code } = req.body;

    if (!code) {
      return res.status(400).json({ message: "Missing authorization code." });
    }

    console.log("Received auth code:", code);
    const googleRes = await oauth2client.getToken(code);
    const tokens = googleRes.tokens;
    console.log("🔐 Tokens received:", tokens);

    oauth2client.setCredentials(tokens);

    const userRes = await axios.get(
      `https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${tokens.access_token}`
    );
    console.log(" Google user info:", userRes.data);

    const { email, name, picture } = userRes.data;

    if (!email || !name) {
      return res.status(400).json({ message: "Incomplete user data from Google." });
    }

    let user = await UserModel.findOne({ email });
    if (!user) {
      user = await UserModel.create({
        name,
        email,
        image: picture,
      });
      console.log("✅ New user created:", user);
    } else {
      console.log("ℹ️ Existing user found:", user);
    }

    
    if (!process.env.JWT_SECRET || !process.env.JWT_TIMEOUT) {
      throw new Error("JWT environment variables are not properly configured.");
    }

    const token = jwt.sign(
      { _id: user._id, email },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_TIMEOUT }
    );
    console.log("🔑 JWT token generated.");

    
    const responseData = {
      message: "Success",
      token,
      user,
    };

    console.log("📤 Sending response:", responseData);
    return res.status(200).json(responseData);

  } catch (err) {
    console.error("❌ Error in googleLogin controller:", err.message);
    console.error(err.stack);
    return res.status(500).json({
      message: "Internal server error",
      error: err.message, 
    });
  }
};

module.exports = {
  googleLogin,
};
