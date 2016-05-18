/**
 * ControllerController
 *
 * @description :: Server-side logic for managing Controllers
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {

	index: function(req, res) {
		return res.json(''/* lista delle conferences di cui sono chair*/);
	},

	create: function(req, res) {
		Conference.create({
			title: req.param("title"),
			acronym: req.param("acronym"),
			chairs: req.param("chairs"),
			papers: req.param("papers"),
		}).exec(function(err, conference) {
			if (err) {
				console.error(err);
				return res.json(err);
			}
			if (conference) return res.json(conference);
		})
	},

	update: function(req, res) {
		Conference.findOne({
			id: req.param("conference")
		}).exec(function(err, found) {
			if (err) {
					console.error(err);
					return res.json(err);
			}
			if (found) {
				Conference.update({
					status: req.param("status"),
					title: req.param("title"),
					acronym: req.param("acronym"),
					chairs: req.param("chairs"),
					papers: req.param("papers"),
				}).exec(function(err, conference) {
					if (err) {
						console.error(err);
						return res.json(err);
					}
					if (conference) return res.json(conference);
				})
			}
		})
	},

	destroy: function(req, res) {
		Conference.destroy({
			id: req.param("conference")
		}).exec(function(err) {
			if (err) {
				console.error(err);
				return res.json(err);
			} else {
				return res.json({
					message: "Conference deleted"
				})
			}
		})
	},
};
