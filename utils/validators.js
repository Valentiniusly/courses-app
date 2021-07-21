const { body } = require('express-validator');
const User = require('../models/user');

exports.registerValidators = [
  body('email')
    .isEmail()
    .withMessage('Enter correct email')
    .custom(async (value, { req }) => {
      try {
        const user = await User.findOne({ email: value });
        if (user) {
          return Promise.reject('This email already exists');
        }
      } catch (err) {}
    })
    .normalizeEmail(),
  body('password', 'The password must be at least 6 characters long')
    .isLength({ min: 6, max: 56 })
    .isAlphanumeric()
    .trim(),
  body('confirm')
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error('Passwords must match');
      }
      return true;
    })
    .trim(),
  body('name')
    .isLength({ min: 3 })
    .withMessage('Name must be at least 3 characters long')
    .trim(),
];

exports.courseValidators = [
  body('title')
    .isLength({ min: 3 })
    .withMessage('The title must be at least 6 characters long')
    .trim(),
  body('price').isNumeric().withMessage('Enter the correct price'),
  body('image', 'Enter the correct image URL').isURL(),
];
