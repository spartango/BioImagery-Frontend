var tiling   = require('../tools/tiling'),
        fs   = require('fs'),
        exec = require('child_process').exec;         

var imageDir = __dirname+'/../images/'
var rawImageDir = __dirname+'/../rawimages/'
var tileDir  = __dirname+'/../tiles/'
var thumbDir = __dirname+'/../thumbs/'

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
Tag.hasMany(Roi);

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
                            res.render('404', {title: '404 Image File Not Found'});
                        } else {
                            res.writeHead(200, {'Content-Type': 'image/png' });
                            res.end(data, 'binary');
                        }
                    }
                );
                // Send it along
            } else {
                // Error condition
                // Send a 404 back
                res.render('404', {title: '404 Image Record Not Found'});
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
                            res.writeHead(200, {'Content-Type': 'image/png' });
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
 * GET a thumbnail
 */

exports.thumb = function(req, res){
    // Get the image ID
    var imageId = req.params.id;
   // Assert that the image offsets are safe
    // Floor the image offsets to the nearest bin
    if(imageId) {
        Image.find(Number(imageId)).on('success', function(image) {
            if(image) {
                var thumbname = 'thumb_'+image.filename;

                // Get the tile from disk
                fs.readFile(thumbDir + thumbname,
                    function(err, data) {
                        if(err) {
                            // Error Condition
                            res.send('', 404);
                        } else {
                            res.writeHead(200, {'Content-Type': 'image/png' });
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
    var height  = req.param('height');

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
                        && height   != null) {
                        targets = rois.filter(function(roi) {
                            return roi.x >= xOffset
                                   && roi.y >= yOffset
                                   && roi.width < (xOffset + width)
                                   && roi.height < (yOffset + height);
                        });
                    } else {
                        // Send everything
                        targets = rois;
                    }
                    // JSONify targets
                    var json = JSON.stringify(targets.map(Roi.dictify));
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

exports.createimage = function(req, res) {
    var name         = (req.files.image ? req.files.image.name : null);
    var rDescription = req.body.description;
    
    var rheight      = Number(req.body.height);
    var rwidth       = Number(req.body.width);

    if(name && rheight != NaN && rwidth != NaN  && req.files.image) {
        // Write the file
        var tmpPath  = req.files.image.path;
        tiling.convertToPng(tmpPath, rawImageDir, function(pngImage) {
        
            tiling.cropToSize(pngImage, imageDir, function(croppedImages) {
                console.log("Cropped "+pngImage+" to "+croppedImages.length+" images");
                croppedImages.map(function(imageName) {
                    // Build the metadata
                    var newImage = Image.build({
                        filename:    imageName,
                        description: rDescription,
                        height:      rheight,
                        width:       rwidth
                    });
                    newImage.save();
                });

                // Spin up tile generator
                // Spin up thumb generator

                exec('./tools/generateTiles');
                exec('./tools/generateThumbs');

                /*croppedImages.map( function (imageName) {
                    tiling.generateThumbs(imageName, thumbDir, function() {
                        croppedImages.map(function (imageName) {
                            tiling.generateTiles(imageName, tileDir,  function() {});
                        });
                    });
                }); */
                

            });
        });

        res.render('upload', {title: 'Upload Image', previous: 'Successful Upload'});
    } else {
        res.render('upload', {title: 'Upload Image', previous: 'Upload was missing info'});
    }
};

exports.listimages = function(req, res) {
    Image.findAll().on('success', function(images) {
        if(images) {
            // Generate an ID set
            var imageSet = images.map(Image.dictify);
            // Send it along
            res.send(JSON.stringify(imageSet), 200);
        } else {
            // Error condition
            // Send a 404 back
            res.render('404', {title: '404: Couldnt get Image Set'});
        }
    });
};

exports.imageview = function(req, res) {
    var imageId = req.params.id;
    if(imageId) {
        Image.find(Number(imageId)).on('success', function(image) {
            if(image) {
                // Get the imagecount
                Image.count().on('success', function(count) {
                    res.render('image', {
                        title: 'Image',
                        imageId: imageId,
                        imageName: image.filename,
                        imageDescription: image.description,
                        imageCount: count
                    });
                });
            } else {
                // Error condition
                // Send a 404 back
                res.render('404', {title: '404: Image not Found'});
            }

        });
    } else {
        // param Error condition
        // Send a 400 back
        res.send('Bad Params', 400);
    }
};

exports.imageinfo = function(req, res) {
    // Get the image ID
    var imageId = req.params.id;

    if(imageId) {
        Image.find(Number(imageId)).on('success', function(image) {
            if(image) {
                // Get the raw file from the disk
                res.send(JSON.stringify(Image.dictify(image)), 200);
                // Send it along
            } else {
                // Error condition
                // Send a 404 back
                res.render('404', {title: '404: Image not Found'});
            }

        });
    } else {
        // param Error condition
        // Send a 400 back
        res.send('Bad Params', 400);
    }

};

exports.overview = function(req, res){
    // TODO implement pagination
    Image.findAll().on('success', function(images) {
            if(images) {
                // Generate an ID set
                var imageSet = images.map(function(image) {
                    return image.id;
                });
                res.render('overview', {title: 'Overview',
                                        images: imageSet });
                // Send it along
            } else {
                // Error condition
                // Send a 404 back
                res.render('404', {title: '404: Couldnt get Image Set'});
            }

    });
};

exports.newimage = function(req, res) {
    // Provides a form for uploading
    res.render('upload', {title: 'Upload Image'});
};
