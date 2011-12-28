module.exports = function(sequelize, DataTypes) {
    var Tag = sequelize.define('Tag', {
            name: DataTypes.STRING
        },
        {   
            classMethods: {
                stringify: function(tag) { 
                    return JSON.stringify({
                        name: tag.name,
                    }); 
                }
            }
        }
    );
    return Tag; 
};