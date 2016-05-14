/**
 * PaperController
 *
 * @description :: Server-side logic for managing files
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
      _config: {
      actions: false,
      shortcuts: false,
      rest: false
    },

    index: function(req, res) {
        return res.views('paper_up');
    },

    upload: function(req, res) {
        req.file('paper').upload({
            maxBytes: 10000000
        }, function(err, files) {
            if (err) {
                return res.serverError(err);
            }
            var paper = files[0];
            Paper.findOrCreate({
                author_id: req.param('author_id'),
                conference_id: req.param('conference_id'),
                title: paper.filename,
            }, {
                title: paper.filename,
                author_id: req.param('author_id'),
                conference_id: req.param('conference_id'),
                status: req.param('status'),
            }).exec(function (error, createdOrFoundRecords) {
              if (error){console.log(error);}
                var extra_text = '';
                if (createdOrFoundRecords.rash_link) {
                    const fs = require('fs');
                    extra_text = 'and replaced ';
                    var old_link = createdOrFoundRecords.rash_link;
                    fs.exists(old_link, function(exists) {
                        if (exists) {
                            fs.unlink(old_link, function() {
                                console.log('replace file "' + old_link + '" with "' + paper.fd + '"');
                            });
                        }
                    });
                }
                console.log(createdOrFoundRecords.toJSON());
                createdOrFoundRecords.rash_link = paper.fd;
                createdOrFoundRecords.save(function(err, s) {
                    if (err)
                        console.log(err, s);
                });

                if (error)
                    console.log(error);

                console.log('upload ' + createdOrFoundRecords.title + ' with id: ' + createdOrFoundRecords.id + ' by author_id: ' +
                    createdOrFoundRecords.author_id + ', for conference_id: ' + createdOrFoundRecords.conference_id);
                return res.json({
                    message: files.length + ' file(s) uploaded ' + extra_text + 'successfully!',
                    attributes: createdOrFoundRecords.toObject(),
                    files: files,
                });
            });

        });
    }

};
