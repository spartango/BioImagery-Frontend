module.exports = function(sequelize, DataTypes) {
    var Tag = sequelize.define('Tag', {
        name: DataTypes.STRING
    });
    return Tag; 
};