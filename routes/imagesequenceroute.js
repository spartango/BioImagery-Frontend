var Sequelize = require('sequelize')

var db = new Sequelize('bioimagery', 'imagingfrontend', '4ront3nd')

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

exports.sequence = function (req, res) {
    // body...
    var seqId = req.params.id;

    if(seqId) {
        ImageSequence.find(Number(seqId)).on('success', function(seq) {
            if(seq) {
                var json = JSON.stringify(ImageSequence.dictify(seq));
                res.send(json, 200);
            } else {
                res.render('404', {title: '404 Bad Sequence'});
            }
        });
    } else {
        res.send('Bad Param', 400);
    }
     
}

exports.listsequences = function(req, res) {
    ImageSequence.findAll().on('success', function(imageseqs) {
        if(imageseqs) {
            // Generate an ID set
            var imageSeqSet = imageseqs.map(ImageSequence.dictify);
            // Send it along
            res.send(JSON.stringify(imageSeqSet), 200);
        } else {
            // Error condition
            // Send a 404 back
            res.render('404', {title: '404: Couldnt get Image Set'});
        }
    });
}

exports.createseq = function(req, res) {
    var rdelta       = req.body.delta;
    var imageIds     = req.body.images;
    var rdescription = req.body.description;

    if(rdelta && imageIds && imageIds.length > 0) {
        Image.findAll({ where: {id: imageIds} }).on('success', function(images){

            // Make a new Sequence
            var newSeq = ImageSequence.build({
                delta: rdelta, 
                description: rdescription, 
                count: imageIds.length
            });

            newSeq.save().success(function() {
                // Attach the target images
                newSeq.setImages(images).success(function() {
                    console.log('New Sequence '+newSeq.id);
                    res.send(''+newSeq.id, 200);
                });
            });
        });
    } else {
        res.send('Bad Param', 400);
    }
}