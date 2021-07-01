const express= require('express');
const router= express.Router();
const {ensureAuthenticated} = require('../config/safeSession');

router.get('/', (req, res) => res.render('homepage'));

router.get('/session', ensureAuthenticated, (req, res) => 
    res.render('session', {
        name: req.user.name
    }));


module.exports= router;