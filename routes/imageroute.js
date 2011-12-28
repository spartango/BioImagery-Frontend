var tiling = require('../tools/tiling'),
        fs = require('fs')

var Sequelize = require('sequelize')

var db = new Sequelize('bioimagery', 'imagingfrontend', '4ront3nd')

// Models
var Image = db.import(__dirname +'/../models/image');
var Roi   = db.import(__dirname +'/../models/roi');
var Tag   = db.import(__dirname +'/../models/tag');

// Relationships
//Image.hasMany(Roi);
//Roi.belongsTo(Image); 
//Roi.hasMany(Tag);

var TILE_WIDTH  = 256;
var TILE_LENGTH = 256;

/*
 * GET a raw image
 */

exports.image = function(req, res){
    // Get the image ID
    var imageId = req.params.id;
    
    if(imageId) {
        Image.find(Number(imageId)).on('success', function(image) {
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
        Image.find(Number(imageId)).on('success', function(image) {
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
        Image.find(Number(imageId)).on('success', function(image) {
            if(image) {
                // Ask the db for all ROIs on a given image
                image.getRois().on('success', function(rois){
                    var targets; 
                    // If  bounds are requested, filter by the bounding params
                    if(xOffset && yOffset && width && length) {
                        targets = rois.filter(function(roi) {
                            return roi.x >= xOffset
                                   && roi.y >= yOffset
                                   && roi.width < (xOffset + width)
                                   && roi.length < (yOffset + length);
                        });
                    } else {
                        // Send everything
                        targets = rois;
                    }

                    // JSONify targets
                    var json = JSON.stringify(targets.map(Roi.stringify));
                    res.send(json, 200);
                });
                    
            } else {
                res.send('', 404);
            }

        });  
    } else {
        // param Error Condition 
        // Send a 400 back
        res.send('', 400);
    }

};

exports.createimage =  function(req, res) {
    // TODO work in progress for uploads
    var form = new formidable.IncomingForm();
    form.parse(req, function(err, fields, files) {
      res.writeHead(200, {'content-type': 'text/plain'});
      res.write('received upload:\n\n');
      res.end(sys.inspect({fields: fields, files: files}));
    }); 
};
