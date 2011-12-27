/*
 * GET a raw image
 */

exports.image = function(req, res){
    // Get the image ID
    var imageId = req.params.id;
    
    if(imageId != null) {
        Image.get(imageId).on('success', function(image) {
            if(image != null) {
                var filename = image.filename;
                // Get the raw file from the disk
                // Send it along
            }

        });  
    } 

    // Error condition
    // Send a 404 back
};

/*
 * GET a tile
 */

exports.tile = function(req, res){
    // Get the image ID
    var imageId = req.params.id;
    var xOffset = req.params.x;
    var yOffset = req.params.y;
    // Assert that the image offsets are safe
    // Floor the image offsets to the nearest bin 

    if(imageId != null && xOffset != null && yOffset != null) {
        Image.get(imageId).on('success', function(image) {
            if(image != null) {
                var filename = image.filename;

                // Generate the tilename
                // Get the tile from disk 
                // Send the tile along
            }

        });  
    } 

    // Error Condition 
    // Send a 404 back

};

/*
 * GET rois 
 */

exports.rois = function(req, res){
    // Get the image ID
    var imageId = req.params.id;
    var xOffset = req.params.x;
    var yOffset = req.params.y;
    var width   = req.params.width;
    var length  = req.params.length;

    if(imageId != null) {
        Image.get(imageId).on('success', function(image) {
            if(image != null) {
                var filename = image.filename;
                    // Ask the db for all ROIs on a given image
                    // If no bounds are requested, then send ALL ROIs
                    // Else, Get the bounding params
                    // Filter the ROI-set for the bounds
            }

        });  
    } 

    // Error Condition 
    // Send a 404 back

};

/*
 * POST create a new roi 
 */

exports.createroi = function(req, res){
    // Get the image ID
    var imageId = req.params.id;
    var xOffset = req.params.x;
    var yOffset = req.params.y;
    var rWidth  = req.params.width;
    var rLength = req.params.length;
     
    // Ensure that all the right params are passed
    if(    imageId != null 
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
            Image.find(imageId).on('success', function(image) {
                // This will save the ROI automagically
                if(image != null)
                    newRoi.setImage(image);
            });
            

    }

    // Create an ROI instance
    // commit it to the db
    // Send a 200OK

    // Error Condition 
    // Send a 404 back
};
