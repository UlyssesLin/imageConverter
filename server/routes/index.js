const express = require('express');
const router = express.Router();
const imageAPI = require('../imageAPI');

router.post('/getImageAndCommands', (req, res, next) => {
  console.log('---Calling getImageAndCommands---');
  imageAPI.getImageAndCommands(req, res);
});

module.exports = router;
