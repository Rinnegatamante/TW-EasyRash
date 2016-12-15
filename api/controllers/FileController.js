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

  upload: function (req, res) {
    console.log(req.allParams())
    var u = AuthService.user()
    req.file('file').upload({
      maxBytes: 10000000
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
  }

}
