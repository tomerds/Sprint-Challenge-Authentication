require('dotenv').config();

const router = require('express').Router();

const bcrypt = require('bcryptjs');
const userHelper = require('../auth/helper');
const jwt = require('jsonwebtoken');

router.post('/register', (req, res) => {
  // implement registration
  let { username, password } = req.body;

  //first we have to hash the password using bcrypt
  const hashedPassword = bcrypt.hashSync(password, 8);
  password = hashedPassword;
  const user = { username, password };

  //then we have to add info to the database
  userHelper.register(user)
    .then(user => res.status(200).json(user))
    .catch(err => res.status(500).json({ error: 'error with registration' }));

});

function makeToken(user) {

  payload = {
    subject: user.id,
    user: user.username
  }

  options = {
    expiresIn: '1h',
  }

  const secret = process.env.JSONSECRET;

  const token = jwt.sign(payload, `${secret}`, options);

  return token;


}

router.post('/login', (req, res) => {
  // implement login
  const { username, password } = req.body;
  //We have to compare password with our database
  userHelper.findUser(username)
    .first()
    .then(user => {
      if (!user) {
        res.status(401).json({ error: 'invalid credentials' })
      } else {
        console.log('password:', user.password);
        if (user && bcrypt.compare(password, user.password)) {
          console.log(user);
          const token = makeToken(user);
          res.status(200).json({ message: `Welcome ${user.username}!`, token })
        }
      }
    })
    .catch(err => res.status(500).json({ error: 'error with log in' }))

});

module.exports = router;
