var Image = sequelize.define('Image', {
    filename:    DataTypes.STRING, 
    length:      DataTypes.INTEGER, 
    width:       DataTypes.INTEGER,
    description: DataTypes.STRING,
});

module.exports = function(sequelize, DataTypes) {
    return Image; 
};