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
            console.log("Got Tile for "+target.x +" "+target.y);
            redraw();
        };
        newImage.src = '/image/'+this.parent.id+'/gettile?x='+this.x+'&y='+this.y;

    };

    this.render = function(context) { 
        // Check if we have the image
        if(this.image) {
            // Calculate where it ought to be in the canvas
            var xOffset = this.x - this.parent.xOffset;
            var yOffset = this.y - this.parent.yOffset;
            //console.log("Rendering tile @ "+xOffset+", "+yOffset);
            // Move it to position
            context.drawImage(this.image, xOffset, yOffset);
        } 
    }
};

var Roi = function(x, y, height, width, confidence, id, parent) {
    this.x          = x;
    this.y          = y;
    this.height     = height;
    this.width      = width;
    this.id         = id;
    this.confidence = confidence;
    this.parent     = parent;

    this.render = function(context) {
        // Offset the coords by the parent offsets
        // Move the context
        // Draw a box at the coords
    }

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
                return this.tileSet[i];
            }
        }
        return null;
    };

};

// View Controls

function clearCanvas(context) {
    context.clearRect(0, 0, context.canvas.width, context.canvas.height); 
}

function refreshTiles() {
    // Generate list of needed tiles
    var newTileset = [];
    for(var i = 0; i <= viewportCanvas.width; i += TILE_WIDTH/2) {
        for(var j = 0; j <= viewportCanvas.height; j += TILE_LENGTH/2) {
            // Find tile
            var tileX = i + targetImage.xOffset;
            var tileY = j + targetImage.yOffset;
            if(tileX >= 0 && tileY >= 0){
                var targetTile = targetImage.tileAt(tileX, tileY);
                if(!targetTile) {
                    // If its not there
                    // Create a new tile
                    var floorTileX = Math.floor(tileX / TILE_WIDTH) * TILE_WIDTH;
                    var floorTileY = Math.floor(tileY / TILE_LENGTH) * TILE_LENGTH;
                    targetTile = new Tile(floorTileX, floorTileY, targetImage);
                    targetTile.getImage();
                }
                // add it to the newTileset
                newTileset.push(targetTile);
            }
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

// Dirty global function
function redraw() {
    renderViewport(viewportContext);
}

function onViewportMoved() {
    // Adjust the offsets
        // TODO 
    refreshTiles();
    // render the Viewport
    renderViewport(viewportContext);
}

// Event Handlers

KEY_INCREMENT = 200;

// Modes
VIEWPORT_PAN = 0;

VIEWPORT_DRAW = 1;
viewportDragging = false;
viewportMode = VIEWPORT_PAN;
dragStartX = 0;
dragStartY = 0;

function keyMove(event) {
    if(event.keyCode == '65' && targetImage.xOffset >= KEY_INCREMENT) {
        // Left
        targetImage.xOffset -= KEY_INCREMENT;
    } else if(event.keyCode == '87' && targetImage.yOffset >= KEY_INCREMENT) {
        // Up
        targetImage.yOffset -= KEY_INCREMENT;
    } else if(event.keyCode == '83' && targetImage.yOffset < targetImage.height - viewportCanvas.height) {
        // Down
        targetImage.yOffset += KEY_INCREMENT;
    } else if(event.keyCode == '68' && targetImage.xOffset < targetImage.width - viewportCanvas.width) {
        // Right
        targetImage.xOffset += KEY_INCREMENT;
    }
    onViewportMoved()
}



function mouseMove(event) {
    if(viewportDragging) {
        var deltaX = event.pageX - dragStartX;
        var deltaY = event.pageY - dragStartY;

        if(viewportMode == VIEWPORT_PAN) {
            targetImage.xOffset -= deltaX;
            targetImage.yOffset -= deltaY;

            onViewportMoved();
        } else if(viewportMode == VIEWPORT_DRAW) {
            // TODO create a new ROI
        }

        dragStartX = event.pageX;
        dragStartY = event.pageY;

    }
}


// Setup Viewport canvas
function initViewport() {

    window.viewportCanvas = document.getElementById('viewport');  

    // Check that these things work ok: 
    if(viewportCanvas && viewportCanvas.getContext) {
        window.viewportContext = viewportCanvas.getContext('2d');
        // Register Events
        window.addEventListener('keydown', keyMove);
        
        viewportCanvas.addEventListener('mousedown', function(event) {
            viewportDragging = true;
            dragStartX = event.pageX;
            dragStartY = event.pageY;
        });

        window.addEventListener('mousemove', mouseMove);

        window.addEventListener('mouseup', function() {
            viewportDragging = false; 
        });


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