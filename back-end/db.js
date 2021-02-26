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
const CompanyModel = require('./models/company');
const ContactModel = require('./models/contact');

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
const Company = CompanyModel(sequelize, Sequelize);
const Contact = ContactModel(sequelize, Sequelize);

// TABLES ASSOCIATIONS //
Country.hasMany(City, {
    underscored: 'true',
    foreignKey: 'country_id',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
});

City.belongsTo(Country, {
    underscored: 'true',
    foreignKey: 'country_id',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
});

Region.hasMany(Country, {
    underscored: 'true',
    foreignKey: 'region_id',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
});

Country.belongsTo(Region, {
    underscored: 'true',
    foreignKey: 'region_id',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
});

Company.belongsTo(City, {
    underscored: 'true',
    foreignKey: 'city_id',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
});

City.hasMany(Company, {
    underscored: 'true',
    foreignKey: 'city_id',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
})

City.hasOne(Contact, {
    underscored: 'true',
    foreignKey: 'city_id',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
});

Contact.belongsTo(City, {
    underscored: 'true',
    foreignKey: 'city_id',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
})

Company.hasOne(Contact, {
    underscored: 'true',
    foreignKey: 'company_id',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
});

Contact.belongsTo(Company, {
    underscored: 'true',
    foreignKey: 'company_id',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
})

// SYNC DB //
// sequelize.sync({ alter: true })
//     .then(() => {
//         console.log('The tables have been synchronized!');
//     })
//     .catch(e => console.log(e));

module.exports = {
    User,
    Region,
    Country,
    City,
    Company,
    Contact
}