var imagick = require('imagemagick');
var      fs = require('fs');

exports.IMAGE_WIDTH  = 1024;
exports.IMAGE_HEIGHT = 1024;

exports.TILE_WIDTH  = 256;
exports.TILE_LENGTH = 256;

exports.generateTileName = function(xOffset, yOffset, targetFile) {
    return xOffset +'_' +yOffset +'_' +targetFile;
};

exports.convertToPng = function (rawPath, targetDir) {
    var parts      = rawPath.split("/");
    var targetFile = parts[parts.length-1].replace(".", "")+".png";
    imagick.convert([rawPath, targetDir+targetFile]);
    fs.unlink(rawPath);
    return targetFile;
};

function diceImage(imagePath, targetDir, targetWidth, targetHeight) {
    // Identify the image
    imagick.identify(imagePath, function(err, features) {
        var width  = features.width;
        var height = features.height;
        // Raster across image
        for(var xOffset = 0; xOffset < width - targetWidth; xOffset += targetWidth) {
            for (var yOffset = yOffset < height - targetHeight; yOffset += targetHeight) {
                var parts      = rawPath.split("/");
                var targetFile = xOffset+"_"+yOffset+"_"+parts[parts.length-1];

                imagick.crop({ srcPath: imagePath, 
                               dstPath: targetFile,
                               width:   targetWidth, 
                               height:  targetHeight,
                               quality: 1
                            }, 
                            function(err, stdout, stderr) {});
            }
        }

    });
}

exports.cropToSize = function (imagePath, targetDir) {
};

exports.generateThumbs = function(imagePath, targetDir) {

};

exports.generateTiles = function(imagePath, targetDir) {
    diceImage(imagePath, targetDir, TILE_WIDTH, TILE_HEIGHT);
};
