const jwt = require('jsonwebtoken');

const UserModel = require('../models/user-model');


const authenticatedUser = async (username, password) => {
    return UserModel.find({username})
        .then(user => ({
            user: user[0],
            isAuth: user[0]?.password === password
        }));
}

const login = async (req, res) => {
    let {username, password} = req.body;
    if (!username || !password) {
        return res.status(404).send({message: 'Error logging in! Please send correct username & password.'});
    }
    authenticatedUser(username, password)
        .then((authenticatedUser) => {
            if (authenticatedUser?.isAuth) {
                const jwtSecretKey = process.env.JWT_SECRET_KEY;
                const data = {
                    time: Date(),
                    user: {
                        username,
                        name: authenticatedUser.user.name,
                        lastName: authenticatedUser.user.lastName,
                        id: authenticatedUser.user._id
                    },
                }
                const token = jwt.sign(data, jwtSecretKey, {expiresIn: process.env.TOKEN_EXPIRES_IN_MIN * 60});
                res.send(token);
            } else {
                return res.status(406).send({message: 'Invalid Login. Check username and password'});
            }
        })
        .catch(() => {
            return res.status(418).send({message: 'Invalid Login. Check username and password'});
        });
};

const checkAuth = (req, res, next) => {
    const token = req.header('Authorization');
    if (token) {
        let jwtSecretKey = process.env.JWT_SECRET_KEY;
        jwt.verify(token, jwtSecretKey, (error, data) => {
            if (error) {
                return res.status(403).send({message: 'User not authenticated!', error});
            }
            req.user = data.user;
            next();
        });
    } else {
        return res.status(403).send({message: 'User not logged in!'});
    }
};

module.exports = {
    authenticatedUser,
    login,
    checkAuth
}