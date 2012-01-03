// Blast anything out of the way
var canvas = null;
var ctx    = null;

function init() {
    canvas = document.getElementById('viewport');  

    // Check that these things work ok: 
    if(canvas && canvas.getContext) {
        ctx = canvas.getContext('2d'); 
        
    }    
}

