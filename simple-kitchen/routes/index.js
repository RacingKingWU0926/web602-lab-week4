const path = require('path');
const auth = require('http-auth');

const express = require('express');
const mongoose = require('mongoose');
const { check, validationResult } = require('express-validator');

const router = express.Router();
const Registration = mongoose.model('Registration');

// GET index page
router.get('/', (req, res) => {
  res.render('index', { title: 'Simple Kitchen' });
});

// GET form for registration
router.get('/register', (req, res) => {
  res.render('register.pug', { title: 'RegistrationPage' });
});

// POST registration
router.post(
  '/', 
  [
    check('name')
      .isLength({ min: 1})
      .withMessage('Please enter a name'),
    check('email')
      .isLength({ min: 1})
      .withMessage('Please enter an email'),
  ],
  (req, res) => {
    // console.log(req.body);
    const errors = validationResult(req);
    if (errors.isEmpty()) {
      const registration = new Registration(req.body);
      registration.save()
        .then(() => {
          res.send('Thank you for your registration!');
        })
        .catch((err) => {
          console.log(err);
          res.send('Sorry! Something went wrong!');
        });
    } else {
      res.render('form', {
        title: 'Registration form',
        errors: errors.array(),
        data: req.body,
      });
    }
  }
);

// GET registrants
// Note: Add an authorization layer to access this endpoint.
// For example: (log in with username=admin, password=admin)
// where the password can be generated by `htpasswd users.htpasswd <username>`
const basic = auth.basic({
  file: path.join(__dirname, '../users.htpasswd'),
});

router.get('/registrations', basic.check((req, res) => {
  Registration.find()
    .then((registrations) => {
      res.render('registrants', { title: 'Listing registrations', registrations});
    })
    .catch((err) => {
      console.log(err);
      res.send('Sorry! Something went wrong!');
    });
}));

module.exports = router;
