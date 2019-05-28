var express = require('express')
var router = express.Router()

var Product = require('../models/product')
var Cart = require('../models/cart')

/* GET home page. */
router.get('/', function (req, res, next) {
  Product.find(function (err, docs) {
    if (err) {
      console.log(err)
      return
    }
    res.render('shop/index', { title: 'Shopping Cart', products: docs })
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

router.get('/shopping-cart', function (req, res, next) {
  if (!req.session.cart) {
    return res.render('shop/shopping-cart', { products: null })
  }
  var cart = new Cart(req.session.cart)
  res.render('shop/shopping-cart', { products: cart.generateArray(), totalPrice: cart.totalPrice })
})

router.get('/checkout', function (req, res, next) {
  if (!req.session.cart) {
    return res.render('shop/shopping-cart')
  }
  var cart = new Cart(req.session.cart)
  res.render('shop/checkout', {
    total: cart.totalPrice
  })
})

module.exports = router
