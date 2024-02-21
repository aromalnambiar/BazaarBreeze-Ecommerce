const User = require('../models/User');

const checkUserBlockStatus = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.userId);
    if (!user || user.isBlocked) {
      return res.status(403).json({ message: 'You are not authorized to access this resource.' });
    }
    next();
  } catch (error) {
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};

module.exports = checkUserBlockStatus;
