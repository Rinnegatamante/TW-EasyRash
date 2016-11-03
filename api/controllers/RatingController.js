/**
 * RatingController
 *
 * @description :: Server-side logic for managing Ratings
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
  create: function (req, res) {
    var u = AuthService.user()

    Paper.findOne({
      id: req.param('paper_id')
    }).populate('ratings').exec(function (err, paper) {
      if (err) return res.json(500, {error: err})
      if (!paper) return res.json(400, {message: 'Paper not found'})

      Rating.create({
        score: req.param('score')
      }).exec(function (err, rating) {
        if (!rating) return res.json(400, {message: 'Rating not found'})

        paper.ratings.add(rating.id)
        u.ratings.add(rating.id)
        u.save()
        paper.save((err) => {
          if (err) return res.json(500, {error: err})
          return res.json({
            message: '',
            rating: rating,
            paper: paper
          })
        })
      })
    })
  },

  update: function (req, res) {
    var u = AuthService.user()

    Paper.findOne({
      id: req.param('paper_id')
    }).populate('ratings').exec(function (err, paper) {
      if (err) return res.json(500, {error: err})
      if (!paper) return res.json(400, {message: 'Paper not found'})

      // if not work delete populate
      console.log(paper.ratings)

      Rating.update({
        id: req.param('rating_id')
      }, {
        score: req.param('score')
      }).exec(function (err, rating) {
        if (err) return res.json(500, {error: err})
        if (!rating) return res.json(400, {message: 'Rating not found'})
        return res.json({
          message: '',
          rating: rating,
          paper: paper
        })
      })
    })
  }
}
