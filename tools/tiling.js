exports.TILE_WIDTH  = 1024;
exports.TILE_LENGTH = 1024;

exports.generateTileName = function (xOffset, yOffset, targetFile) {
    return xOffset +'_' +yOffset +'_' +targetFile;
};