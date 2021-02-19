module.exports = (sequelize, DataTypes) => {
    return sequelize.define('contact', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            unique: true
        },
        name: DataTypes.STRING,
        surname: DataTypes.STRING,
        charge: DataTypes.STRING,
        email: DataTypes.STRING,
        //company_id: DataTypes.STRING,
    },
        {
            timestamps: false
        }
    )
}