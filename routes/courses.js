const { Router } = require('express');
const mongoose = require('mongoose');
const { validationResult } = require('express-validator');
const Course = require('../models/course');
const auth = require('../middleware/auth');
const { courseValidators } = require('../utils/validators');

const router = Router();

function isOwner(course, req) {
  return course.userId.toString() === req.user._id.toString();
}

router.get('/', async (req, res) => {
  try {
    const courses = await Course.find()
      .populate('userId', 'email name')
      .lean()
      .then((courses) => {
        if (courses.length) {
          return courses.map((course) => {
            course.id = String(course._id);
            return course;
          });
        }

        return [];
      })
      .catch((err) => console.log(err));

    res.render('courses', {
      title: 'Courses',
      isCourses: true,
      userId: req.user ? req.user._id.toString() : null,
      courses,
    });
  } catch (err) {
    log.error(err);
  }
});

router.get('/:id', async (req, res) => {
  try {
    const course = await Course.findById(req.params.id).lean();
    res.render('course', {
      layout: 'empty',
      title: course.title,
      course,
    });
  } catch (err) {
    log.error(err);
  }
});

router.get('/:id/edit', auth, async (req, res) => {
  if (!req.query.allow) {
    return res.redirect('/');
  }

  try {
    const course = await Course.findById(req.params.id).lean();

    if (!isOwner(course, req)) {
      return res.redirect('/courses');
    }

    res.render('course-edit', {
      title: course.title,
      course,
    });
  } catch (err) {}
});

router.post('/edit', auth, courseValidators, async (req, res) => {
  const errors = validationResult(req);
  const { id } = req.body;

  if (!errors.isEmpty()) {
    return res.status(422).redirect(`/courses/${id}/edit?allow=true`);
  }

  try {
    const { id } = req.body;
    delete req.body.id;
    const course = await Course.findById(id);

    if (!isOwner(course, req)) {
      return res.redirect('/courses');
    }

    Object.assign(course, req.body);
    await course.save();
    res.redirect('/courses');
  } catch (err) {
    console.log(err);
  }
});

router.post('/remove', auth, async (req, res) => {
  try {
    await Course.deleteOne({
      _id: req.body.id,
      userId: req.user._id,
    });
    res.redirect('/courses');
  } catch (err) {
    console.log(err);
  }
});

module.exports = router;