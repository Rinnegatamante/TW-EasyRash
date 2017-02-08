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
    Paper.findOne(req.param('pid')).populate('conference').populate('author').populate('owner').exec((err, paper) => {
      if (err) { console.log(err) }
      return res.json({
        paper: paper
      })
    })
  },

  pending: function (req, res) {
    Paper.findOne(req.param('pid')).exec((err, paper) => {
      paper.status = 0
      paper.save((err) => {
        if (err) { console.log(err) }
      })
      return res.json({
        message: 'Saved',
        paper: paper
      })
    })
  },

  accept: function (req, res) {
    Paper.findOne(req.param('pid')).exec((err, paper) => {
      paper.status = 1
      paper.save((err) => {
        if (err) { console.log(err) }
      })
      return res.json({
        message: 'Saved',
        paper: paper
      })
    })
  },

  reject: function (req, res) {
    Paper.findOne(req.param('pid')).exec((err, paper) => {
      paper.status = 2
      paper.save((err) => {
        if (err) { console.log(err) }
      })
      return res.json({
        message: 'Saved ',
        paper: paper
      })
    })
  },

  delete: function (req, res) {
    Paper.findOne(req.param('pid')).exec((err, paper) => {
      if (err) { return res.negotiate(err) }
      var path = paper.url
      Paper.destroy({id: req.param('pid')}).exec((err, paper) => {
        if (err) { return res.negotiate(err) }
        const fs = require('fs')

        fs.unlink(path, (err) => {
          if (err) throw err
        })
        return res.json({
          message: 'Paper deleted successfully'
        })
      })
    })
  },

  upload: function (req, res) {
    console.log(req.allParams())
    if (!req.param('cid')) return res.json(400, {message: 'Conference field is empty.'})
    var co_ids = req.param('co_ids') ? req.param('co_ids').split(',') : []
    console.log(co_ids)
    var u = AuthService.user()
    co_ids.push(u.id)

    req.file('file').upload({
      maxBytes: 10000000,
      dirname: require('path').resolve(sails.config.appPath, 'assets/uploads/')
    }, function (err, files) {
      if (err) {
        return res.serverError(err)
      }
      if (files.length == 0) return res.json(400, {message: 'File field is empty.'})
      console.log('FILES', files)
      for (var i = 0; files[i]; i++) {
        Paper.create({
          title: files[i].filename,
          mime: files[i].type,
          url: files[i].fd,
          conference: req.param('cid'),
          author: co_ids
        }).exec(function (err, createdFile) {
          if (err) { console.log(err) }

          u.papers.add(createdFile.id)

          console.log(createdFile)
          createdFile.save()

          if (!files[i + 1]) {
            u.save(function (err) {
              if (err) { console.log(err) }

              return res.json({
                message: files.length + ' file(s) uploaded successfully!',
                attributes: createdFile.toObject(),
                paper: files
              })
            })
          }
        })
      }
    })
  },

  addAuthor: function (req, res) {
    if (!req.param('aid')) return res.json(400, {message: 'Author is not specified.'})
    Paper.findOne(req.param('pid')).populate('author').exec((err, paper) => {
      if (err) { return res.negotiate(err) }
      paper.author.add(req.param('aid'))
      paper.save(function (err) {
        if (err) { console.log(err) }

        return res.json({
          message: 'Author added successfully!',
          paper: paper
        })
      })
    })
  },
  removeAuthor: function (req, res) {
    if (!req.param('aid')) return res.json(400, {message: 'Author is not specified.'})
    Paper.findOne(req.param('pid')).populate('author').exec((err, paper) => {
      if (err) { return res.negotiate(err) }
      paper.author.remove(req.param('aid'))
      paper.save(function (err) {
        if (err) { console.log(err) }

        return res.json({
          message: 'Author removed successfully!',
          paper: paper
        })
      })
    })
  },

  addReviewer: function (req, res) {
    if (!req.param('reid')) return res.json(400, {message: 'Reviewer is not specified.'})
    Paper.findOne(req.param('pid')).populate('reviewers').exec((err, paper) => {
      if (err) { return res.negotiate(err) }
      paper.reviewers.add(req.param('reid'))
      paper.save(function (err) {
        if (err) { console.log(err) }

        return res.json({
          message: 'Reviewer assigned successfully!',
          paper: paper
        })
      })
    })
  },
  removeReviewer: function (req, res) {
    if (!req.param('reid')) return res.json(400, {message: 'Reviewer is not specified.'})
    Paper.findOne(req.param('pid')).populate('reviewers').exec((err, paper) => {
      if (err) { return res.negotiate(err) }
      paper.reviewers.remove(req.param('reid'))
      paper.save(function (err) {
        if (err) { console.log(err) }

        return res.json({
          message: 'Reviewer removed successfully!',
          paper: paper
        })
      })
    })
  }

}
