/**
 * ReviewsController
 *
 * @description :: Server-side logic for managing review.
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {

  index: function (req, res) {
    return res.views('paper_up')
  },

  create: function (req, res) {
    Paper.findOne({
      id: req.param('paper_id')
    }).exec(function (err, paper) {
      if (err) {
        console.error(err)
        return res.json(err)
      }
      if (paper && !paper.isLocked(req.param('token'))) {
        Review.create({
          text: req.param('text'),
          paper_id: req.param('paper_id'),
          author_id: req.param('author_id')
        }).exec(function (err, s) {
          if (err) {
            console.error(err)
            return res.json(err)
          }
          if (s) return res.json(s)
        })
      } else {
        return res.json({
          message: 'Paper is Locked'
        })
      }
    })
  },

  update: function (req, res) {
    Paper.findOne({
      id: req.param('paper_id'),
      author_id: req.param('author_id'),
      token: req.param('token')
    }).exec(function (err, paper) {
      if (err) {
        console.error(err)
        return res.json(err)
      }
      if (paper && !paper.isLocked(req.param('token'))) {
        Review.update({
          paper_id: req.param('paper_id'),
          author_id: req.param('author_id')
        }, {
          text: req.param('text'),
          token: NULL
        }).exec(function (err, s) {
          if (err) {
            console.error(err)
            return res.json(err)
          }
          if (s) return res.json(s)
        })
      } else {
        return res.json({
          message: 'Paper is Locked'
        })
      }
    })
  },

  lock: function (req, res) {
    Paper.findOne({
      id: req.param('paper_id')
    }).exec(function (err, paper) {
      if (err) {
        console.error(err)
        return
      }
      if (paper) {
        paper.lock(req.param('token'), function (err, s) {
          if (err) {
            console.log(err)
            res.json(err)
          }
          if (s) {
            setTimeout(function () {
              paper.free(req.param('token'), function () {
                if (err) {
                  console.log(err)
                  res.json(err)
                }
                if (s) res.json(paper)
              })
            }, 900) // 15 min
            res.json(paper)
          }
        })
      } else {
        return res.json({
          message: 'Paper not exist'
        })
      }
    })
  },

  destroy: function (req, res) {
    User.findOne({
      author_id: req.param('author_id'),
      token: req.param('token')
    }).exec(function (err, user) {
      if (err) {
        console.error(err)
        return res.json(err)
      }
      if (user) {
        Review.destroy({
          id: req.param('paper_id'),
          author_id: req.param('author_id')
        }).exec(function (err) {
          if (err) {
            console.error(err)
            return
          } else {
            return res.json({
              message: 'Paper deleated'
            })
          }
        })
      }
    })
  }

    // Blueprint API
    // find: /review/find

}
