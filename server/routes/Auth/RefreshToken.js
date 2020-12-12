const router = require('express').Router()
const jwt = require('jsonwebtoken')

// function to refresh a new token, when the current access token is expired
router.post('/newToken', (req, res) => {
    const refresh = req.body.refresh
    if (!refresh) res.status(403).json({ message: 'No available' });

    // check if the refresh token exists 
    if (!auth.refreshTheToken(refresh)) {
        res.status(403).json({ message: 'invalid refresh token' });
    }
    else {
        // verify the refresh if it does exist
        jwt.verify(refresh, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
            // if err, then the token sent is not valid
            if (err) {
                res.sendStatus(403);
                res.end();
            }
            // generate a new token if valid
            else {
                const newAccessToken = auth.generateToken({ name: user.name })
                res.status(200).json({
                    accessToken: newAccessToken,
                    refreshToken: refresh
                })

            }
        })
    }
})