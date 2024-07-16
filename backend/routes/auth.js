const express = require('express');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const router = express.Router();

router.get('/google', passport.authenticate('google', { scope: ['profile'] }));

router.get('/google/callback', 
    passport.authenticate('google', { failureRedirect: '/' }),
    (req, res) => {
        const token = jwt.sign({ id: req.user.id }, process.env.SECRET_KEY, { expiresIn: '1h' });
        res.redirect('/?token=' + token);
    }
);

module.exports = router;
