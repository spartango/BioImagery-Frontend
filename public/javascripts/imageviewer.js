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

var Roi = function(x, y, width, height, confidence, id, parent) {
    this.x          = x;
    this.y          = y;
    this.height     = height;
    this.width      = width;
    this.id         = id;
    this.confidence = confidence;
    this.parent     = parent;
    this.saved      = false;

    this.render = function(context) {
        // Offset the coords by the parent offsets
        var xCoord = this.x - parent.xOffset;
        var yCoord = this.y - parent.yOffset;
        // Check that we should render
        if(xCoord + this.width >= 0 
            && yCoord + this.height >= 0
            && xCoord < context.canvas.width 
            && yCoord < context.canvas.height){
            // TODO Select a color
            context.strokeStyle = 'rgb('+0+',' + 255 + ',' + 0 + ')';

            // Draw a box at the coords
            context.strokeRect(xCoord, yCoord, this.width, this.height);

            // Draw the icon for handle
            
            // Draw the icon for delete
        }
    };

    this.save = function() {
        var request = new XMLHttpRequest();
        var target = this;

        request.open('POST', '/roi/create', true);
        request.onload = function() {
            target.id = request.responseText;
            target.saved = true;
            console.log('saved ROI '+target.id);
        };
        // TODO should really make this JSON.
        request.send('x='+this.x 
                     +'&y='+this.y
                     +'&width='+this.width
                     +'&height='+this.height
                     +'&id='+this.parent.id);
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
        // TODO selectively get Rois
        var request = new XMLHttpRequest();
        request.open('GET', '/image/'+this.id+'/getrois', false);
        request.send();
        var rois = eval('('+request.responseText+')'); // Dangerous. 
        if(rois) {
            // Build objects
            for(var i = 0; i<rois.length; i++) {
                var t_roi = rois[i];
                var newRoi = new Roi(t_roi.x, 
                                    t_roi.y, 
                                    t_roi.width, 
                                    t_roi.height, 
                                    t_roi.confidence, 
                                    t_roi.id,
                                    this);
                newRoi.saved = true;
                this.roiSet.push(newRoi);
            }
        }
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

function onViewportMoved(deltaX, deltaY) {
    targetImage.xOffset += deltaX;
    targetImage.yOffset += deltaY;
    if(deltaX != 0 || deltaY != 0) {
        // Adjust the offsets
        refreshTiles();
        // render the Viewport
        renderViewport(viewportContext);
    }
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

selectedRoi = null;

function keyMove(event) {
    if(event.keyCode == '65' && targetImage.xOffset >= KEY_INCREMENT) {
        // Left
        onViewportMoved(-KEY_INCREMENT, 0);
    } else if(event.keyCode == '87' && targetImage.yOffset >= KEY_INCREMENT) {
        // Up
        onViewportMoved(0, -KEY_INCREMENT);
    } else if(event.keyCode == '83' && targetImage.yOffset < targetImage.height - viewportCanvas.height) {
        // Down
        onViewportMoved(0, KEY_INCREMENT);
    } else if(event.keyCode == '68' && targetImage.xOffset < targetImage.width - viewportCanvas.width) {
        // Right
        onViewportMoved(KEY_INCREMENT, 0);
    }
}

function mouseDown(event) {
    // Check for buttons
    if(false){
        
    } else {
        // Starting a drag
        viewportDragging = true;
        dragStartX = event.pageX;
        dragStartY = event.pageY;
    }

    if(viewportMode == VIEWPORT_DRAW) {
        // TODO create a new ROI
        var newRoi = new Roi((event.pageX - viewportCanvas.offsetLeft) + targetImage.xOffset, 
                             (event.pageY - viewportCanvas.offsetTop)  + targetImage.yOffset, 
                             0, 0, 0, null, targetImage);
        targetImage.roiSet.push(newRoi);
        // Mark it selected
        selectedRoi = newRoi;
    } else if(viewportMode == VIEWPORT_PAN) {
        // TODO check for ROIs beneath
    }

}

function mouseUp (event) {
    viewportDragging = false;

    if(selectedRoi) {
        selectedRoi = null;
    }
}

function mouseMove(event) {
    if(viewportDragging) {
        var deltaX = event.pageX - dragStartX;
        var deltaY = event.pageY - dragStartY;

        if(viewportMode == VIEWPORT_PAN) {
            onViewportMoved(-deltaX, -deltaY);
        } else if(viewportMode == VIEWPORT_DRAW && selectedRoi) {
            selectedRoi.width += deltaX;
            selectedRoi.height += deltaY;
            redraw();
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
        viewportCanvas.addEventListener('mousedown', mouseDown);
        window.addEventListener('mousemove', mouseMove);
        window.addEventListener('mouseup', mouseUp);


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
    targetImage.getRois();
    console.log("TargetImage Ready")

    // Init Viewport
    initViewport();

    console.log("Viewport Ready");
}