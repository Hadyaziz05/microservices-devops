const express = require('express');
const bcrypt = require('bcrypt')
const lodash = require('lodash')
const jwt = require('jsonwebtoken')
const User = require('../models/User');
const router = express.Router();
// POST /users/signup
router.post('/signup', async(req, res)=> {
  let user = await User.findOne({email: req.body.email})
  if (user) return res.status(400).send('User already exists.')
   
  user = new User({
    name: req.body.name,
    email: req.body.email.toLowerCase(),
    password: req.body.password
      
  })

  const salt = await bcrypt.genSalt(10)
  user.password = await bcrypt.hash(user.password, salt)
  await user.save()
     
  res.send(lodash.pick(user, '_id', 'name', 'email'))
    
})

router.post('/signin', async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email.toLowerCase() });
    if (!user) return res.status(400).send('Invalid email or password.');

    const validPassword = await bcrypt.compare(req.body.password, user.password);
    if (!validPassword) return res.status(400).send('Invalid email or password.');

    const token = jwt.sign({ _id: user._id }, 'jwtPrivateKey');

    res.set('x-auth-token', token);
    res.status(200).json({
      message: 'Signin successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        // add any other fields you want to return
      }
    });
  } catch (err) {
    console.error('Signin Error:', err);
    res.status(500).send('Internal server error');
  }
});



module.exports = router;
