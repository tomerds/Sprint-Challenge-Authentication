require('dotenv').config();

const jwt = require('jsonwebtoken');

/* 
  complete the middleware code to check if the user is logged in
  before granting access to the next middleware/route handler
*/

module.exports = (req, res, next) => {

  const token = req.headers.authorization;

  if (token) {
    jwt.verify(token, `${process.env.JSONSECRET}`, (error, decodedToken) => {
      if (error) {
        res.status(401).json({ error: 'permission denied!' })
      } else {
        req.decodedToken = decodedToken;
        next();
      }
    })
  } else {
    res.status(400).json({ error: 'No token provided' })
  }
};
