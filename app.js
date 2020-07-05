require('dotenv').config();
const express   = require('express'),
    app         = express(),
    bodyParser  = require('body-parser'),
    path        = require('path'),
    morgan      = require('./config/morgan'),
    passport    = require('passport'),
    expressSanitizer  = require('express-sanitizer'),
    flash       = require('express-flash'),
    port        = process.env.PORT || 3000;


require('./config/db');
require('dotenv').config();
app.use(express.static(path.join(__dirname,'public')));
app.use(bodyParser.urlencoded({extended : true}));
app.use(expressSanitizer());
app.use(express.json({strict : false}));
app.use(morgan);
app.use(flash());
app.use(require('express-session')({
    secret : 'asaijvoeihsdfosdnfol',
    resave : false,
    saveUninitialized : false
}));
//these are session authentification middleware for passport
require('./config/passport')(passport);
app.use(passport.initialize());
app.use(passport.session());

app.set('view engine', '.ejs');
app.set('views', path.join(__dirname,'views'));


app.get('/instructions', (req, res) => {
    res.render('invitation/instructions');
});

app.get('/', (req, res) => {
    res.render('home');
});


//ROUTES
const userRoute = require('./routes/landing');
app.use('/user', userRoute);




app.listen(port, () => {
    console.log(`You are now connected to the data base!\nVisit http://localhost:${port}`);
});

