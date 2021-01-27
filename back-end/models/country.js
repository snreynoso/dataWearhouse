module.exports = (sequelize, DataTypes) => {
    return sequelize.define('country', {
        country_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            unique: true
        },
        country: {
            type: DataTypes.STRING,
            unique: 'country'
        },
        region_id: DataTypes.INTEGER
    },
        {
            timestamps: false
        }
    )
}