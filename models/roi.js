module.exports = function(sequelize, DataTypes) {
    var Roi = sequelize.define('Roi', {
            x:          DataTypes.INTEGER, 
            y:          DataTypes.INTEGER, 
            length:     DataTypes.INTEGER,
            width:      DataTypes.INTEGER, 
            confidence: DataTypes.INTEGER
        },
        {   
            classMethods: { 
                dictify: function(roi) {
                    return {
                        x:          roi.x,
                        y:          roi.y,
                        length:     roi.length, 
                        width:      roi.width, 
                        confidence: roi.confidence,
                        id: roi.id
                    };
                }
            },
            instanceMethods: {}
        }
    );
    return Roi; 
};
