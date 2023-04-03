const User = require('../models/User');
const jwt = require('jsonwebtoken');
const { UnauthenticatedError } = require('../errors');

const auth = (req, res, next) => {
      // check header
      const authHeader = req.headers.authorization;

      if (!authHeader || !authHeader.startsWith('Bearer ')) {
            throw new UnauthenticatedError('Authentication invalid');
      }

      const token = authHeader.split(' ')[1];

      try {
            const payload = jwt.verify(token, process.env.JWT_SECRET)
            // attach the user to the job routes

            // alternative code to find user by User model and remove password when passing through middleware
            // const user = User.findById(payload.id).select('-password');
            // req.user = user;

            req.user = { userId: payload.userId, name: payload.name }
            next()
      } catch (err) {
            throw new UnauthenticatedError('Authentication invalid')
      }
}

module.exports = auth;