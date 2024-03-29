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


/*
 * GET get roi info
 */ 

exports.roi = function(req, res) {

    var roiId = req.params.id;

    if(roiId) {
        Roi.find(Number(roiId)).on('success', function(roi) {
            if(roi) {
                var json = JSON.stringify(Roi.dictify(target));
                res.send(json, 200);
            } else {
                res.render('404', {title: '404 Bad Roi'});
            }
        });
    } else {
        res.send('Bad Param', 400);
    }
}

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
            console.log('Tagging ROI');
            Roi.find(Number(roiId)).on('success', function(roi) {
               if(roi) {
                    // Look up the tag
                    Tag.find(Number(tagId)).on('success', function(tag) {
                        if(tag) {
                            roi.addTag(tag);
                            res.send('', 200);
                        } else {
                            res.send('No such tag', 404);
                        }
                    });
                } else {
                    res.send('No Such ROI', 404);
                }
            });
   
    }
    // Create association between ROI and tag
};

exports.gettags = function(req, res){
    var roiId = req.params.id;
    if(roiId) {
            // Look up the ROI
            Roi.find(Number(roiId)).on('success', function(roi) {
               if(roi) {
                    // Get all the tags
                    roi.getTags().on('success', function(tags){
                        var json = JSON.stringify(tags.map(function(tag){
                            return tag.id;
                        }));
                        // Generate a listing of them
                        // Send it along
                        res.send(json, 200);
                    });
               }  
            });
   
    }
}

