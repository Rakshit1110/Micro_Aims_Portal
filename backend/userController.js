const User = require('./models/User');

exports.createUser = async (req, res) => {
  try {
    const { name, email, role } = req.body;
    
    const user = await User.create({ name, email, role });
    
    res.status(201).json({
      success: true,
      message: 'User created successfully',
      user
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};