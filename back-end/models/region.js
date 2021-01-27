module.exports = (sequelize, DataTypes) => {
    return sequelize.define('region', {
        region_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            unique: true
        },
        region: {
            type: DataTypes.STRING,
            unique: 'region'
        },
    },
        {
            timestamps: false
        }
    )
}