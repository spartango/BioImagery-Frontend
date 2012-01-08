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
    var imageId = req.body.id;
    var xOffset = req.body.x;
    var yOffset = req.body.y;
    var rWidth  = req.body.width;
    var rLength = req.body.height;

    console.log("Creating ROI");
    // Ensure that all the right params are passed
    if(    imageId  
        && xOffset != null 
        && yOffset != null
        && rWidth  != null
        && rLength != null) {


            var newRoi = Roi.build({
                x:      xOffset,
                y:      yOffset,
                height: rLength,
                width:  rWidth
            });
            
            // Set the image (it better exist)
            Image.find(Number(imageId)).on('success', function(image) {
                // This will save the ROI automagically
                if(image) {
                    newRoi.setImage(image).on('success', function() {
                        // Send a 200OK and the new ID
                        console.log('New ROI: '+newRoi.id);
                        res.send(''+newRoi.id, 200);
                    });
                } else {
                    res.send('No image', 404);
                } 
            });
        
    } else {
        // param Error Condition 
        // Send a 400 back
        res.send('Bad params', 400);
    }

};

/*
 * POST update an roi 
 */

exports.updateroi = function(req, res){
    // Get the image ID
    var roiId   = req.params.id;
    var xOffset = req.body.x;
    var yOffset = req.body.y;
    var rWidth  = req.body.width;
    var rLength = req.body.height;

    // Ensure that all the right params are passed
    if(    roiId  
        && xOffset != null 
        && yOffset != null
        && rWidth  != null
        && rLength != null) {
            console.log("Updating ROI: "+roiId);
            Roi.find(Number(roiId)).on('success', function(roi){
               if(roi) {
                   roi.x      = xOffset;
                   roi.y      = yOffset;
                   roi.width  = rWidth;
                   roi.height = rLength;

                   console.log(roi.toString());

                   roi.save();
                   res.send('', 200);
               } else {
                   res.send('No Such ROI', 404);
               }

            });
           
        
    } else {
        // param Error Condition 
        // Send a 400 back
        res.send('Bad params', 400);
    }

};

exports.notifyRoiChange = function(clientId, newRoi) {
    // Generate an event
    // Send the event with SSE
    
};

exports.tagroi = function(req, res) {
    // Get the ROI param id
    var roiId = req.params.id;
    // Get the tag param id
    var tagId = req.body.tag;
    if(roiId && tagId) {
            // Look up the ROI
            Roi.find(roiId).on('success', function(roi) {
               if(roi) {
                    // Look up the tag
                    Tag.find(tagId).on('success', function(tag) {
                        // TODO apply tag
                    });
               }  
            });
   
    }
    // Create association between ROI and tag
};

