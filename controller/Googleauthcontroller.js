import userModel from "../models/userModel.js";
import JWT from "jsonwebtoken";

export const googleLoginController = async (req, res) => {
  try {
    const { access_token } = req.body;
    if (!access_token) {
      return res.status(400).send({ success: false, message: "No Google access token provided" });
    }

    const googleRes = await fetch(
      "https://www.googleapis.com/oauth2/v3/userinfo",
      { headers: { Authorization: `Bearer ${access_token}` } }
    );

    if (!googleRes.ok) {
      return res.status(401).send({ success: false, message: "Invalid Google token" });
    }

    const profile = await googleRes.json();
    const { sub: googleId, email, name, picture, email_verified } = profile;

    if (!email) {
      return res.status(401).send({ success: false, message: "Could not read Google email" });
    }
    if (email_verified === false) {
      return res.status(401).send({ success: false, message: "Google email not verified" });
    }

    let user = await userModel.findOne({ email });

    if (!user) {
      user = await new userModel({
        name,
        email,
        authProvider: "google",
        googleId,
        picture,
        role: 0,
      }).save();
    } else if (!user.googleId) {
      user.googleId = googleId;
      if (picture && !user.picture) user.picture = picture;
      await user.save();
    }

    const token = await JWT.sign({ _id: user._id }, process.env.JWT_SECRRET, {
      expiresIn: "7d",
    });

    res.status(200).send({
      success: true,
      message: "Google login successful",
      user: {
        name: user.name,
        email: user.email,
        phone: user.phone,
        address: user.address,
        role: user.role,
        picture: user.picture,
      },
      token,
    });
  } catch (error) {
    console.log("GOOGLE LOGIN ERROR:", error?.message || error);
    res.status(500).send({
      success: false,
      message: "Google login failed",
      error: error?.message || String(error),
    });
  }
};