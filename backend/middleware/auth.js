const jwt = require('jsonwebtoken');

const authenticateToken = (req, res, next) => {
    const token = req.query.token || req.headers['authorization']?.split(' ')[1];
    console.log('Token:', token);
    if (token == null) {
        console.log('No token provided');
        return res.sendStatus(401);
    }

    jwt.verify(token, process.env.SECRET_KEY, (err, user) => {
        if (err) {
            console.log('JWT Verification Error:', err);
            return res.sendStatus(403);
        }
        req.user = user;
        console.log('Token verified, user:', user);
        next();
    });
};

module.exports = { authenticateToken };
