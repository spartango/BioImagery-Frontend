TILE_WIDTH  = 400;
TILE_LENGTH = 400;

var Tile = function(x, y, parent) {
    this.x        = x;
    this.y        = y
    this.parent   = parent;
    this.image    = null;

    this.getImage = function() {
        // Generate the image name from the parent
        // Build & assign image
        var newImage = new Image();
        var target = this;
        newImage.onload = function() {
            // Mark this image as ready
            target.image = newImage;
            console.log("Got Image "+target.parent.name);
        };
        newImage.src = '/image/'+this.parent.id+'/gettile?x='+this.x+'&y='+this.y;

    };

    this.render = function(context) { 
        // Check if we have the image
        if(this.image) {
            // Calculate where it ought to be in the canvas
            var xOffset = this.x - this.parent.xOffset;
            var yOffset = this.y - this.parent.yOffset;

            // Move it to position
            context.drawImage(this.image, xOffset, yOffset);
        } 
    }
};

var Roi = function() {
    // TODO 
};

// Models
var ViewedImage = function(id) {
    this.xOffset = 0;
    this.yOffset = 0;
    this.width   = 0;
    this.height  = 0;
    this.name    = '';
    this.id      = id;
    this.tileSet = [];
    this.roiSet  = [];

    this.getInfo = function() {
        // Get information from the name
        var request = new XMLHttpRequest();
        request.open('GET', '/image/'+this.id+'/describe', false);
        request.send();
        var imageInfo = eval('('+request.responseText+')'); // Dangerous. 
        if(imageInfo) {
            this.width = imageInfo.width;
            this.height = imageInfo.height;
            this.name = imageInfo.filename;
            console.log("Got info for "+this.name)
        }

    };

    this.getRois = function() {
        // TODO
    };

    this.createRoi = function() {
        // TODO
    };

    this.renderTiles = function(context) {
        this.tileSet.map(function(tile) {
           tile.render(context); 
        });
    };

    this.renderRois = function(context) {
        this.roiSet.map(function(roi) {
           roi.render(context); 
        });
    };

    this.render = function(context) {
        // Render tiles
        this.renderTiles(context);
        // Render rois
        this.renderRois(context);
    };

    this.tileAt = function(x, y) {
        for(var i = 0; i < this.tileSet.length; i++) {
            if(this.tileSet[i].x <= x && x < this.tileSet[i].x + TILE_WIDTH
               && this.tileSet[i].y <= y && y < this.tileSet[i].y + TILE_LENGTH) {
                return true;
            }
        }
        return false;
    };

};

// View Controls

function clearCanvas(context) {
    context.clearRect(0, 0, context.canvas.width, context.canvas.height); 
}

function refreshTiles() {
    // Generate list of needed tiles
    var newTileset = [];
    for(var i = 0; i < viewportCanvas.width; i += TILE_WIDTH) {
        for(var j = 0; j < viewportCanvas.height; j += TILE_LENGTH) {
            // Find tile
            var tileX = i + targetImage.xOffset;
            var tileY = j + targetImage.yOffset;
            var targetTile = targetImage.tileAt(tileX, tileY);
            if(!targetTile) {
                // If its not there
                // Create a new tile
                targetTile = new Tile(tileX, tileY, targetImage);
                targetTile.getImage();
            }
            // add it to the newTileset
            newTileset.push(targetTile);
        }
    }
    // Replace the old tileset with the new tileset
    targetImage.tileSet = newTileset;
}

function renderViewport(context) {
    // Clear the context
    clearCanvas(context);
    // Render the image
    targetImage.render(context);
}



function onViewportMoved() {
    // Adjust the offsets
        // TODO 
    refreshTiles();
    // render the Viewport
    renderViewport(viewportContext);
}

// Setup Viewport canvas
function initViewport() {

    window.viewportCanvas = document.getElementById('viewport');  

    // Check that these things work ok: 
    if(viewportCanvas && viewportCanvas.getContext) {
        window.viewportContext = viewportCanvas.getContext('2d');
        // Register Events
            // TODO 

        // Setup the canvas with the right images
        refreshTiles();
        renderViewport(viewportContext);
    } 
}

// Setup root

function init(imageName) {  
    window.targetImage = new ViewedImage(imageName);
    // Grab info for the target image
    targetImage.getInfo();

    console.log("TargetImage Ready")

    // Init Viewport
    initViewport();

    console.log("Viewport Ready");
}