const { Router } = require('express');
const Order = require('../models/order');
const auth = require('../middleware/auth');

const router = Router();

router.get('/', auth, async (req, res) => {
  try {
    const orders = await Order.find({ 'user.userId': req.user._id })
      .populate('user.userId')
      .lean();

    res.render('orders', {
      isOrder: true,
      title: 'Orders',
      orders: orders.map((o) => ({
        ...o,
        price: o.courses.reduce((total, cur) => {
          return (total += cur.count * cur.course.price);
        }, 0),
      })),
    });
  } catch (err) {
    console.log(err);
  }
});

router.post('/', auth, async (req, res) => {
  try {
    const user = await req.user.execPopulate('cart.items.courseId');
    const courses = user.cart.items.map((i) => ({
      count: i.count,
      course: { ...i.courseId._doc },
    }));

    const order = new Order({
      user: {
        name: req.user.name,
        userId: req.user,
      },
      courses,
    });

    await order.save();
    await req.user.clearCart();
    res.redirect('/orders');
  } catch (err) {
    console.log(err);
  }
});

module.exports = router;
