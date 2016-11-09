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
    var u = AuthService.user()

    Paper.findOne({
      id: req.param('paper_id')
    }).populate('reviews').exec(function (err, paper) {
      if (err) return res.json(500, {error: err})
      if (!paper) return res.json(400, {message: 'Paper not found'})

      Review.create({
        text: req.param('text')
      }).exec(function (err, review) {
        if (err) return res.json(500, {error: err})
        if (!review) return res.json(400, {message: 'Review not found'})

        paper.reviews.add(review.id)
        user.reviews.add(review.id)

        user.save()
        paper.save((err) => {
          if (err) return res.json(500, {error: err})
          return res.json({
            message: '',
            review: review,
            paper: paper
          })
        })
      })
    })
  },

  update: function (req, res) {
    // POLICIES : [paperIsLock,isMine]
    Paper.findOne({
      id: req.param('paper_id'),
      token: req.param('token')
    }).exec(function (err, paper) {
      if (err) return res.json(500, {error: err})
      if (!paper) return res.json(400, {message: 'Paper not found'})

      Review.update({
        id: req.param('review_id')
      }, {
        text: req.param('text'),
        token: NULL
      }).exec(function (err, review) {
        if (err) return res.json(500, {error: err})
        if (!review) return res.json(400, {message: 'Review not found'})

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

    p.lock()

    p.save(() => {
      if (err) return res.json(500, {error: err})

      setTimeout(function () {
        p.free()
        p.save()
      }, 900000) // 15 min

      return res.json({
        message: 'paper still lock for 15 minutes',
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
      if (err) return res.json(500, {error: err})

      u.reviews.remove
      return res.json({
        message: 'Review deleated'
      })
    })
  }

    // Blueprint API
    // find: /review/find

}
