const express = require('express');
const cors = require('cors');
const otpController = require('./otpController');


const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// OTP Routes
app.post('/api/send-otp', otpController.sendOTP);
app.post('/api/verify-otp', otpController.verifyOTP);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});