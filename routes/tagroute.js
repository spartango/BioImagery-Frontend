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
    Tags.findAll().on('success', function(tags){
        var json = JSON.stringify(tags.map(Tag.stringify));
        // Generate a listing of them
        // Send it along
        res.send(json, 200);
    });

};

exports.gettag = function(req, res) {
    var tagId = req.params.id;
    if(tagId) {
        // Look up a tag
        Tags.find(Number(tagId)).on('success', function(tag) {
            if(tag) {
                // Get its name
                // Send that back   
                res.send(tag.name, 200);
            } else {
                res.render('404', {title: '404 Bad Tag'});
            }
        });

    } else {
        res.render('404', {title: '404 No Tag'});
    }
};

exports.createtag = function(req, res) {
    // Check for appropriate name param
    var tname = req.params.name;
    if(tname) {
        // Create the tag
        var newTag = Tag.build({
            name: tname
        });

        // Send back the id
        newTag.save().on('success', function(){
            res.send(newTag.id, 200);
        })

    } else{
        res.send('Bad Param', 400);
    }

};