const express = require('express')

const app = express()

// app.get('/', function (req, res) {
//   res.send('Hello from Express.js')
// })

app.get('/user', 
  function (req, res, next) {    // logger middleware
    console.log(req.url);
    next();
  },
  function (req, res, next) {    // guard middleware
    req.user = req.query.name;
    (req.user) ? next() : next(new Error('forbidden'));
  },
  function (req, res) {          // request handler
    res.send('Hi ' + req.user)
  },
  function (err, req, res, next) {    // error handler
    res.json({status: 500, err: err.message})
  }
)

app.get('/users/:userId/books/:bookId', function (req, res) {
  // do your logic
  res.json({params: req.params});

})


exports.expressApp = app;

exports.debuggerService = {};

// app.listen(3000, () => console.log(`Example app listening on port 3000!`));
