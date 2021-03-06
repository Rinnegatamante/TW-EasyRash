/**
 * PaperController
 *
 * @description :: Server-side logic for managing papers
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

const fs = require('fs')

module.exports = {

  _config: {
    actions: false,
    shortcuts: false,
    rest: false
  },

  // find: Searches for a paper on the database
  find: function (req, res) {
    Paper.findOne(req.param('pid')).populate('conference').populate('author').populate('owner')
      .populate('reviewers').populate('reviews').exec(function (err, paper) {
        if (err) {
          console.log(err)
        }
        return res.json({
          paper: paper
        })
      })
  },

  // accept: Sets a paper to accepted status
  accept: function (req, res) {
    Paper.findOne(req.param('pid')).exec(function (err, paper) {
      paper.status = 1
      fs = require('fs')

      fs.stat(paper.url, function (err, stats) {
        if (err) {
          return res.json(400, {
            message: 'Paper path not found.'
          })
        }
        fs.writeFile(paper.url, req.param('rash'), function (err) {
          paper.save(function (err) {
            if (err) {
              console.log(err)
            }
            return res.json({
              message: 'Paper status changed successfully!',
              paper: paper
            })
          })
        })
      })
    })
  },

  // reject: Sets a paper to rejected status
  reject: function (req, res) {
    Paper.findOne(req.param('pid')).exec(function (err, paper) {
      paper.status = 2
      fs = require('fs')

      fs.stat(paper.url, function (err, stats) {
        if (err) {
          return res.json(400, {
            message: 'Paper path not found.'
          })
        }
        fs.writeFile(paper.url, req.param('rash'), function (err) {
          paper.save(function (err) {
            if (err) {
              console.log(err)
            }
            return res.json({
              message: 'Paper status changed successfully!',
              paper: paper
            })
          })
        })
      })
    })
  },

  // delete: Removes a paper from the database
  delete: function (req, res) {
    Paper.findOne(req.param('pid')).exec(function (err, paper) {
      if (err) {
        return res.negotiate(err)
      }
      var path = paper.url
      Paper.destroy({
        id: req.param('pid')
      }).exec(function (err, paper) {
        if (err) {
          return res.negotiate(err)
        }

        fs.unlink(path, function (err) {
          if (err) throw err
        })
        return res.json({
          message: 'Paper deleted successfully!'
        })
      })
    })
  },

  // upload: Uploads a paper to the dataabase
  upload: function (req, res) {
    if (!req.param('cid')) {
      return res.json(400, {
        message: 'Conference field is empty.'
      })
    }
    var co_ids = req.param('co_ids') ? req.param('co_ids').split(',') : []
    var u = AuthService.user()
    co_ids.push(u.id)

    req.file('file').upload({
      maxBytes: 10000000,
      dirname: require('path').resolve(sails.config.appPath, 'assets/uploads/')
    }, function (err, files) {
      if (err) {
        return res.serverError(err)
      }
      if (files.length == 0) {
        return res.json(400, {
          message: 'File field is empty.'
        })
      }
      Paper.create({
        title: req.param('title'),
        mime: files[0].type,
        url: files[0].fd,
        r_accepted: 0,
        r_rejected: 0,
        status: 0,
        conference: req.param('cid'),
        author: co_ids
      }).exec(function (err, createdFile) {
        u.papers.add(createdFile.id)
        createdFile.save()

        u.save(function (err) {
          if (err) {
            console.log(err)
          }

          return res.json({
            message: 'File uploaded successfully!',
            attributes: createdFile.toObject(),
            paper: files[0]
          })
        })
      })
    })
  },

  // addAuthor: Adds an author to a paper
  addAuthor: function (req, res) {
    if (!req.param('aid')) {
      return res.json(400, {
        message: 'Author is not specified.'
      })
    }
    Paper.findOne(req.param('pid')).populate('author').exec(function (err, paper) {
      if (err) {
        return res.negotiate(err)
      }
      paper.author.add(req.param('aid'))
      paper.save(function (err) {
        if (err) {
          console.log(err)
        }

        return res.json({
          message: 'Author added successfully!',
          paper: paper
        })
      })
    })
  },

  // removeAuthor: Removes an author from a paper
  removeAuthor: function (req, res) {
    if (!req.param('aid')) {
      return res.json(400, {
        message: 'Author is not specified.'
      })
    }
    Paper.findOne(req.param('pid')).populate('author').exec(function (err, paper) {
      if (err) {
        return res.negotiate(err)
      }
      paper.author.remove(req.param('aid'))
      paper.save(function (err) {
        if (err) {
          console.log(err)
        }

        return res.json({
          message: 'Author removed successfully!',
          paper: paper
        })
      })
    })
  },

  // addReviewer: Adds a reviewer to a paper
  addReviewer: function (req, res) {
    if (!req.param('reid')) {
      return res.json(400, {
        message: 'Reviewer is not specified.'
      })
    }
    Paper.findOne(req.param('pid')).populate('reviewers').exec(function (err, paper) {
      if (err) {
        return res.negotiate(err)
      }
      paper.reviewers.add(req.param('reid'))
      paper.save(function (err) {
        if (err) {
          console.log(err)
        }

        return res.json({
          message: 'Reviewer assigned successfully!',
          paper: paper
        })
      })
    })
  },

  // removeReviewer: Removes a reviewer from a paper
  removeReviewer: function (req, res) {
    if (!req.param('reid')) {
      return res.json(400, {
        message: 'Reviewer is not specified.'
      })
    }
    Paper.findOne(req.param('pid')).populate('reviewers').exec(function (err, paper) {
      if (err) {
        return res.negotiate(err)
      }
      paper.reviewers.remove(req.param('reid'))
      paper.save(function (err) {
        if (err) {
          console.log(err)
        }

        return res.json({
          message: 'Reviewer removed successfully!',
          paper: paper
        })
      })
    })
  },

  isaReviewer: function (req, res) {
    // POLICIES : [ 'sessionAuth', 'isReviewerPaper' ],
    var u = AuthService.user()
    return res.json({
      response: 1
    })
  },

  getEPUB: function (req, res) {
    Paper.findOne(req.param('pid')).populate('author').populate('conference').exec(function (err, paper) {
      if (err) {
        return res.negotiate(err)
      }
      var path = paper.url
      var new_path = require('path').resolve(sails.config.appPath, 'assets/epub') + '/' + paper.title + '.epub.zip'
      var new_rel_path = new_path.replace(sails.config.appPath + '/assets', '')
      var author = []
      for (i in paper.author) {
        author.push(paper.author[i].name)
      }

      fs.readFile(path, function (err, data) {
        if (err) {
          return console.log(err)
        }
        var Epub = require('epub-gen')

        new Epub({ // create epub
          title: paper.title,
          author: author,
          publisher: paper.conference.title,
          content: [{
            data: data.toString() // pass html string
          }]
        }, new_path).promise.then(function () {
          setTimeout(function () { return res.json({
            path: new_rel_path
          }) }, 2000)
        }, function (err) {
          return res.json(400, {
            message: 'Sorry, we cannot generate a epub'
          })
        })
      })
    })
  }

}
