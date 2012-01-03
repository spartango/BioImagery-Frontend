// Models
var ViewedImage = function(name, width, height) {
    this.xOffset = 0;
    this.yOffset = 0;
    this.width   = width;
    this.height  = height;
    this.name    = name;
};

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

var tileSet = [];
var roiSet  = [];

// Model Updates

function updateImageInfo() {
    // Call for the image description

    // Populate the model
}

function updateRois() {
    // Call for the list of rois
    // Build models from this
}

function sendRoi() {
    
}

// View Controls

// Setup Viewport canvas
function initViewport() {

    window.viewportCanvas = document.getElementById('viewport');  

    // Check that these things work ok: 
    if(canvas && canvas.getContext) {
        window.viewportContext = canvas.getContext('2d');
        // Register Events
         
        // Setup the canvas with the right images

    } 
}

function refreshTiles() {
    
}

// Events

function onViewportMoved() {
    
}

function init() {   
    // Grab info for the target image
    // Populate the model

    // Init Viewport

}