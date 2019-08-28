var express = require('express')
var router = express.Router()
var csrf = require('csurf')
var passport = require('passport')

var order = require('../models/order')
var Cart = require('../models/cart')

var csrfProtection = csrf()
router.use(csrfProtection)

router.get('/profile', isLoggedIn, function (req, res, next) {
  order.find({
    user: req.user
  }, function (err, orders) {
    if (err) {
      return res.write('Error!')
    }
    var cart
    orders.forEach(function (order) {
      cart = new Cart(order.cart)
      order.items = cart.generateArray()
    })
    res.render('user/profile', { orders: orders })
  })
})

router.get('/logout', isLoggedIn, (req, res, next) => {
  req.logout()
  req.session.cart = null
  res.redirect('/')
})

router.use('/', notLoggedIn, function (req, res, next) {
  next()
})

router.get('/signup', function (req, res, next) {
  var messages = req.flash('error')
  res.render('user/signup', { csrfToken: req.csrfToken(), messages: messages, hasErrors: messages.length > 0 })
})

router.post('/signup', passport.authenticate('local.signup', {
  failureRedirect: '/user/signup',
  failureFlash: true
}), function (req, res, next) {
  if (req.session.referrer) {
    var referrer = req.session.referrer
    req.session.referrer = null
    res.redirect(req.session.referrer)
  } else {
    res.redirect('/user/profile')
  }
})

router.get('/signin', (req, res, next) => {
  var messages = req.flash('error')
  res.render('user/signin', { csrfToken: req.csrfToken(), messages: messages, hasErrors: messages.length > 0 })
})

router.post('/signin', passport.authenticate('local.signin', {
  failureRedirect: '/user/signin',
  failureFlash: true
}), function (req, res, next) {
  if (req.session.referrer) {
    var referrer = req.session.rerferrer
    req.session.referrer = null
    res.redirect(req.session.referrer)
  } else {
    res.redirerct('/user/profile')
  }
})

module.exports = router

function isLoggedIn (req, res, next) {
  if (req.isAuthenticated()) {
    return next()
  }
  res.redirect('/')
}

function notLoggedIn (req, res, next) {
  if (!req.isAuthenticated()) {
    return next()
  }
  res.redirect('/')
}
