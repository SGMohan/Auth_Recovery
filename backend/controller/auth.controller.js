const AuthRouter = require("express").Router();
const UserModel = require("../model/auth.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const nodemailer = require("nodemailer");
const { verifyToken } = require("../middleware/auth.middleware");

//Get route to check if the server is running
AuthRouter.get("/", async (_, res) => {
  await UserModel.find();
  return res.status(200).json({
    message: "Authentication API is operational",
    success: true,
  });
});

// Register route
AuthRouter.post("/register", async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({
      message: "All fields are required: name, email, and password",
      success: false,
    });
  }

  try {
    const existingUser = await UserModel.findOne({ email: req.body.email });
    if (existingUser) {
      return res.status(400).json({
        message: "Email already exists",
        success: false,
      });
    }

    const hashedpassowrd = await bcrypt.hash(req.body.password, 10);
    req.body.password = hashedpassowrd;

    const user = await UserModel.create(req.body);
    return res.status(201).json({
      message: "Register successfully",
      success: true,
      data: { name: user.name, email: user.email }
    });
  } catch (error) {
    return res.status(500).json({
      message: "Account creation failed due to server error",
      success: false,
      error: error.message,
    });
  }
});

// Login route
AuthRouter.post("/login", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({
      message: "Both email and password are required",
      success: false,
    });
  }

  try {
    const user = await UserModel.findOne({ email }).select("+password");
    if (!user) {
      return res.status(400).json({
        message: "Invalid login credentials",
        success: false,
      });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({
        message: "Invalid Password",
        success: false,
      });
    }

    const userWithoutPassword = user.toObject();
    delete userWithoutPassword.password;

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES,
    });

    return res.status(200).json({
      message: "Login successful",
      success: true,
      data: {
        name: user.name,
        email: user.email,
      },
      token: token,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Authentication service unavailable",
      success: false,
      error: error.message,
    });
  }
});

// Forgot password route
AuthRouter.post("/forgot-password", async (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({
      message: "Email address is required",
      success: false,
    });
  }
  try {
    const user = await UserModel.findOne({ email });
    if (!user) {
      return res.status(400).json({
        message: "If this email exists, a reset link has been sent",
        success: false,
      });
    }

    const resetToken = crypto.randomBytes(32).toString("hex");
    const resetTokenExpiry = Date.now() + 15 * 60 * 1000;

    await UserModel.updateOne(
      { _id: user._id },
      { resetToken, resetTokenExpiry }
    );

    // Create reset URL
    const RESET_URL = `${
      process.env.FRONTEND_URL
    }/reset-password?token=${resetToken}&email=${encodeURIComponent(
      user.email
    )}`;

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
      limitations: {
        maxConnections: 5,
        maxMessages: 1000,
      },
    });

    const mailOptions = {
      from: {
        name: "Authentication Service Security Team",
        address: process.env.EMAIL_USER,
      },
      to: user.email,
      subject: "🔒 Password Reset Request for Your Account",
      text: `
          Dear ${user.name || "Valued User"},
          
          We received a request to reset the password for your account (${
            user.email
          }).
          
          Please click the following link to reset your password:
          ${RESET_URL}
          
          This link will expire in 15 minutes. If you didn't request this change, please ignore this email or contact our support team immediately.
          
          For your security:
          - Never share this link with anyone
          - Our team will never ask for your password
          - Always check the sender's email address
          
          Thank you,
          The Security Team
          Authentication Service
        `.trim(),
      html: `
         <!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Password Reset Instructions</title>
    <style>
      body {
        font-family: 'Segoe UI', Arial, sans-serif;
        line-height: 1.6;
        color: #333;
        max-width: 600px;
        margin: 0 auto;
        padding: 0;
        background-color: #f5f7fa;
      }
      .email-content {
        background-color: #ffffff;
        border-radius: 8px;
        overflow: hidden;
        box-shadow: 0 2px 10px rgba(0,0,0,0.05);
      }
      .header {
        background-color: #1a73e8;
        color: white;
        padding: 25px;
        text-align: center;
      }
      .header h1 {
        margin: 0;
        font-size: 22px;
      }
      .email-body {
        padding: 25px;
      }
      .button {
        background-color: #1a73e8;
        color: white !important;
        padding: 14px 28px;
        text-decoration: none;
        border-radius: 6px;
        display: inline-block;
        margin: 20px 0;
        font-weight: bold;
        transition: background-color 0.2s;
      }
      .button:hover {
        background-color: #0d5bba;
      }
      .link-fallback {
        font-size: 13px;
        color: #666;
        background-color: #f8f9fa;
        padding: 12px;
        border-radius: 4px;
        word-break: break-all;
        margin: 15px 0;
      }
      .warning {
        background-color: #fff8e6;
        border-left: 4px solid #ffc107;
        padding: 15px;
        margin: 25px 0;
        border-radius: 0 4px 4px 0;
      }
      .footer {
        text-align: center;
        padding: 20px;
        font-size: 12px;
        color: #7f8c8d;
        border-top: 1px solid #eee;
        background-color: #f7f9fc;
      }
      .security-tips {
        background-color: #f8f9fa;
        border-radius: 6px;
        padding: 15px;
        margin: 25px 0;
      }
    </style>
</head>
<body>
    <div style="padding: 20px;">
        <div class="email-content">
            <div class="header">
                <h1>🔒 Password Reset Request</h1>
            </div>
            
            <div class="email-body">
                <p>Dear ${user.name || "Valued User"},</p>
                
                <p>We received a request to reset the password for your account <strong>${
                  user.email
                }</strong>. Please use the below button to reset the password:</p>
                
                <div style="text-align: center;">
                    <a href="${RESET_URL}" class="button">Reset Password</a>
                </div>
                
                <p class="link-fallback">Or copy this link to your browser:<br>${RESET_URL}</p>
                
                <div class="warning">
                    <strong>Important:</strong> This link will expire in 15 minutes. For your security, please do not share this email with anyone.
                </div>
                
                <div class="security-tips">
                    <p><strong>Security Best Practices:</strong></p>
                    <ul style="margin: 10px 0; padding-left: 20px;">
                        <li>Create a strong, unique password</li>
                        <li>Never share your credentials</li>
                        <li>Always verify the sender's email address</li>
                        <li>Contact support if you didn't request this change</li>
                    </ul>
                </div>
                
                <p>If you need any assistance, please reply to this email or contact our support team.</p>
            </div>
            
            <div class="footer">
                <p>Thank you,<br>The Security Team<br><strong>Authentication Service</strong></p>
                <p>© ${new Date().getFullYear()} Authentication Service. All rights reserved.</p>
            </div>
        </div>
    </div>
</body>
</html>
        `,
      headers: {
        "X-Priority": "1",
        "X-MSMail-Priority": "High",
        "X-Mailer": "Nodemailer",
        "X-Application": "Authentication Service",
        "X-Auto-Response-Suppress": "All",
        "List-Unsubscribe": "<mailto:support@yourapp.com?subject=Unsubscribe>",
      },
    };
    const sendMail = transporter.sendMail(mailOptions);
    if (sendMail) {
      return res.status(200).json({
        message: "Password reset link sent to your email",
        success: true,
        data: {
          email: user.email,
          resetToken: resetToken,
        },
      });
    }
  } catch (error) {
    console.error("Email sending error:", error);
    return res.status(500).json({
      message: "Password reset service unavailable",
      success: false,
      error: error.message,
    });
  }
});

// Reset password route
AuthRouter.post("/reset-password", async (req, res) => {
  const { email, resetToken, newPassword } = req.body;
  if (!email || !resetToken || !newPassword) {
    return res.status(400).json({
      message: "All fields are required: email, reset token, and new password",
      success: false,
    });
  }
  try {
    const user = await UserModel.findOne({
      email,
      resetToken,
      resetTokenExpiry: { $gt: Date.now() },
    });
    if (!user) {
      return res.status(400).json({
        message: "Invalid or expired reset token",
        success: false,
      });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await UserModel.updateOne(
      { _id: user._id },
      {
        password: hashedPassword,
        resetToken: null,
        resetTokenExpiry: null,
      }
    );
    return res.status(200).json({
      message: "Password reset successfully",
      success: true,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Password reset service unavailable",
      success: false,
      error: error.message,
    });
  }
});

//Validate token route
AuthRouter.get("/validate-resetToken/:resetToken", async (req, res) => {
  const { resetToken } = req.params;
  const { email } = req.query;

  if (!resetToken || !email) {
    return res.status(400).json({
      valid: false,
      message: "Reset token and email are required",
    });
  }

  try {
    const user = await UserModel.findOne({
      email: decodeURIComponent(email),
      resetToken,
      resetTokenExpiry: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(401).json({
        valid: false,
        message: "Invalid or expired reset token",
      });
    }

    return res.status(200).json({
      valid: true,
      message: "Reset token is valid",
    });
  } catch (error) {
    console.error("Token validation error:", error);
    return res.status(500).json({
      valid: false,
      message: "Server error during token validation",
    });
  }
});

//Get user by ID
AuthRouter.get("/user/:_id", verifyToken, async (req, res) => {
  try {
    const _id = req.user.id;
    const user = await UserModel.findById(_id).select("-password");
    if (!user) {
      return res.status(404).json({
        message: "User not found",
        success: false,
      });
    }

    return res.status(200).json({
      message: "User fetched successfully",
      success: true,
      data: {
        _id: user._id,
        name: user.name,
        email: user.email
      }
    });
  } catch (error) {
    console.error("Error fetching user:", error);
    return res.status(500).json({
      message: "Internal server error",
      success: false,
      error: error.message,
    });
  }
});

//Logout route
AuthRouter.post("/logout", verifyToken, async (req, res) => {
  try {
    const _id = req.user.id;
    await UserModel.updateOne({ _id }, { $set: { refreshToken: null } });
    return res.status(200).json({
      message: "Logged out successfully",
      success: true,
    });
  } catch (error) {
    console.error("Error logging out:", error);
    return res.status(500).json({
      message: "Internal server error",
      success: false,
      error: error.message,
    });
  }
});

module.exports = AuthRouter;
