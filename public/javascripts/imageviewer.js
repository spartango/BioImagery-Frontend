var Tile = function(x, y, parent) {
    this.x        = x;
    this.y        = y
    this.parent   = parent;
    this.image    = null;

    this.getImage = function() {
        // Generate the image name from the parent

        // Build & assign image
    };
    this.render   = function(context) { 
        // Check if we have the image
        if(image) {
            // Calculate where it ought to be in the canvas

            // Move it to position

        } 
    }
};

var Roi = function() {
    // TODO 
};

// Models
var ViewedImage = function(name) {
    this.xOffset = 0;
    this.yOffset = 0;
    this.width   = 0;
    this.height  = 0;
    this.name    = name;
    this.tileSet = [];
    this.roiSet  = [];

    this.getInfo = function() {
        // Get information from the name

        // Populate this

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

function refreshTiles(context) {
    // Generate list of needed tiles
    // Scan over tiles
    // Check if tile is needed? 
    //    remove from needed list : else remove (<3 GC)
    // Get images for remaining needed tiles
    // Add any remaning needed tiles
}

function renderViewport(context) {
    // Clear the context

    // Render the image
    targetImage.render(context);
}



function onViewportMoved() {
    // Adjust the offsets

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
         
        // Setup the canvas with the right images

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