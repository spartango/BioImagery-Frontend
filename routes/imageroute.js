var tiling = require('../tools/tiling'),
        fs = require('fs')

var imageDir = __dirname+'/../images/'
var tileDir  = __dirname+'/../tiles/'

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
 * GET a raw image
 */

exports.image = function(req, res){
    // Get the image ID
    var imageId = req.params.id;
    
    if(imageId) {
        Image.find(Number(imageId)).on('success', function(image) {
            if(image) {
                // Get the raw file from the disk
                fs.readFile(imageDir + image.filename, 
                    function(err, data) {
                        if(err) {
                            // Error Condition
                            res.render('404', {title: '404 Bad File'});
                        } else {
                            res.writeHead(200, {'Content-Type': 'image/tiff' });
                            res.end(data, 'binary');
                        }
                    }
                );
                // Send it along
            } else {
                // Error condition
                // Send a 404 back
                res.render('404', {title: '404 Bad DB'});
            }

        });  
    } else {
        // param Error condition
        // Send a 400 back
        res.send('Bad Params', 400);
    }
};

/*
 * GET a tile
 */

exports.tile = function(req, res){
    // Get the image ID
    var imageId = req.params.id;
    var xOffset = tiling.TILE_WIDTH * Math.floor(req.param('x') / tiling.TILE_WIDTH);
    var yOffset = tiling.TILE_LENGTH * Math.floor(req.param('y') / tiling.TILE_LENGTH);
    // Assert that the image offsets are safe
    // Floor the image offsets to the nearest bin 
    if(imageId && xOffset != null && yOffset != null) {
        Image.find(Number(imageId)).on('success', function(image) {
            if(image) {
                var tilename = tiling.generateTileName(xOffset, yOffset, image.filename);

                // Get the tile from disk 
                fs.readFile(tileDir + tilename, 
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
        res.send('Bad Params', 400);
    }
    
};

/*
 * GET rois 
 */

exports.rois = function(req, res){
    // Get the image ID
    var imageId = req.params.id;
    var xOffset = req.param('x');
    var yOffset = req.param('y');
    var width   = req.param('width');
    var length  = req.param('length');

    if(imageId) {
        Image.find(Number(imageId)).on('success', function(image) {
            if(image) {
                // Ask the db for all ROIs on a given image
                image.getRois().on('success', function(rois){
                    var targets; 
                    // If  bounds are requested, filter by the bounding params
                    if(xOffset      != null 
                        && yOffset  != null 
                        && width    != null 
                        && length   != null) {
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
                res.render('404', {title: '404'});
            }

        });  
    } else {
        // param Error Condition 
        // Send a 400 back
        res.send('Bad Params', 400);
    }

};

exports.createimage =  function(req, res) {
    //Test: Make some initial images
    var newImage = Image.build({
        filename: 'AlignedHiResStack_2_6_2011_00.tif',
        description: ''
    })
    newImage.save().on('success', function() {
        res.send("Test Saved OK", 200);
    }).on('failure', function(error){
        res.send("Failed to Save", 500);
    });

    // TODO setup the form
};

exports.showimages =  function(req, res) {
    // Render the images page
};
