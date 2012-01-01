module.exports = function(sequelize, DataTypes) {
    var Roi = sequelize.define('Roi', {
            x:          DataTypes.INTEGER, 
            y:          DataTypes.INTEGER, 
            height:     DataTypes.INTEGER,
            width:      DataTypes.INTEGER, 
            confidence: DataTypes.INTEGER
        },
        {   
            classMethods: { 
                dictify: function(roi) {
                    return {
                        x:          roi.x,
                        y:          roi.y,
                        height:     roi.height, 
                        width:      roi.width, 
                        confidence: roi.confidence,
                        id:         roi.id
                    };
                }
            },
            instanceMethods: {}
        }
    );
    return Roi; 
};
