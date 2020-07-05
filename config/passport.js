const LocalStrategy = require('passport-local').Strategy,
      bcrypt        = require('bcrypt'),
      User          = require('../models/user');

//*For login authentication
module.exports =  function(passport) {
    passport.use(
        new LocalStrategy( {usernameField : 'email'}, (email, password, done) => {
          User.findOne({ email : email })  //EMAIL MATCH
            .then((user) => {
                if(!user)   {
                    return done(null, false, {message : "Incorrect email/ user is not registered"});}
                bcrypt.compare(password, user.password, (err, isMatch) => {  //PASSWORD MATCH
                    if(err) throw err;

                    if(isMatch) {
                        return done(null, user);
                    } else {
                        return done(null, false, {message : 'Password in correct'});
                    }
                });
            }).catch((err) => {
                console.log(err); //SOMETHING WENT WRONG IN THE SERVER
            });
        })
    );
    passport.serializeUser((user, done) => {  //TO ESTABLISH A SESSION
        done(null, user.id);
      });
      
      passport.deserializeUser((id, done) => {  //TO END THE SESSION
        User.findById(id,(err, user) => {
          done(err, user);
        });
      });
};
