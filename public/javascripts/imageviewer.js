var Tile = function(x, y, parent) {
    this.x        = x;
    this.y        = y
    this.parent   = parent;
    this.image    = null;

    this.getImage = function() {
        // Generate the image name from the parent
        // Build & assign image
        var newImage = new Image();
        newImage.onload = function() {
            // Mark this image as ready
            this.image = newImage;
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
            drawImage(this.image, xOffset, yOffset);
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
            // TODO 
        // Populate this
            // TODO 
    };

    this.getRois = function() {
        // TODO
    };

    this.createRoi = function() {
        // TODO
    };

    this.renderTiles = function(context) {
        tileSet.map(function(tile) {
           tile.render(context); 
        });
    };

    this.renderRois = function(context) {
        roiSet.map(function(roi) {
           roi.render(context); 
        });
    };

    this.render = function(context) {
        // Render tiles
        this.renderTiles(context);
        // Render rois
        this.renderRois(context);
    };

};

// View Controls

function clearCanvas(context) {
    context.clearRect(0, 0, context.canvas.width, context.canvas.height); 
}

function refreshTiles() {
        // TODO 
    // Generate list of needed tiles
    // Scan over tiles
    // Check if tile is needed? 
    //    remove from needed list : else remove (<3 GC)
    // Get images for remaining needed tiles
    // Add any remaning needed tiles
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
    // render the Viewport
    renderViewport(viewportContext);
}

// Setup Viewport canvas
function initViewport() {

    window.viewportCanvas = document.getElementById('viewport');  

    // Check that these things work ok: 
    if(viewportCanvas && viewportCanvas.getContext) {
        window.viewportContext = canvas.getContext('2d');
        // Register Events
            // TODO 
        // Setup the canvas with the right images
        refreshTiles();
        renderViewport();
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