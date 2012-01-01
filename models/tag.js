module.exports = function(sequelize, DataTypes) {
    var Tag = sequelize.define('Tag', {
            name: DataTypes.STRING
        },
        {   
            classMethods: {
                dictify: function(tag) { 
                    return {
                        name: tag.name,
                        id: tag.id
                    }; 
                }
            },
            instanceMethods: {}
        }
    );
    return Tag; 
};