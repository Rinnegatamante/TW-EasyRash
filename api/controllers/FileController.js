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
    console.log('enter in fileCreate')
    var u = AuthService.user()
    req.file('files').upload({
      maxBytes: 10000000
    }, function (err, files) {
      if (err) {
        return res.serverError(err)
      }
      console.log(files)
      File.create({
        title: paper.filename
      }).exec(function (err, createdFile) {
        if (err) { console.log(err) }

        createdFile.author.add(u.id)
        createdFile.title = 'abbbabba'
        console.log(createdFile)
        createdFile.save()

        console.log('upload ')
        return res.json({
          message: files.length + ' file(s) uploaded successfully!',
          attributes: createdFile.toObject(),
          files: files
        })
      })
    })
  }

}
