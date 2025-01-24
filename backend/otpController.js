const nodemailer = require('nodemailer');
const crypto = require('crypto');

// Temporary in-memory storage (replace with Redis/Database in production)
const otpStorage = {};

exports.sendOTP = async (req, res) => {
  const { email, role } = req.body;

  // Validate email domain
  if (!email.endsWith('@iitrpr.ac.in')) {
    return res.status(400).json({ 
      success: false, 
      message: 'Invalid email domain' 
    });
  }

  // Generate 6-digit OTP
  const otp = crypto.randomInt(100000, 999999).toString();

  // Configure email transporter
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'rakshitkaushal1528@gmail.com',
        pass: 'yftqplxcwhnlbtes' 
    }
  });

  try {
    // Send email
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'AIMS Portal - Your OTP',
      text: `Your OTP for AIMS Portal login is: ${otp}. 
             Role: ${role}
             OTP will expire in 10 minutes.`
    });

    // Store OTP with expiry
    otpStorage[email] = {
      otp,
      role,
      expiry: Date.now() + 600000 // 10 minutes
    };

    res.json({ 
      success: true, 
      message: 'OTP sent successfully' 
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Failed to send OTP' 
    });
  }
};

exports.verifyOTP = (req, res) => {
  console.log('Request body:', req.body); // Log entire request body
  const { email, otp, role } = req.body;
  console.log('Email:', email);
  console.log('OTP:', otp);
  console.log('Role:', role);

  const storedOtp = otpStorage[email];
  console.log('Stored OTP data:', storedOtp);

  if (!storedOtp) {
    console.log('No stored OTP found for email');
    return res.status(400).json({ 
      success: false, 
      message: 'No OTP request found' 
    });
  }

  // Debugging comparison
  console.log('Stored OTP (trim):', storedOtp.otp.toString().trim());
  console.log('Provided OTP (trim):', otp.trim());
  console.log('Stored Role:', storedOtp.role);
  console.log('Provided Role:', role);
  console.log('Current Time:', Date.now());
  console.log('Expiry Time:', storedOtp.expiry);

  if (
    storedOtp.otp.toString().trim() === otp.trim() && 
    storedOtp.role === role && 
    Date.now() < storedOtp.expiry
  ) {
    delete otpStorage[email];
    res.json({ 
      success: true, 
      message: 'Login successful' 
    });
  } else {
    res.status(400).json({ 
      success: false, 
      message: 'Invalid or expired OTP' 
    });
  }
};