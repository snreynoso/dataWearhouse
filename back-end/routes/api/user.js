require('dotenv').config();
const router = require('express').Router();
const { Region, Country, City, Company } = require('../../db');
const { user_validation, authenticate_token } = require('./middlewares');
const jwt = require('jsonwebtoken');
const { Op } = require("sequelize");

const JWT_SIGNATURE = process.env.JWT_SIGNATURE;

// ROUTES => /api/user //
router.post('/login', user_validation(), async (req, res) => {
    try {
        const payload = {
            user_id: req.user.user_id,
            username: req.user.username,
            role: req.user.role
        }
        const accessToken = jwt.sign(payload, JWT_SIGNATURE);
        res.status(200).json({
            status: 200,
            role: req.user.role,
            msg: `${req.user.username} logged in successfully, Role: ${req.user.role}`,
            token: accessToken
        });
    } catch (e) { // username: [unique: true] email: [unique: true]
        console.log('Error: ', e.parent.sqlMessage);
        res.status(409).json({
            status: 409,
            msg: 'DB Failed',
            error: e
        });
    }
});

router.post('/loginCheck', authenticate_token(), (req, res) => {
    res.status(200).json({
        status: 200,
        role: req.login.role,
        msg: 'Logged in!'
    });
});

router.post('/create-region', async (req, res) => {
    let region = new Object;
    region.region = req.body.region;

    await Region.create(region);

    res.status(200).json({
        status: 200,
        msg: 'Region created!'
    });
});

router.post('/create-country', async (req, res) => {
    let country = new Object;
    country.country = req.body.country;
    country.region_id = req.body.region_id;

    await Country.create(country);

    res.status(200).json({
        status: 200,
        msg: 'Country created!'
    });
});

router.post('/create-city', async (req, res) => {
    let city = new Object;
    city.city = req.body.city;
    city.country_id = req.body.country_id;

    console.log(city)

    await City.create(city);

    res.status(200).json({
        status: 200,
        msg: 'City created!'
    });
});

router.get('/get-list', async (req, res) => {
    try {
        const allRegionsCities = await Region.findAll({
            include: [{
                model: Country,
                attributes: ['country_id', 'country'],
                include: {
                    model: City,
                    attributes: ['city_id', 'city']
                }
            }]
        });
        res.status(200).json({
            status: 200,
            msg: 'User list',
            list: allRegionsCities
        });
    } catch (e) {
        console.log('Error: ', e.parent.sqlMessage);
        res.status(409).send('DB Failed');//, e);
    }
});

router.delete('/delete-region', async (req, res) => {
    try {
        await Region.destroy({
            where: { region_id: { [Op.eq]: req.body.id } }
        });
        res.status(200).json({
            status: 200,
            msg: 'Region deleted',
        });
    } catch (e) {
        console.log('Error: ', e.parent.sqlMessage);
        res.status(409).send('DB Failed');//, e);
    }
});

router.delete('/delete-country', async (req, res) => {
    try {
        await Country.destroy({
            where: { country_id: { [Op.eq]: req.body.id } }
        });
        res.status(200).json({
            status: 200,
            msg: 'Country deleted',
        });
    } catch (e) {
        console.log('Error: ', e.parent.sqlMessage);
        res.status(409).send('DB Failed');//, e);
    }
});

router.delete('/delete-city', async (req, res) => {
    try {
        await City.destroy({
            where: { city_id: { [Op.eq]: req.body.id } }
        });
        res.status(200).json({
            status: 200,
            msg: 'City deleted',
        });
    } catch (e) {
        console.log('Error: ', e.parent.sqlMessage);
        res.status(409).send('DB Failed');//, e);
    }
});

router.post('/edit-region', async (req, res) => {
    try {
        await Region.update(
            {
                region: req.body.new_name
            },
            {
                where: { region_id: { [Op.eq]: req.body.id } }
            });
        res.status(200).json({
            status: 200,
            msg: 'Region updated!'
        });
    } catch (e) {
        console.log('Error: ', e.parent.sqlMessage);
        res.status(409).send('DB Failed');//, e);
    }
});

router.post('/edit-country', async (req, res) => {
    try {
        await Country.update(
            {
                country: req.body.new_name
            },
            {
                where: { country_id: { [Op.eq]: req.body.id } }
            });
        res.status(200).json({
            status: 200,
            msg: 'Region updated!'
        });
    } catch (e) {
        console.log('Error: ', e.parent.sqlMessage);
        res.status(409).send('DB Failed');//, e);
    }
});

router.post('/edit-city', async (req, res) => {
    try {
        await City.update(
            {
                city: req.body.new_name
            },
            {
                where: { city_id: { [Op.eq]: req.body.id } }
            });
        res.status(200).json({
            status: 200,
            msg: 'Country created!'
        });
    } catch (e) {
        console.log('Error: ', e.parent.sqlMessage);
        res.status(409).send('DB Failed');//, e);
    }
});

router.post('/create-company', async (req, res) => {
    try {
        let company = new Object;
        company.name = req.body.name;
        company.address = req.body.address;
        company.email = req.body.email;
        company.phone = req.body.phone;
        company.city_id = req.body.city_id;

        await Company.create(company);

        res.status(201).json({
            status: 201,
            msg: 'New company created!'
        });
    } catch (e) { // name: [unique: true]
        console.log('Error: ', e.errors[0].message);
        if (e.errors[0].type == 'unique violation') {
            res.status(401).json({
                status: 401,
                msg: e.errors[0].message
            });
        } else {
            res.status(409).json({
                status: 409,
                msg: 'Company has already exist',
                error: e
            });
        }
    }
});

router.post('/companies-list', async (req, res) => {
    try {
        const get_companies_list = await Company.findAll({
            include: [
                {
                    model: City,
                    attributes: ['city'],
                    include: {
                        model: Country,
                        attributes: ['country'],
                    }
                }
            ]
        });
        res.status(200).json({
            status: 200,
            msg: 'Company list',
            list: get_companies_list
        });
    } catch (e) {
        console.log('Error: ', e.parent.sqlMessage);
        res.status(409).send('DB Failed');//, e);
    }
});

router.delete('/delete-company', async (req, res) => {
    try {
        await Company.destroy({
            where: { company_id: { [Op.eq]: req.body.id } }
        });

        res.status(200).json({
            status: 200,
            msg: 'Company deleted',
        });
    } catch (e) {
        console.log('Error: ', e.parent.sqlMessage);
        res.status(409).send('DB Failed');//, e);
    }
});

router.get('/cities-list', async (req, res) => {
    try {
        const citiesList = await City.findAll({
        });
        res.status(200).json({
            status: 200,
            msg: 'City list',
            list: citiesList
        });
    } catch (e) {
        console.log('Error: ', e.parent.sqlMessage);
        res.status(409).send('DB Failed');//, e);
    }
});

router.post('/get-company', async (req, res) => {
    try {
        const companyValues = await Company.findAll({
            where: { company_id: { [Op.eq]: req.body.id } },
            include: [{
                model: City,
                attributes: ['city'],
            }]
        });

        res.status(200).json({
            company: companyValues[0].dataValues,
            status: 200
        });
    } catch (e) {
        console.log('Error: ', e.parent.sqlMessage);
        res.status(409).send('DB Failed');//, e);
    }
});

router.post('/edit-company', async (req, res) => {
    try {
        await Company.update({
                name: req.body.name,
                address: req.body.address,
                email: req.body.email,
                phone: req.body.phone,
                city_id: req.body.city_id,
            },
            { where: { company_id: req.body.id }
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
});

router.get('/db-lists', async (req, res) => {
    try {
        const get_country_list = await Country.findAll();
        const get_companies_list = await Company.findAll();
        res.status(200).json({
            status: 200,
            msg: 'Company list',
            countryList: get_country_list,
            companyList: get_companies_list
        });
    } catch (e) {
        console.log('Error: ', e.parent.sqlMessage);
        res.status(409).send('DB Failed');//, e);
    }
});
module.exports = router;