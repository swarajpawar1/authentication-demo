

const e = require('connect-flash');
const express= require('express');
const router= express.Router();
const bcrypt= require('bcryptjs')
const passport = require('passport')

const User= require('../models/User');


router.get('/login', (req, res) => res.render('login'));

router.get('/register', (req, res) => res.render('register'));


router.post('/register', (req, res) => {
    const {name, email, password, confirmPassword}= req.body;

    console.log(req.body);


    let errors= [];

    if(!name || !email || !password || !confirmPassword){
        errors.push({msg: "Please fill in all fields"})
    }

    if(password !== confirmPassword){
        errors.push({msg: "Passwords do not match"})
    }


    if(errors.length > 0){
        res.render('register',{
            errors,
            name,
            email,
            password,
            confirmPassword
        })
    }else {
        User.findOne({ email: email })
            .then(user => {
                if(user){
                    errors.push({ msg: "Email is already registered!" })
                    res.render('register',{
                        errors,
                        name,
                        email,
                        password,
                        confirmPassword
                    })
                }else{
                    const newUser= new User({
                        name,
                        email,
                        password
                    });

                    bcrypt.genSalt(10, (err, salt) => bcrypt.hash(newUser.password, salt, (err, hash) => {
                        if(err) console.log(err);

                        console.log("hashing!")
                        newUser.password= hash;

                        newUser.save()
                            .then(user => {
                                req.flash('success_msg', 'You are now registered and can log in');
                                res.redirect('/users/login')
                            })
                            .catch(err => console.log(err));
                    }))

                   
                }
            })
    }
});

// Login Logic
router.post('/login', (req, res, next) => {
    passport.authenticate('local', {
      successRedirect: '/session',
      failureRedirect: '/users/login',
      failureFlash: true
    })(req, res, next);
});


router.get('/logout', (req, res) => {
    req.logout();
    req.flash('success_msg', 'You are logged out');
    res.redirect('/users/login');
});


module.exports= router;