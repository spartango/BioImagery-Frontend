exports.TILE_WIDTH  = 400;
exports.TILE_LENGTH = 400;

exports.generateTileName = function (xOffset, yOffset, targetFile) {
    return xOffset +'_' +yOffset +'_' +targetFile;
};