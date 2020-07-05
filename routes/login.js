require('dotenv').config();
const express   = require('express'),
      router    = express.Router({mergeParams : true}), //!IMPORTANT
      bcrypt    = require('bcrypt'),
      mongoSanitize = require('mongo-sanitize'),
      passport  = require('passport'),
      User      = require('../models/user');

const {ensureAuthenticated} = require('../config/auth');

router.get('/', (req, res) => {
    let messageLog = {};
    if(req.session.wrongMsg === 'auth'){
        messageLog.type = 'auth';
        messageLog.msg = 'You need to Login to access that page';
    }else if(req.session.wrongMsg === 'cred'){
        messageLog.type = 'cred';
        messageLog.msg = "Your Credentials are wrong/ such a user doesn't exist";
    }else if(req.session.wrongMsg === 'login'){
        messageLog.type = 'login';
        messageLog.msg = 'You have successfully registered. Now Please login with those credentials';
    }
    req.session.wrongMsg = '';
    res.render('./auth/login', {messageLog});
});

//* Login Post request
router.post('/', sanitizeInput, (req,res, next) => {
    passport.authenticate('local', {
        successRedirect : `login/abc`,
        failureRedirect : 'login/wrong',
})(req, res, next);
});

router.get('/abc', (req, res) => {
    if(typeof req.user !== 'undefined')    res.redirect(`../${req.user.id}`); 
    else res.send("not logged in");
    
});

router.get('/wrong', (req, res) => {
    req.session.wrongMsg = 'cred';
    res.redirect(`../login`);
});

function sanitizeInput(req, res, next) {
    req.body.email = req.sanitize(mongoSanitize(req.body.email));
    req.body.password = req.sanitize(mongoSanitize(req.body.password));
    next();
}


module.exports = router;