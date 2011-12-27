
module.exports = function(sequelize, DataTypes) {
    var Image = sequelize.define('Image', {
        filename:    DataTypes.STRING, 
        length:      DataTypes.INTEGER, 
        width:       DataTypes.INTEGER,
        description: DataTypes.STRING,
    });
    return Image; 
};