var Sequelize = require('sequelize')

var db = new Sequelize('bioimagery', 'imagingfrontend', '4ront3nd')

// Models
var Image = db.import(__dirname +'/../models/image');
var Roi   = db.import(__dirname +'/../models/roi');
var Tag   = db.import(__dirname +'/../models/tag');

exports.tags = function(req, res) {
    
};

exports.gettag = function(req, res) {
    
};

exports.createtag = function(req, res) {
    
};