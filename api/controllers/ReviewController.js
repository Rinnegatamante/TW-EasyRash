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

  find: function (req, res) {
    Review.findOne(req.param('rid')).populate('author').populate('paper').exec((err, review) => {
      if (err) {
        console.log(err)
      }
      return res.json({
        review: review
      })
    })
  },

  ofPaper: function (req, res) {
    Review.find({
      'paper': req.param('pid')
    }).populate('author').populate('paper').exec((err, reviews) => {
      if (err) {
        console.log(err)
      }
      return res.json({
        reviews: reviews
      })
    })
  },
  create: function (req, res) {
    if (!req.param('pid')) {
      return res.json(400, {
        message: 'Paper is not specified.'
      })
    }

    var u = AuthService.user()

    Paper.findOne({
      id: req.param('pid')
    }).populate('reviews').exec(function (err, paper) {
      if (err) {
        return res.json(500, {
          error: err
        })
      }
      if (!paper) {
        return res.json(400, {
          message: 'Paper not found'
        })
      }
      if (!req.param('rush')) {
        return res.json(400, {
          message: 'Paper not found'
        })
      }
      paper.reviewerAccept(req.param('status'))

      for (var i = 0; i < req.param('rew_id').length; i++) {
        Review.create({
          text: req.param('text')[i],
          type: req.param('type')[i],
          author: u.id,
          rew_id: req.param('rew_id')[i]
        }).exec(function (err, review) {
          if (err) {
            console.log(err)
            return res.json(400, {
              error: 'cannot create review'
            })
          }
          if (!review) {
            return res.json(400, {
              message: 'Review not found'
            })
          }
          console.log(req.param('status'))
          paper.reviews.add(review.id)

          if (review.rew_id == req.param('rew_id')[req.param('rew_id').length - 1]) {
            fs = require('fs')

            fs.stat(paper.url, (err, stats) => {
              if (err) {
                return res.json(400, {
                  message: 'Paper path not found'
                })
              }
              fs.writeFile(paper.url, req.param('rush'), (err) => {
                paper.free()
                u.save()
                paper.save((err) => {
                  if (err) {
                    return res.json(500, {
                      error: 'cannot save paper'
                    })
                  }
                  return res.json({
                    message: 'Committed successfull',
                    review: review,
                    reviewer: u,
                    paper: paper
                  })
                })
              })
            })
          }
        })
      }
    })
  },

  update: function (req, res) {
    // POLICIES : [paperIsLock,isMine]
    Paper.findOne({
      id: req.param('paper_id'),
      token: req.param('token')
    }).exec(function (err, paper) {
      if (err) {
        return res.json(500, {
          error: err
        })
      }
      if (!paper) {
        return res.json(400, {
          message: 'Paper not found'
        })
      }

      Review.update({
        id: req.param('review_id')
      }, {
        text: req.param('text'),
        token: NULL
      }).exec(function (err, review) {
        if (err) {
          return res.json(500, {
            error: err
          })
        }
        if (!review) {
          return res.json(400, {
            message: 'Review not found'
          })
        }

        return res.json({
          message: '',
          review: review,
          paper: paper
        })
      })
    })
  },

  lockPaper: function (req, res) {
    // POLICIES : [paperIsLock]
    var u = AuthService.user()
    var p = AuthService.paper()

    var token = p.lock()

    p.save((err) => {
      if (err) {
        return res.negotiate(err)
      }

      setTimeout(function () {
        p.free(token)
        p.save()
        console.log('free paper - id: ' + p.id)
      }, sails.config.globals.timeLock)

      return res.json({
        message: 'paper still lock for 5 minutes',
        paper: p,
        s_token: p.token
      })
    })
  },

  freePaper: function (req, res) {
    // POLICIES : [paperIsLock]
    var u = AuthService.user()
    var p = AuthService.paper()

    p.free(req.param('token'))

    p.save((err) => {
      if (err) {
        return res.negotiate(err)
      }
      return res.json({
        message: 'Paper has been unlocked',
        paper: p
      })
    })
  },

  destroy: function (req, res) {
    // POLICIES : [paperIsLock, isMine]
    var u = AuthService.user()

    u.reviews.remove(req.param('review_id'))
    p.reviews.remove(req.param('review_id'))

    Review.destroy({
      id: req.param('review_id')
    }).exec(function (err) {
      if (err) {
        return res.negotiate(err)
      }

      u.reviews.remove
      return res.json({
        message: 'Review deleated'
      })
    })
  }

  // Blueprint API
  // find: /review/find

}
