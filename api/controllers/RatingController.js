/**
 * RatingController
 *
 * @description :: Server-side logic for managing Ratings
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
module.exports = {

	// create: Creates a new rating to the database
  create: function (req, res) {
    if (!req.param('pid')) { return res.json(400, {
      message: 'Paper is not specified.'
    }) }

    var u = AuthService.user()

    Paper.findOne({
      id: req.param('paper_id')
    }).populate('ratings').exec(function (err, paper) {
      if (err) { return res.json(500, {
        error: err
      }) }
      if (!paper) { return res.json(400, {
        message: 'Paper not found'
      }) }

      Rating.create({
        score: req.param('score')
      }).exec(function (err, rating) {
        if (!rating) { return res.json(400, {
          message: 'Rating not found'
        }) }

        paper.ratings.add(rating.id)
        u.ratings.add(rating.id)
        u.save()
        paper.save(function (err) {
          if (err) { return res.json(500, {
            error: err
          }) }
          return res.json({
            message: '',
            rating: rating,
            paper: paper
          })
        })
      })
    })
  },

	// update: Updates a rating in the database
  update: function (req, res) {
    var u = AuthService.user()

    Paper.findOne({
      id: req.param('paper_id')
    }).populate('ratings').exec(function (err, paper) {
      if (err) { return res.json(500, {
        error: err
      }) }
      if (!paper) { return res.json(400, {
        message: 'Paper not found'
      }) }

      Rating.update({
        id: req.param('rating_id')
      }, {
        score: req.param('score')
      }).exec(function (err, rating) {
        if (err) { return res.json(500, {
          error: err
        }) }
        if (!rating) { return res.json(400, {
          message: 'Rating not found'
        }) }
        return res.json({
          message: '',
          rating: rating,
          paper: paper
        })
      })
    })
  }

}
