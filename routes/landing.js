require('dotenv').config();
const express   = require('express'),
      router    = express.Router({mergeParams : true}), 
      app       = express(),
      bcrypt    = require('bcrypt');

//INNER ROUTES
const loginRoute = require('./login');
      registerRoute = require('./register');
      userRoute = require('./user');
router.use('/login', loginRoute);  //For all login Routes
router.use('/register', registerRoute); //Register Routes
router.use('/logout',(req, res) => {
   req.logout();
   res.redirect('/');
});

router.use('/', userRoute);  //* After the user has logged in

//CHECKING FOR LOGIN



module.exports = router;