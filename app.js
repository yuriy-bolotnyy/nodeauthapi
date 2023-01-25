const SECRET_KEY = 'secretkey'

const express = require('express');
const jwt = require('jsonwebtoken');

const app = express();

app.get('/api', (req, res) => {
    res.json({
        message: 'Welcome to the API'
    });
});

app.listen(5000, () => {
    console.log('Server started on port 5000');
});

// Basic version - no authorization check
// app.post('/api/posts', (req, res)=> {
//     res.json({
//         message: 'Post created ...'
//     });
// });

// Advanced version - with authorization check
app.post('/api/posts', verifyToken, (req, res)=> {

    jwt.verify(req.token, SECRET_KEY, (err, authData) => {
        if (err) {
            res.sendStatus(403);
        } else {
            res.json({
                message: 'Post created ...',
                authData
            });
        }
    })
});

app.post('/api/login', (req, res) => {
    // Mock user
    const user = {
        id: 1,
        username: 'brad',
        email: 'brad@gmail.com'
    }

    jwt.sign({user: user}, SECRET_KEY, { expiresIn: '30s'}, (err, token) => {
        res.json({
            token: token
        });
    });

});

// FORMAT OF TOKEN
// Authorization: Bearer <access_token>

// Verify Token
function verifyToken(req, res, next) {
    //Get auth header value
    const bearerHeader = req.headers['authorization'];
    // Check if bearer is undefined
    if (typeof bearerHeader !== 'undefined') {
        // Split at the space
        const bearer = bearerHeader.split(' ');
        // Get token from array
        const bearerToken = bearer[1];
        // Set the token inside the Request object
        req.token = bearerToken;
        // Next middleware
        next();
    } else {
        // Forbidden  
        res.sendStatus(403);
    }
}