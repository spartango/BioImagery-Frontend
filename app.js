/**
 * Module dependencies.
 */

var express   = require('express'),
    Sequelize = require('sequelize')


// Application Config

var app = module.exports = express.createServer();

// Db Config

var db = new Sequelize('bioimagery', 'imagingfrontend', '4ront3nd')

// Configuration

app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.bodyParser({
    uploadDir: __dirname + '/rawimages',
    keepExtensions: true
  }));
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
});

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true })); 
});

app.configure('production', function(){
  app.use(express.errorHandler()); 
});

// Models
var Image         = db.import(__dirname +'/../models/image');
var Roi           = db.import(__dirname +'/../models/roi');
var Tag           = db.import(__dirname +'/../models/tag');
var ImageSequence = db.import(__dirname +'/../models/imagesequence');

// Relationships
Image.hasMany(Roi);
Image.belongsTo(ImageSequence);
ImageSequence.hasMany(Image);
Roi.belongsTo(Image);
Roi.hasMany(Tag);
Tag.hasMany(Roi);
Roi.belongsTo(Tag);

// Db Setup 
db.sync({force: false}).on('success', function() {
    console.log('MySQL schema created');
}).on('failure', function() {
    console.log('MySQL schema cannot be created');
});


// Routes

var imageroutes = require(__dirname + '/routes/imageroute');
var roiroutes   = require(__dirname + '/routes/roiroute');
var tagroutes   = require(__dirname + '/routes/tagroute');
var routes      = require(__dirname + '/routes/index');

console.log("Loaded Routes");

app.get('/',                   imageroutes.overview);    // Overview of images

// Image related routs
app.get('/image',              imageroutes.listimages);   // Give a listing of images
app.get('/image/new',          imageroutes.newimage);     // Provides an uploading interface
app.post('/image/create',      imageroutes.createimage);  // Creates an Image
app.get('/image/:id',          imageroutes.image);        // Provides raw images
app.get('/image/:id/describe', imageroutes.imageinfo);    // Provides info about the image
app.get('/image/:id/view',     imageroutes.imageview);    // Provides info about the image
app.get('/image/:id/tile',     imageroutes.tile);         // Provides tiles
app.get('/image/:id/rois',     imageroutes.rois);         // Provides ROIs
app.get('/image/:id/thumb',    imageroutes.thumb);        // Provides thumbnails
 
// Tag related routes 
app.post('/tag/create',        tagroutes.createtag);      // Creates a Tag
app.get('/tag',                tagroutes.tags);           // Lists all Tags
app.get('/tag/:id',            tagroutes.gettag);         // Gets a name for a particular Tag
 
// Roi Related routes 
app.post('/roi/create',        roiroutes.createroi);      // Creates an ROI
app.post('/roi/:id/update',    roiroutes.updateroi);      // Creates a ROI
app.get('/roi/:id/tags',       roiroutes.gettags);        // Get the tags associated with an ROI
app.post('/roi/:id/tag',       roiroutes.tagroi);         // Tags an ROI
app.get('/roi/:id',            roiroutes.roi);            // Gets info about a single ROI

// Sequence related routes
app.get('/imageseq',           sequenceroutes.listsequences); // Gets a listing of all sequences
app.get('/imageseq/:id',       sequenceroutes.sequence);  // Get info on a single sequence



app.listen(8080);
