const accountRouter = require('./routes');
const postRouter = require('./post');
const commentRouter = require('./postComment');
const productRouter = require('./product')
const cartRouter = require('./cart')
const orderRouter = require('./order')



const paypal = require('paypal-rest-sdk')
const fs = require('fs');
const Order = require('../models/Order');

function route(app) {
  app.use('/accounts', accountRouter);


  app.use('/post', postRouter);

  app.use('/comments', commentRouter);

  app.use('/products', productRouter)

  app.use('/cart', cartRouter)

  app.use('/order',orderRouter)

  paypal.configure({
    'mode': 'sandbox', //sandbox or live
    'client_id': 'AXFTFDSJyTu57e71UAGmZ7hDuAZk1-oD-1Yl380_BBqiWeL8Yit6D_jGx7D17bsRpSoDpdui2k6O0aDS',
    'client_secret': 'EJDMYzw78KVdRbL9m-yWUahIg4kMY2B2l8g82zbjH40Apr6Nr02o5Kcz7ZZ_zlsWA90h1peyfeR4lISv'
  });

  var items = JSON.parse(fs.readFileSync(__dirname+ '/item.json'));
  var total=items.total

  app.get('/', function (req, res) {
    res.render('index.hbs');
  })

  app.post('/pay', function (req, res) {
    const create_payment_json = {
      'intent': 'sale',
      'payer': {
        'payment_method': 'paypal'
      },
      'redirect_urls': {
        'return_url': 'http://localhost:3535/success',
        'cancel_url': 'http://localhost:3535/cancel'
      },
      'transactions': [{
        'item_list': {
          'items': items.cartItems.price
        },
        'amount': {
          'currency': 'USD',
          'total': total.toString()
        },
        'description': 'This is payment description'
      }]
    //   "transactions": [{
    //     "item_list": {
    //         "items": [{
    //             "name": "Note",
    //             "sku": "001",
    //             "price": "5.00",
    //             "currency": "USD",
    //             "quantity": 1
    //         }]
    //     },
    //     "amount": {
    //         "currency": "USD",
    //         "total": "5.00"
    //     },
    //     "description": "Note you ordered"
    // }]
    };

    paypal.payment.create(create_payment_json, function (error, payment) {
      if (error) {
        res.render('cancle');
        console.log(error.response.details);
      } else {
        for (let i = 0; i < payment.links.length; i++) {
          if (payment.links[i].rel === 'approval_url') {
            res.redirect(payment.links[i].href);
          }
        }
      }
    });

  });
  app.get('/cancle', function(req, res){
    res.render('cancle');})

  app.get('/success', (req, res) => {
    const payerId = req.query.PayerID;
    const paymentId = req.query.paymentId;

    const execute_payment_json = {
      'payer_id': payerId,
      'transactions': [{
        'amount': {
          'currency': 'USD',
          'total': total.toString()
        }
      }]
    };

    paypal.payment.execute(paymentId, execute_payment_json, function (error, payment) {
      if (error) {
        res.render('cancle');
      } else {
        console.log(JSON.stringify(payment));
        res.render('success.hbs');
      }
    });
  });



  app.get('/cancel', (req, res) => res.send('Cancelled'));




}
module.exports = route