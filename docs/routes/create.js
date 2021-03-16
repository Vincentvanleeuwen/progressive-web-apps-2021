const router = require('express').Router();

router.get('/', (req, res) => {
  console.log('createres', res.body);
  res.render('create', {
    layout: 'main',
    style: 'create.css'
  })
})

module.exports = router;
