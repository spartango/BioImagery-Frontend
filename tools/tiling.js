var imagick = require('imagemagick');

exports.TILE_WIDTH  = 256;
exports.TILE_LENGTH = 256;

exports.generateTileName = function(xOffset, yOffset, targetFile) {
    return xOffset +'_' +yOffset +'_' +targetFile;
};

//exports.convertToPng = TODO
//exports.cropToSize = TODO
//exports.generateThumbs = TODO
//exports.generatTiles = TODO
