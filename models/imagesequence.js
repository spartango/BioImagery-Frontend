module.exports = function(sequelize, DataTypes) {
    var ImageSequence = sequelize.define('ImageSequence', {
            count:       DataTypes.INTEGER, 
            delta:       DataTypes.INTEGER,
            description: DataTypes.TEXT
        },
        {   
            classMethods: {
                dictify: function(imageseq) { 
                    return {
                        count:       imageseq.count, 
                        delta:       imageseq.delta,
                        description: imageseq.description,
                        id:          imageseq.id, 
                    }; 
                }
            },
            instanceMethods: {}
        }
    );
    return ImageSequence; 
};