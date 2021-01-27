require('dotenv').config();
const SQL_USER = process.env.SQL_USER;
const SQL_PASS = process.env.SQL_PASS;
const SQL_HOST = process.env.SQL_HOST;
const SQL_PORT = process.env.SQL_PORT;
const SQL_DATABASE = process.env.SQL_DATABASE;

const Sequelize = require('sequelize');

const UserModel = require('./models/user');
const RegionModel = require('./models/region');
const CountryModel = require('./models/country');
const CityModel = require('./models/city');


// CONECTING TO DB //
const sequelize = new Sequelize(SQL_DATABASE, SQL_USER, SQL_PASS, {
    host: SQL_HOST,
    port: SQL_PORT,
    dialect: 'mysql'
});

const User = UserModel(sequelize, Sequelize);
const Region = RegionModel(sequelize, Sequelize);
const Country = CountryModel(sequelize, Sequelize);
const City = CityModel(sequelize, Sequelize);

// TABLES ASSOCIATIONS //
Region.hasMany(Country, {
    foreignKey: {
        name: 'region_id',
        allowNull: false
    },
    sourceKey: 'region_id',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
});

Country.hasMany(City, {
    foreignKey: {
        name: 'country_id',
        allowNull: false
    },
    sourceKey: 'country_id',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
});

// SYNC DB //
// sequelize.sync({ force: true })
//     .then(() => {
//         console.log('The tables have been synchronized!');
//     })
//     .catch(e => console.log(e));

module.exports = {
    User,
    Region,
    Country,
    City
}