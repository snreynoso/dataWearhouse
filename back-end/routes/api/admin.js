require('dotenv').config();
const router = require('express').Router();
const { User } = require('../../db');
//const { User, Product, Order, Products_x_order } = require('../../db');
const { authenticate_token } = require('./middlewares');
const { Op } = require("sequelize");

// ROUTES => /api/admin //
router.post('/create-user', authenticate_token(), async (req, res) => {
    if (req.login.role !== 'admin') { // Require Admin role
        console.log('Buscando error')
        res.status(402).json({
            status: 402,
            msg: 'Acess token is missing or invalid'
        })
    } else {
        try {
            let user = new Object;
            user.username = req.body.username;
            user.name = req.body.name;
            user.email = req.body.email;
            user.role = req.body.role;
            user.password = req.body.password;

            await User.create(user);

            res.status(201).json({
                status: 201,
                msg: 'New user created!'
            });
        } catch (e) { // username: [unique: true] email: [unique: true]
            console.log('Error: ', e.errors[0].message);

            if (e.errors[0].type == 'unique violation') {
                res.status(401).json({
                    status: 401,
                    msg: e.errors[0].message
                });
            } else {
                res.status(409).json({
                    status: 409,
                    msg: 'Username or email has already exist',
                    error: e
                });
            }
        }
    }
});

router.post('/users-list', authenticate_token(), async (req, res) => {
    if (req.login.role !== 'admin') { // Require Admin role
        res.status(401).send('Access token is missing or invalid')
    } else {
        try {
            const get_users_list = await User.findAll();
            res.status(200).json({
                status: 200,
                msg: 'User list',
                list: get_users_list
            });
        } catch (e) {
            console.log('Error: ', e.parent.sqlMessage);
            res.status(409).send('DB Failed');//, e);
        }
    }
});

router.delete('/delete-user', authenticate_token(), async (req, res) => {
    if (req.login.role !== 'admin') { // Require Admin role
        res.status(401).send('Access token is missing or invalid')
    } else {
        try {
            //const get_users_list = await User.findAll();
            await User.destroy({
                where: { user_id: { [Op.eq]: req.body.id } }
            });

            res.status(200).json({
                status: 200,
                msg: 'User deleted',
            });
        } catch (e) {
            console.log('Error: ', e.parent.sqlMessage);
            res.status(409).send('DB Failed');//, e);
        }
    }
});

router.post('/get-user', authenticate_token(), async (req, res) => {
    if (req.login.role !== 'admin') { // Require Admin role
        res.status(401).send('Access token is missing or invalid')
    } else {
        try {
            const userValues = await User.findAll({
                where: { user_id: { [Op.eq]: req.body.id } }
            });

            res.status(200).json({
                user: userValues[0].dataValues,
                status: 200
            });
        } catch (e) {
            console.log('Error: ', e.parent.sqlMessage);
            res.status(409).send('DB Failed');//, e);
        }
    }
});

router.post('/edit-user', authenticate_token(), async (req, res) => {
    if (req.login.role !== 'admin') { // Require Admin role
        console.log('Buscando error')
        res.status(402).json({
            status: 402,
            msg: 'Acess token is missing or invalid'
        })
    } else {
        try {
            await User.update(
                {
                    username: req.body.username,
                    name: req.body.name,
                    email: req.body.email,
                    role: req.body.role,
                    password: req.body.password,
                },
                {
                    where: {
                        user_id: req.body.id
                    }
                });

            res.status(200).json({
                status: 200,
                msg: 'User edited!'
            });
        } catch (e) { // username: [unique: true] email: [unique: true]
            console.log('Error: ', e.errors[0].message);

            if (e.errors[0].type == 'unique violation') {
                res.status(401).json({
                    status: 401,
                    msg: e.errors[0].message
                });
            } else {
                res.status(409).json({
                    status: 409,
                    msg: 'Username or email has already exist',
                    error: e
                });
            }
        }
    }
});

module.exports = router;