var Sequelize = require('sequelize')

var db = new Sequelize('bioimagery', 'imagingfrontend', '4ront3nd')

// Models
var Image = db.import(__dirname +'/../models/image');
var Roi   = db.import(__dirname +'/../models/roi');
var Tag   = db.import(__dirname +'/../models/tag');

// Relationships
Image.hasMany(Roi);
Roi.belongsTo(Image); 
Roi.hasMany(Tag);

exports.tags = function(req, res) {
    // Get all the tags from the database
    // Generate a listing of them
    // Send it along
};

exports.gettag = function(req, res) {
    // Look up a tag
    // Get its name
    // Send that back
};

exports.createtag = function(req, res) {
    // Check for appropriate name param
    // Create the tag
    // Send back the id
};