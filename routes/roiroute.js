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

/*
 * POST create a new roi 
 */

exports.createroi = function(req, res){
    // Get the image ID
    var imageId = req.param('id');
    var xOffset = req.param('x');
    var yOffset = req.param('y');
    var rWidth  = req.param('width');
    var rLength = req.param('length');
     
    // Ensure that all the right params are passed
    if(    imageId  
        && xOffset != null 
        && yOffset != null
        && rWidth  != null
        && rLength != null) {


            var newRoi = Roi.build({
                x:      xOffset,
                y:      yOffset,
                length: rLength,
                width:  rWidth
            });
            
            // Set the image (it better exist)
            Image.find(Number(imageId)).on('success', function(image) {
                // This will save the ROI automagically
                if(image) {
                    newRoi.setImage(image);
                } 
            });
            
            // Create an ROI instance
            // commit it to the db
            // Send a 200OK and the new ID
            res.send(newRoi.id, 200);

    } else {
        // param Error Condition 
        // Send a 400 back
        res.send('', 400);
    }

};

exports.tagroi = function(req, res) {
    // Get the ROI param id
    var roiId = req.params.id;
    // Get the tag param id
    var tagId = req.param('tag');
    if(roiId && tagId) {
            // Look up the ROI
            Roi.find(roiId).on('success', function(roi) {
               if(roi) {
                    // Look up the tag
                    Tag.find(tagId).on('success', function(tag) {
                        
                    });
               }  
            });
   
    }
    // Create association between ROI and tag
};

