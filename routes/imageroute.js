/*
 * GET a raw image
 */

exports.image = function(req, res){
    // Get the image ID
    // TODO ask the DB for the filename
    // Get the raw file from the disk
    // Send it along
};

/*
 * GET a tile
 */

exports.gettile = function(req, res){
  // We need the image ID
  // Need the image offsets
  // Assert that the image offsets are safe
  // Floor the image offsets to the nearest bin
  // Generate the tilename
  // Get the tile from disk 
  // Send the tile along
};

/*
 * GET rois 
 */

exports.gettile = function(req, res){
  // We need the image ID
  // Ask the db for all ROIs on a given image
  // If no bounds are requested, then send ALL ROIs
  // Else, Get the bounding params
  // Filter the ROI-set for the bounds
};

