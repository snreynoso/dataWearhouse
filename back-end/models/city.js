module.exports = (sequelize, DataTypes) => {
    return sequelize.define('city', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            unique: true
        },
        city: {
            type: DataTypes.STRING,
            unique: 'city'
        },
        //country_id: DataTypes.INTEGER
    },
        {
            timestamps: false
        }
    )
}