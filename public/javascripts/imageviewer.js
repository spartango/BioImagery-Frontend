TILE_WIDTH  = 400;
TILE_LENGTH = 400;

// Icon prep
ICON_WIDTH  = 22;
ICON_HEIGHT = 22;

var removeIcon = new Image();
removeIcon.src = '/images/icons/remove.png'
var handleIcon = new Image();
handleIcon.src = '/images/icons/handle.png'
var selectedHandleIcon = new Image();
selectedHandleIcon.src = '/images/icons/ghandle.png'
var saveIcon = new Image();
saveIcon.src = '/images/icons/check.png'

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
        newImage.src = '/image/'+this.parent.id+'/tile?x='+this.x+'&y='+this.y;

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
    // Object properties
    this.x          = x;
    this.y          = y;
    this.height     = height;
    this.width      = width;
    this.id         = id;
    this.confidence = confidence;
    this.parent     = parent;

    this.saved      = false;
    this.highlight  = false;
    this.resizing   = false;

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
            context.drawImage((this.highlight? selectedHandleIcon :
                                        (!this.saved ? saveIcon : handleIcon)),
                                xCoord - ICON_WIDTH / 2, 
                                yCoord - ICON_HEIGHT / 2, 
                                ICON_WIDTH, ICON_HEIGHT);

            if(this.resizing)
                context.drawImage(selectedHandleIcon,
                                    xCoord - ICON_WIDTH / 2 + this.width, 
                                    yCoord - ICON_HEIGHT / 2 + this.height, 
                                    ICON_WIDTH, ICON_HEIGHT);
            

            if(!this.id) {
                // Draw the icon for delete
                context.drawImage(removeIcon, 
                                      xCoord - ICON_WIDTH / 2 + this.width, 
                                      yCoord - ICON_HEIGHT / 2, 
                                      ICON_WIDTH, ICON_HEIGHT);
            }
        }
    };

    this.save = function() {
        var request = new XMLHttpRequest();

        var target = this;
        if(this.id){
            // Updating an existing ROI
            var params = 'x='+this.x 
                         +'&y='+this.y
                         +'&width='+this.width
                         +'&height='+this.height;

            request.open('POST', '/roi/'+this.id+'/update', true);
            request.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
            
            request.onload = function() {
                target.saved = true;
                console.log('updated ROI '+target.id);
                redraw();
            };

            request.send(params);
        } else {
            // Creating a new ROI
            var params = 'x='+this.x 
                         +'&y='+this.y
                         +'&width='+this.width
                         +'&height='+this.height
                         +'&id='+this.parent.id;

            request.open('POST', '/roi/create', true);
            request.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
            
            request.onload = function() {
                target.id = request.responseText;
                target.saved = true;
                console.log('saved ROI '+target.id);
                redraw();
            };

            request.send(params);
        }
    };

    // View Event handling
    this.onSelect = function(xpos, ypos) {
        // Check for left corner
        // if unsaved, save
        if(!this.saved 
           && xpos >= -ICON_WIDTH / 2 
           && xpos <= ICON_WIDTH / 2 
           && ypos >= -ICON_HEIGHT / 2 
           && ypos <= ICON_HEIGHT / 2) {
            this.save();
            return false;
        }

        // Check for upper right corner
        else if(!this.id 
           && xpos >= this.width - ICON_WIDTH / 2 
           && xpos <= this.width + ICON_WIDTH / 2 
           && ypos >= -ICON_HEIGHT / 2 
           && ypos <= ICON_HEIGHT / 2) {

            console.log("Deleting "+this);
            this.parent.roiSet.splice(this.parent.roiSet.indexOf(this), 1);
            return false;
        } 
        // Lower right corner
        else if(xpos >= this.width - ICON_WIDTH  
           && xpos <= this.width + ICON_WIDTH 
           && ypos >= this.height - ICON_HEIGHT 
           && ypos <= this.height + ICON_HEIGHT) {

            // resizing mode
            this.resizing = true;
            return true;
        } else {
            this.resizing = false;
            return (xpos >= -ICON_WIDTH
                  && xpos <= ICON_WIDTH
                  && ypos >= -ICON_HEIGHT 
                  && ypos <= ICON_HEIGHT); 
        }
        
    };

    this.onDrag = function(deltaX, deltaY) {
        // If this is a resize, resize

        // If this is a move, mod coords
        if(!this.resizing) {
            this.x += deltaX;
            this.y += deltaY;
        } else {
            this.width += deltaX;
            this.height += deltaY;
        }
        this.saved = false;
    };

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
        request.open('GET', '/image/'+this.id+'/rois', false);
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

    this.roiAt = function (xpos, ypos) {
        for(var i = 0; i < this.roiSet.length; i++) {
            var t_roi = this.roiSet[i];
            if(xpos >= t_roi.x - ICON_WIDTH - this.xOffset
               && xpos < t_roi.x + ICON_WIDTH + t_roi.width - this.xOffset
               && ypos >= t_roi.y - ICON_HEIGHT - this.yOffset
               && ypos < t_roi.y + ICON_HEIGHT + t_roi.height - this.yOffset) {
                   return t_roi;
               }
        }
        return null;
    }

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

// Event Utils
function getRelativeX(event) {
    return (event.pageX - viewportCanvas.offsetLeft);
}

function getRelativeY(event) {
    return (event.pageY - viewportCanvas.offsetTop);
}

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
    if(viewportMode == VIEWPORT_DRAW) {
        var newRoi = new Roi(getRelativeX(event) + targetImage.xOffset, 
                             getRelativeY(event) + targetImage.yOffset, 
                             0, 0, 0, null, targetImage);
        targetImage.roiSet.push(newRoi);
        // Mark it selected
        selectedRoi = newRoi;
        selectedRoi.highlight = true;
        selectedRoi.resizing = true;
        
        // Starting a drag
        viewportDragging = true;
        dragStartX = event.pageX;
        dragStartY = event.pageY;
        document.body.style.cursor = 'crosshair';
    } else if(viewportMode == VIEWPORT_PAN) {
        selectedRoi = targetImage.roiAt(getRelativeX(event), 
                                        getRelativeY(event));
        viewportDragging = true;
        if(selectedRoi){
            selectedRoi.highlight = true;
            // dispatch event with coords relative to it
            viewportDragging = selectedRoi.onSelect(getRelativeX(event) - (selectedRoi.x - targetImage.xOffset),
                                 getRelativeY(event) - (selectedRoi.y - targetImage.yOffset));
            redraw();
        } 
        if(viewportDragging) {
            dragStartX = event.pageX;
            dragStartY = event.pageY;
            document.body.style.cursor = 'all-scroll';
        }
    }
    
    // Don't do the stupid select thing in the canvas
    event.preventDefault();
}

function mouseUp (event) {
    viewportDragging = false;

    if(selectedRoi) {
        selectedRoi.resizing  = false;
        selectedRoi.highlight = false;
        selectedRoi           = null;
        redraw();
    }

    viewportMode = VIEWPORT_PAN;
    document.body.style.cursor = 'default';
}

function mouseMove(event) {
    if(viewportDragging) {
        var deltaX = event.pageX - dragStartX;
        var deltaY = event.pageY - dragStartY;
        if(selectedRoi) {
            selectedRoi.onDrag(deltaX, deltaY);
        } else {
            onViewportMoved(-deltaX, -deltaY);
        }

        dragStartX = event.pageX;
        dragStartY = event.pageY;            
        redraw();
    }
    event.preventDefault();
}

function penDown() {
    viewportMode = VIEWPORT_DRAW;
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