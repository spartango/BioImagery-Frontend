// TODO fix imports...we need fs and Image, Roi and Tag

var TILE_WIDTH  = 256;
var TILE_LENGTH = 256;

/*
 * GET a raw image
 */

exports.image = function(req, res){
    // Get the image ID
    var imageId = req.params.id;
    
    if(imageId) {
        Image.get(imageId).on('success', function(image) {
            if(image) {
                // Get the raw file from the disk
                fs.readFile(image.filename, 
                    function(err, data) {
                        if(err) {
                            // Error Condition
                            res.send('', 404);
                        } else {
                            res.writeHead(200, {'Content-Type': 'image/tiff' });
                            res.end(img, 'binary');
                        }
                    }
                );
                // Send it along
            } else {
                // Error condition
                // Send a 404 back
                res.send('', 404);
            }

        });  
    } else {
        // param Error condition
        // Send a 400 back
        res.send('', 400);
    }


};

/*
 * GET a tile
 */

exports.tile = function(req, res){
    // Get the image ID
    var imageId = req.params.id;
    var xOffset = TILE_WIDTH * Math.floor(req.params.x / TILE_WIDTH);
    var yOffset = TILE_LENGTH * Math.floor(req.params.y / TILE_LENGTH);
    // Assert that the image offsets are safe
    // Floor the image offsets to the nearest bin 

    if(imageId && xOffset && yOffset) {
        Image.get(imageId).on('success', function(image) {
            if(image) {
                var tilename = tiling.generateTileName(xOffset, yOffset, image.filename);

                // Get the tile from disk 
                fs.readFile(tilename, 
                    function(err, data) {
                        if(err) {
                            // Error Condition
                            res.send('', 404);
                        } else {
                            res.writeHead(200, {'Content-Type': 'image/tiff' });
                            res.end(data, 'binary');
                        }
                    }
                );
                // Send the tile along
            } else {
                // Error Condition
                res.send('', 404);
            }

        });  
    } else {
        // param Error Condition 
        // Send a 400 back
        res.send('', 400);
    }



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

    if(imageId) {
        Image.get(imageId).on('success', function(image) {
            if(image) {
                var filename = image.filename;
                image.getRois().on('success', function(rois){
                    // Ask the db for all ROIs on a given image
                    // If no bounds are requested, then send ALL ROIs
                    // Else, Get the bounding params
                    // Filter the ROI-set for the bounds
                });
                    
            }

        });  
    } else {
        // param Error Condition 
        // Send a 400 back
        res.send('', 400);
    }


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

exports.createtag = function(req, res) {
    
};

exports.tagroi = function(req, res) {
    
};
