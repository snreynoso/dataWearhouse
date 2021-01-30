module.exports = (sequelize, DataTypes) => {
    return sequelize.define('company', {
        company_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            unique: true
        },
        name: {
            type: DataTypes.STRING,
            unique: 'name'
        },
        address: DataTypes.STRING,
        email: DataTypes.STRING,
        phone: DataTypes.STRING,
        city_id: DataTypes.INTEGER
    },
        {
            timestamps: false
        }
    )
}