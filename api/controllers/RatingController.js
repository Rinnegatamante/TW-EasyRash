/**
 * RatingController
 *
 * @description :: Server-side logic for managing Ratings
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
	create: function (req, res) {
		Paper.findOne({
			id: req.param("paper_id")
		}).exec(function(err, paper) {
			if (err) {
					console.error(err);
					return res.json(err);
			}
			if (paper) {
				Rating.create({
					score: req.param("score"),
					paper_id: req.param("paper_id"),
					author_id: req.param("author_id")
				}).exec(function(err, rating) {
					if (err) {
						console.error(err);
						return res.json(err);
					}
					if (rating) return res.json(rating)
				})
			}
		})
	},

	update: function(req, res) {
		Paper.findOne({
			id: req.param("paper_id"),
			author_id: req.param("author_id")
		}).exec(function(err, paper) {
			if (err) {
				console.error(err);
				return res.json(err);
			}
			if (paper) {
				Rating.update({
					paper_id: req.param("paper_id"),
					author_id: req.param("author_id")
				}).exec(function(err, rating) {
					if (err) {
						console.error(err);
						return res.json(err);
					}
					if (rating) return res.json(rating);
				})
			}
		})
	}
};
