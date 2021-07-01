const express= require('express');
const mongoose= require('mongoose');
const passport = require('passport');
const flash= require('connect-flash');
const session= require('express-session');


const app= express();

require('./config/passport')(passport);

const PORT= process.env.PORT || 5000;

// DB config
const db= require('./config/keys').MongoURI;


mongoose.connect(db, {useNewUrlParser : true})
    .then(() => console.log("mongoDB connected"))
    .catch(err => console.log(err));



// EJS
app.set('view engine', 'ejs');

// Body parser
app.use(express.urlencoded({ extended : false }));


// express sessions
app.use(session ({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}))

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Flash connect
app.use(flash());

// connect flash
app.use((req, res, next) => {
    res.locals.success_msg= req.flash('success_msg');
    res.locals.error_msg= req.flash('error_msg');
    res.locals.error= req.flash('error');
    next();
});



// Routes
app.use('/', require('./routes/index'));
app.use('/users', require('./routes/users'));




app.listen(PORT, console.log(`Server started on ${PORT}`))