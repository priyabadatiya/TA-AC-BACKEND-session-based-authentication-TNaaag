var express = require('express');
var router = express.Router();
var User = require('../models/users');

/* GET users listing. */
router.get('/', function(req, res, next) {
  let info = req.flash('info')[0];
  res.render("users", {info});
});

// register page
router.get('/register', (req, res, next) => {
  res.render('register');
});

//registering a user
router.post('/register', (req, res, next) => {
  User.create(req.body, (err, user) => {
    if(err) return next(err);
    console.log(user);
    res.redirect('/users/login');
  })
});

//render login page
router.get('/login', (req, res, next) => {
  res.render('login');
});

// login request
router.post("/login", (req, res, next) => {
  let {email, password} = req.body;
  if(!email || !password) {
    req.flash("error", "Email/Password required");
    return res.redirect('/users/login');
  }
  User.findOne({email}, (err, user) => {
    if(err) return next(err);
    if(!user) {
      req.flash("error", "Email is not registered");
      return res.redirect('/users/login');
    }
    user.verifypassword(password, (err, result) => {
      if(err) return next(err);
      if(!result) {
        req.flash("error", "Password Incorrect");
        return res.redirect('/users/login');
      }
      req.session.userId = user.id;
      req.flash("info", `Welcome ${user.admin ? "admin" : "user"} `);
      res.redirect(`/${user.admin ? "admin": "clients"}/products`);
    })
  })
});

//logout
router.get('/logout', (req, res, next) => {
  res.clearCookie('connect.sid');
  res.redirect('/');
});
module.exports = router;
