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

  index: function (req, res) {
    return res.views('paper_up')
  },

  find: function (req, res) {
    File.findOne(req.param('fid')).exec((err, file) => {
      if (err) { console.log(err) }
      return res.json({
        file: file
      })
    })
  },

  upload: function (req, res) {
    console.log(req.allParams())
    var u = AuthService.user()
    req.file('file').upload({
      maxBytes: 10000000,
      dirname: require('path').resolve(sails.config.appPath, 'assets/uploads/')
    }, function (err, files) {
      if (err) {
        return res.serverError(err)
      }
      console.log('FILES', files)
      for (var i = 0; files[i]; i++) {
        File.create({
          title: files[i].filename,
          mime: files[i].type,
          url: files[i].fd
        }).exec(function (err, createdFile) {
          if (err) { console.log(err) }
          u.files.add(createdFile.id)
          u.co_files.add(createdFile.id)

          console.log(createdFile)
          createdFile.save()

          if (!files[i + 1]) {
            u.save(function (err) {
              if (err) { console.log(err) }

              return res.json({
                message: files.length + ' file(s) uploaded successfully!',
                attributes: createdFile.toObject(),
                files: files
              })
            })
          }
        })
      }
    })
  },

  delete: function (req, res) {
    File.findOne(req.param('fid')).populate('papers').exec((err, file) => {
      if (err) { return res.negotiate(err) }
      if (file.papers.length > 0) {
        return res.json(400, {
          message: 'You cannot delete this file, it has another ' + file.papers.length + ' paper(s) associated',
          files: files
        })
      }
      var path = file.url
      File.destroy({id: req.param('fid')}).exec((err, file) => {
        const fs = require('fs')

        fs.unlink(path, (err) => {
          if (err) throw err
        })
        return res.json({
          message: 'Deleted successfully'
        })
      })
    })
  }

}
