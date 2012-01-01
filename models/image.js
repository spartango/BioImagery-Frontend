module.exports = function(sequelize, DataTypes) {
    var Image = sequelize.define('Image', {
            filename:    DataTypes.STRING, 
            length:      DataTypes.INTEGER, 
            width:       DataTypes.INTEGER,
            description: DataTypes.TEXT
        },
        {   
            classMethods: {
                dictify: function(image) { 
                    return {
                        filename:    image.filename,
                        length:      image.length, 
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