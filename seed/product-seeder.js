var mongoose = require('mongoose')
var Product = require('../models/product')

mongoose.connect('mongodb://localhost:27017/shopping', { useNewUrlParser: true })

var products = [
  new Product({
    imagePath: 'https://source.unsplash.com/2gYsZUmockw/400x300',
    title: 'Pretty Trees',
    description: 'Pretty Tree',
    price: 64
  }),
  new Product({
    imagePath: 'https://source.unsplash.com/EMSDtjVHdQ8/400x300',
    title: 'Parkour',
    description: 'Craziness sans skateboard',
    price: 25
  }),
  new Product({
    imagePath: 'https://source.unsplash.com/8mUEy0ABdNE/400x300',
    title: 'Crazy tree',
    description: 'From the Amazon or some exotic locale!',
    price: 122
  }),
  new Product({
    imagePath: 'https://source.unsplash.com/G9Rfc1qccH4/400x300',
    title: 'Waterfalls',
    description: 'Please stick to the rivers and lakes you used to...',
    price: 12
  }),
  new Product({
    imagePath: 'https://source.unsplash.com/aJeH0KcFkuc/400x300',
    title: 'Desert Trek',
    description: 'Full blown desert experience in the Gobi',
    price: 12
  }),
  new Product({
    imagePath: 'https://source.unsplash.com/p2TQ-3Bh3Oo/400x300',
    title: 'Not sure what this is',
    description: 'Required imagination not included',
    price: 99
  })
]

var done = 0
for (var i = 0; i < products.length; i++) {
  products[i].save(function (err) {
    if (err) {
      console.log(err)
      return
    }
    done++
    if (done === products.length) {
      exit()
    }
  })
}

function exit () {
  mongoose.disconnect()
}
