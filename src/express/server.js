
const express = require('express');

const app = express();

// configure the REST endpoints on the express.js instance

app.get('/', (req, res) => {
  // handle the request
  console.log('HERE IS THE REQUEST', req.url,  req.query)

  // return response
  res.json({
    message: 'Hello in my first Express.js app',
    data: req.query,
  })
});

app.get('/user', 
  // logger middleware
  (req, res, next) => {
    console.log('REQUEST TO', req.url);
    next();
  },

  // auth middleware
  (req, res, next) => {
    // TODO encode user from token
    const user = req.query.name;
    req.user = user;

    user ? next() : next(new Error('Forbidden, query.name required'))
  },
  
  // requesty handler
  (req, res) => {
    const user = req.user;
    
    // TODO read  user data from database
    if(!user) {
      throw new Error('User is required');
    }

    res.json({
      message: `Welcome ${user}`,
      data: 'some extra data from the database'
    });
  },
  
  // error handler
  (err, req, res, next) => {
    res.status(401).json({
      status: 401,
      message: err.message
    })
  },

)

app.listen(3001, () => console.log('Express app running on port 3001 !!!'))