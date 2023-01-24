const express = require('express');
const router = express.Router();
const authUtils = require('../utils/auth');
const passport = require('passport');
const flash = require('connect-flash');

// Create login page
// --------------------------------------------------
router.get('/login', (req, res, next) => {
  const messages = req.flash();
  res.render('login', { messages });
});
// --------------------------------------------------


// Handle login request
// --------------------------------------------------
router.post('/login', passport.authenticate('local', 
  { failureRedirect: '/auth/login', 
    failureFlash: 'Wrong username or password'}), (req, res, next) => {
  res.redirect('/users');
});
// --------------------------------------------------


// Create register page
// --------------------------------------------------
router.get('/register', (req, res, next) => {
  const messages = req.flash();
  res.render('register', { messages });
});
// --------------------------------------------------


// Handle register request
// --------------------------------------------------
router.post('/register', (req, res, next) => {
  const registrationParams = req.body;
  const users = req.app.locals.users;
  const temp=registrationParams.username
  const payload = {
    name:registrationParams.name,
    username: registrationParams.username,
    email:registrationParams.email,
    password: authUtils.hashPassword(registrationParams.password)
  };
  v=0;
  users.findOne({username:temp}, (err, results) => {
    if (results) {
      req.flash('error', 'User account already exists.');
      v=1;
    }
    else{
      v=0;
      users.insertOne(payload, (err) => {
        if (err) {
          req.flash('error', 'User account already exists.');
        } else {
          req.flash('success', 'User account registered successfully.')
        }
      })
    }
    if(v)
    res.redirect('/auth/register');
    else{      
      setTimeout(()=>{
        res.redirect('/auth/register')
      },2000)
    }
  })
});
// --------------------------------------------------

// Logout page
// --------------------------------------------------
router.get('/logout', (req, res, next) => {
  req.session.destroy();
  res.redirect('/');
});

module.exports = router;