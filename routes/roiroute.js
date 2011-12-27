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
    if(    imageId  
        && xOffset  
        && yOffset  
        && rWidth   
        && rLength ) {


            var newRoi = Roi.build({
                x:      xOffset,
                y:      yOffset,
                length: rLength,
                width:  rWidth
            });
            
            // Set the image (it better exist)
            Image.find(imageId).on('success', function(image) {
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
    
};