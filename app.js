
/**
 * Module dependencies.
 */

var express = require('express')
  , Sequelize = require('sequelize')
  , fs = require('fs')


// Application Config

var app = module.exports = express.createServer();

// Db Config

var db = new Sequelize('bioimagery', 'imagingfrontend', '4ront3nd')

// Configuration

app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.bodyParser());
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
var Image = db.import(__dirname + "/models/image");
var Roi   = db.import(__dirname + "/models/roi");
var Tag   = db.import(__dirname + "/models/tag");

// Relationships
Image.hasMany(Roi);
Roi.belongsTo(Image); 
Roi.hasMany(Tag);

// Db Setup 
db.sync({force: false}).on('success', function() {
    console.log('MySQL schema created');
}).on('failure', function() {
    console.log('MySQL schema cannot be created');
});

// Routes

var routes  = require(__dirname + '/routes')

app.get('/',                     routes.index);
app.get('/image/:id',            routes.image;        // Provides raw images
app.get('/image/:id/gettile',    routes.tile);        // Provides tiles
app.get('/image/:id/getrois',    routes.rois);        // Provides ROIs
app.post('/image/createimage',   routes.createimage); // Creates an Image
app.post('/tag/create',          routes.createtag);   // Creates a Tag
app.post('/tag',                 routes.tags);
app.post('/tag/:id',             routes.gettag);
app.post('/roi/create',          routes.createroi);   // Creates a ROI
app.post('/roi/:id/tagroi',      routes.tagroi);      // Tags an ROI

app.listen(8080);
console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
