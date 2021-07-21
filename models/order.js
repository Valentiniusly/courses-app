const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const orderSchema = new Schema({
  courses: [
    {
      course: {
        type: Object,
        required: true,
      },
      count: {
        type: Number,
        required: true,
      },
    },
  ],
  user: {
    name: String,
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

module.exports = model('Order', orderSchema);
