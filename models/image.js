module.exports = function(sequelize, DataTypes) {
    var Image = sequelize.define('Image', {
            filename:    DataTypes.STRING, 
            length:      DataTypes.INTEGER, 
            width:       DataTypes.INTEGER,
            description: DataTypes.TEXT
        },
        {   
            classMethods: {
                stringify: function(image) { 
                    return JSON.stringify({
                        filename:    image.filename,
                        length:      image.length, 
                        width:       image.width, 
                        description: image.description
                    }); 
                }
            },
            instanceMethods: {}
        }
    );
    return Image; 
};