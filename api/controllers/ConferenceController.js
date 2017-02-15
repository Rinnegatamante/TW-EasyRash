/**
 * ConferenceController
 *
 * @description :: Server-side logic for managing Conferences
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
module.exports = {

	// create: Creates a new conference in the database
  create: function (req, res) {
    Conference.create({
      title: req.param('title'),
      acronym: req.param('acronym')
    }).exec(function (err, conference) {
      if (err) { return res.json(500, {
        error: err
      }) }
      if (!conference) { return res.json(400, {
        message: 'Conference not created.'
      }) }

      conference.chairs.length = 0
      conference.chairs.add(AuthService.user().id)
      conference.save(function (err) {
        if (err) { return res.json(500, {
          error: err
        }) }
        return res.json({
          message: req.param('title') + ' conference has been created successfully!',
          conference: conference
        })
      })
    })
  },

	// searchConference: Searches for a conference in the database
  searchConference: function (req, res) {
    Conference.find({
      title: {
        'like': '%' + req.param('field') + '%'
      }
    }).exec(function (err, conferences) {
      if (err) { return res.json(500, {
        error: err
      }) }
      return res.json({
        conferences: conferences
      })
    })
  },

	// getData: Returns generic data of a conference
  getData: function (req, res) {
    Conference.findOne({
      id: req.param('id')
    }).populate('chairs').populate('reviewers').exec(function (err, conference) {
      if (err) { return res.json(500, {
        error: err
      }) }
      if (!conference) { return res.json(400, {
        message: 'Conference not found.'
      }) }
      return res.json({
        conference: conference
      })
    })
  },

	// setStatus: Changes current status of a conference
  setStatus: function (req, res) {
    Conference.findOne({
      id: req.param('id')
    }).exec(function (err, conference) {
      if (err) { return res.json(500, {
        error: err
      }) }
      if (!conference) { return res.json(400, {
        message: 'Conference not found.'
      }) }
      if (req.param('state') > 2 || req.param('state') < 0) { return res.json(400, {
        message: 'Invalid status value.'
      }) }
      conference.status = req.param('state')
      conference.save()
      return res.json({
        message: 'Conference status changed successfully!'
      })
    })
  },

	// getPapers: Returns papers of a given conference
  getPapers: function (req, res) {
    Paper.find({
      conference: req.param('id')
    }).populate('conference').populate('author').populate('reviewers').populate('owner').exec(function (err, papers) {
      if (err) return console.log(err)
      if (!papers) { return res.json(400, {
        message: 'The conference has no papers yet.'
      }) }
      return res.json({
        papers: papers
      })
    })
  },

	// addChair: Adds a chair to a conference
  addChair: function (req, res) {
    Conference.findOne({
      id: req.param('id')
    }).populate('chairs').exec(function (err, conference) {
      if (err) { return res.json(500, {
        error: err
      }) }
      if (!conference) { return res.json(400, {
        message: 'Conference not found.'
      }) }
      conference.chairs.add(req.param('add_id'))
      conference.save(function (err) {
        if (err) { return res.json(500, {
          error: err
        }) }
        Conference.findOne({
          id: req.param('id')
        }).populate('chairs').exec(function (err, conference) {
          if (err) { return res.json(500, {
            error: err
          }) }
          if (!conference) { return res.json(400, {
            message: 'Conference not found.'
          }) }
          return res.json({
            message: 'Chair added successfully!',
            conference: conference
          })
        })
      })
    })
  },

	// addReviewer: Adds a reviewer to a conference
  addReviewer: function (req, res) {
    Conference.findOne({
      id: req.param('id')
    }).populate('reviewers').exec(function (err, conference) {
      if (err) { return res.json(500, {
        error: err
      }) }
      if (!conference) { return res.json(400, {
        message: 'Conference not found.'
      }) }
      conference.reviewers.add(req.param('add_id'))
      conference.save(function (err) {
        if (err) { return res.json(500, {
          error: err
        }) }
        Conference.findOne({
          id: req.param('id')
        }).populate('reviewers').exec(function (err, conference) {
          if (err) { return res.json(500, {
            error: err
          }) }
          if (!conference) { return res.json(400, {
            message: 'Conference not found.'
          }) }
          return res.json({
            message: 'Reviewer added successfully!',
            conference: conference
          })
        })
      })
    })
  },

	// deleteReviewer: Removes a reviewer from a conference
  deleteReviewer: function (req, res) {
    Conference.findOne({
      id: req.param('id')
    }).populate('reviewers').exec(function (err, conference) {
      if (err) { return res.json(500, {
        error: err
      }) }
      if (!conference) { return res.json(400, {
        message: 'Conference not found.'
      }) }
      conference.reviewers.remove(req.param('delete_id'))
      conference.save(function (err) {
        if (err) { return res.json(500, {
          error: err
        }) }
        Conference.findOne({
          id: req.param('id')
        }).populate('reviewers').exec(function (err, conference) {
          if (err) { return res.json(500, {
            error: err
          }) }
          if (!conference) { return res.json(400, {
            message: 'Conference not found.'
          }) }
          return res.json({
            message: 'Reviewer removed successfully!',
            conference: conference
          })
        })
      })
    })
  },

	// deleteChair: Removes a chair from a conference
  deleteChair: function (req, res) {
    Conference.findOne({
      id: req.param('id')
    }).populate('chairs').exec(function (err, conference) {
      if (err) { return res.json(500, {
        error: err
      }) }
      if (!conference) { return res.json(400, {
        message: 'Conference not found.'
      }) }
      if (conference.chairs.length < 2) { return res.json(400, {
        message: 'At least a chair is required for each conference'
      }) }
      conference.chairs.remove(req.param('delete_id'))
      conference.save(function (err) {
        if (err) { return res.json(500, {
          error: err
        }) }
        Conference.findOne({
          id: req.param('id')
        }).populate('chairs').exec(function (err, conference) {
          if (err) { return res.json(500, {
            error: err
          }) }
          if (!conference) { return res.json(400, {
            message: 'Conference not found.'
          }) }
          return res.json({
            message: 'Chair removed successfully!',
            conference: conference
          })
        })
      })
    })
  },

	// addPaper: Adds a paper to a conference
  addPaper: function (req, res) {
    if (!req.param('pid')) { return res.json(400, {
      message: 'Paper field is empty.'
    }) }
    if (!req.param('cid')) { return res.json(400, {
      message: 'Conference field is empty.'
    }) }
    Paper.findOne(req.param('pid')).exec(function (err, paper) {
      if (err) { return res.json(500, {
        message: 'Paper not committed.'
      }) }
      return res.json({
        message: 'Paper committed successfully!',
        paper: paper
      })
    })
  }

}
