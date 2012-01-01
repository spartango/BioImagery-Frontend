module.exports = function(sequelize, DataTypes) {
    var Image = sequelize.define('Image', {
            filename:    DataTypes.STRING, 
            height:      DataTypes.INTEGER, 
            width:       DataTypes.INTEGER,
            description: DataTypes.TEXT
        },
        {   
            classMethods: {
                dictify: function(image) { 
                    return {
                        filename:    image.filename,
                        height:      image.height, 
                        width:       image.width, 
                        description: image.description,
                        id:          image.id
                    }; 
                }
            },
            instanceMethods: {}
        }
    );
    return Image; 
};