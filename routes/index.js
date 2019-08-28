var express = require('express')
var router = express.Router()

var Product = require('../models/product')
var Cart = require('../models/cart')
var Order = require('../models/order')

/* GET home page. */
router.get('/', function (req, res, next) {
  var successMsg = req.flash('success')[0]
  Product.find(function (err, docs) {
    if (err) {
      console.log(err)
      return
    }
    res.render('shop/index', { title: 'Shopping Cart', products: docs, successMsg: successMsg, noMessages: !successMsg })
  })
})

router.get('/add-to-cart/:id', function (req, res, next) {
  var productId = req.params.id
  var cart = new Cart(req.session.cart ? req.session.cart : { items: {} })

  Product.findById(productId, function (err, product) {
    if (err) {
      console.log(err)
      return res.redirect('/')
    }
    cart.add(product, product.id)
    req.session.cart = cart
    res.redirect('/')
  })
})

router.get('/reduce/:id', function (req, res, next) {
  var productId = req.params.id
  var cart = new Cart(req.session.cart ? req.session.cart : {})

  cart.reduceByOne(productId)
  req.session.cart = cart
  res.redirect('/shopping-cart')
})

router.get('/remove/:id', function (req, res, next) {
  var productId = req.params.id
  var cart = new Cart(req.session.cart ? req.session.cart : {})

  cart.removeItem(productId)
  req.session.cart = cart
  res.redirect('/shopping-cart')
})

router.get('/shopping-cart', function (req, res, next) {
  if (!req.session.cart) {
    return res.render('shop/shopping-cart', { products: null })
  }
  var cart = new Cart(req.session.cart)
  res.render('shop/shopping-cart', { products: cart.generateArray(), totalPrice: cart.totalPrice })
})

router.get('/checkout', isLoggedIn, function (req, res, next) {
  if (!req.session.cart) {
    return res.render('shop/shopping-cart')
  }
  var cart = new Cart(req.session.cart)
  var errMsg = req.flash('error')[0]
  res.render('shop/checkout', {
    total: cart.totalPrice,
    errMsg: errMsg,
    noError: !errMsg
  })
})

router.post('/checkout', isLoggedIn, function (req, res, next) {
  if (!req.session.cart) {
    return res.render('shop/shopping-cart')
  }

  var cart = new Cart(req.session.cart)

  const stripe = require('stripe')('sk_test_E0qf28D81Ne4DGdU7PMZyb6800ODRkr8A7')
  const token = req.body.stripeToken

  ;(async () => {
    const charge = await stripe.charges.create({
      amount: cart.totalPrice * 100,
      currency: 'usd',
      source: req.body.stripeToken,
      receipt_email: 'jkerr013@gmail.com'
    })
      .catch(error => {
        console.log(error)
        req.flash('error', error.message)
        return res.redirect('/checkout')
      })
      .then(charge => {
        console.log(charge.amount)
        var order = new Order({
          user: req.user,
          cart: cart,
          address: req.body.address,
          name: req.body.name,
          paymentId: charge.id
        })
        order.save(function (err, result) {
          if (err) {
            return console.log(err)
          }
          req.flash('success', 'Purchase Successful!')
          req.session.cart = null
          res.redirect('/')
        })
      })
  })()
})

module.exports = router

function isLoggedIn (req, res, next) {
  if (req.isAuthenticated()) {
    return next()
  }
  req.session.referrer = req.url
  res.redirect('/user/signin')
}
