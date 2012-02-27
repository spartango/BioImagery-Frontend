var Sequelize = require('sequelize')

var db = new Sequelize('bioimagery', 'imagingfrontend', '4ront3nd')

// Models
var Image         = db.import(__dirname +'/../models/image');
var Roi           = db.import(__dirname +'/../models/roi');
var Tag           = db.import(__dirname +'/../models/tag');
var ImageSequence = db.import(__dirname +'/../models/imagesequence');

// Relationships
Image.hasMany(Roi);
Image.belongsTo(ImageSequence);
ImageSequence.hasMany(Image);
Roi.belongsTo(Image);
Roi.hasMany(Tag);
Tag.hasMany(Roi);
Roi.belongsTo(Tag);

exports.sequence = function (req, res) {
    // body...
    // TODO
}

exports.listsequences = function(req, res) {
    // TODO
}