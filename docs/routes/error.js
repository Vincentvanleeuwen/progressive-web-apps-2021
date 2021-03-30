const router = require('express').Router();

router.get('/', (req, res) => {
  // Send to the login screen
  res.redirect('/')

});

router.post('/', (req, res) => {
  // Send to the login screen
  res.redirect('/');

});
module.exports = router;
