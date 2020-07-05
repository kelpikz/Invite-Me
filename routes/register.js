require('dotenv').config();
const express   = require('express'),
      router    = express.Router({mergeParams : true}), //!IMPORTANT
      app       = express(),
      bcrypt    = require('bcrypt'),
      mongoSanitize = require('mongo-sanitize'),
      joiSchema = require('../models/user-joi'),
      User      = require('../models/user');



//REGISTER FORM
router.get('/', (req, res) => {
    res.redirect('./login');
});


//REGISTERING A NEW USER
router.post('/', sanitizeInput, (req, res) => {
    const { error } = joiSchema.validate({  //valitates input
        username : req.body.username,
        email : req.body.email,
        password : req.body.password,
        repeat_password : req.body.repeat_password
    });
    if(error) {
        let message = (error.details[0].message);
        message = message.replace(/"/g,'');
        message = new indexFinder( message.slice(0, message.indexOf(' ')));
        res.render('./auth/login', {message : message});
    }else {  
    User.findOne({email : req.body.email})
    .then((user) => {
        if(user){
            let message = new indexFinder('exist');
            res.render('./auth/login', {message : message});
        }
        else {
            bcrypt.hash(req.body.password , 10)
                .then((hashedpassword) => {
                    User.create({
                        username : req.body.username,
                        email : req.body.email,
                        password : hashedpassword,
                        dept : req.body.dept,
                        year : Number(req.body.year)
                    }).then((user) => {
                        req.session.wrongMsg = 'login';
                        res.redirect(`./auth/login`);
                    }).catch((err) => {
                        console.log(err);
                        res.render('./auth/login');
                    });
        }).catch((err) => {
            console.log(err);
            res.render('./auth/login');
            });
        }
    }).catch((err) => {
        console.log(err);
        res.render('./auth/login');
    });
}
});

function indexFinder(str) {
    if(str === 'username') return{
        type:'username',
        msg : 'username length must be at least 5 characters long'
    };
    if(str === 'password') return {
        type : "password",
        msg : "password contains invalid characters. It can only contain [A-Z,a-z,0-9]"
    };
    if(str === 'repeat_password') return {
        type : "repeat_password",
        msg : "password dodesn't match"
    };
    if(str === 'email') return {
        type : 'email',
        msg : "invalid email format(only .com and .net is allowed)"
    };
    if(str === "exist") return {
        type : 'email',
        msg : 'Email already exists. Try a different Email or try logging in'
    };
}

//Sanitize user Input
function sanitizeInput(req, res, next) {
    req.body.username = req.sanitize(mongoSanitize(req.body.username));
    req.body.email = req.sanitize(mongoSanitize(req.body.email));
    req.body.password = req.sanitize(mongoSanitize(req.body.password));
    req.body.repeat_password = req.sanitize(mongoSanitize(req.body.repeat_password));
    req.body.dept = req.sanitize(mongoSanitize(req.body.dept));
    req.body.year = req.sanitize(mongoSanitize(req.body.year));
    next();
}

module.exports = router;