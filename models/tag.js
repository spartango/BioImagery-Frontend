var Tag = sequelize.define('Tag', {
    name: DataTypes.STRING
});

module.exports = function(sequelize, DataTypes) {
    return Tag; 
};