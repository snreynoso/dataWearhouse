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
        address: DataTypes.STRING,
        interes: DataTypes.STRING,
        WAAccount: DataTypes.STRING,
        WAPreference: DataTypes.STRING,
        INAccount: DataTypes.STRING,
        INPreference: DataTypes.STRING,
        FBAccount: DataTypes.STRING,
        FBPreference: DataTypes.STRING
        //company_id: DataTypes.STRING,
    },
        {
            timestamps: false
        }
    )
}