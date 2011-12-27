module.exports = function(sequelize, DataTypes) {
    var Roi = sequelize.define('Roi', {
        x:          DataTypes.INTEGER, 
        y:          DataTypes.INTEGER, 
        length:     DataTypes.INTEGER,
        width:      DataTypes.INTEGER, 
        confidence: DataTypes.INTEGER
    });
    return Roi; 
};
