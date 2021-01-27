require('dotenv').config();
const JWT_SIGNATURE = process.env.JWT_SIGNATURE;
const jwt = require('jsonwebtoken');
const { User } = require('../../db');
//const { Op } = require("sequelize");

function user_validation() {
    return async (req, res, next) => {
        const { username, password } = req.body;
        try {
            const user_from_db = await User.findAll({
                where: {
                    username: username
                },
                attributes: ['user_id', 'username', 'password', 'role']
            });
            if (user_from_db.length !== 1) { // More than one user in DB with same username or email
                res.status(401).json({
                    status: 401,
                    msg: 'Username or password incorrect'
                });
            } else {
                const password_from_db = user_from_db[0].dataValues.password;
                if (password !== password_from_db) {
                    res.status(401).json({
                        status: 401,
                        msg: 'Username or password incorrect'
                    });
                } else {
                    req.user = user_from_db[0].dataValues;
                    next();
                }
            }
        } catch (e) {
            console.log('Error: ', e.parent.sqlMessage);
            res.status(409).json({
                status: 409,
                msg: 'DB Failed',
                error: e
            });
        }
    }
}

function authenticate_token() {
    return (req, res, next) => {
        let token = req.headers.authorization;
        //let authHeader = req.headers.authorization;
        //let token = authHeader && authHeader.split(' ')[1];
        if (token == null) return res.status(401).send('Access token is missing or invalid');

        jwt.verify(token, JWT_SIGNATURE, (err, payload) => {
            if (err) {
                res.status(401).json({
                    status: 401,
                    msg: 'Token failure',
                });
            }
            req.login = payload;
            next();
        });
    }
}

module.exports = {
    user_validation,
    authenticate_token,
};