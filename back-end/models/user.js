module.exports = (sequelize, DataTypes) => {
    return sequelize.define('user', {
        user_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            unique: true
        },
        username: {
            type: DataTypes.STRING,
            unique: 'username'
        },
        name: DataTypes.STRING,
        email: {
            type: DataTypes.STRING,
            unique: 'email'
        },
        role: DataTypes.STRING,
        password: DataTypes.STRING,
    },
        {
            timestamps: false
        }
    )
}