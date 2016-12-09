/**
 * ControllerController
 *
 * @description :: Server-side logic for managing Controllers
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {

  create: function (req, res) {
    Conference.create({
      title: req.param('title'),
      acronym: req.param('acronym')
    }).exec(function (err, conference) {
      if (err) return res.json(500, {error: err})
      if (!conference) return res.json(400, {message: 'Conference not create'})

	  conference.chairs.add(AuthService.user().id)
      conference.save((err) => {
        if (err) return res.json(500, {error: err})
        return res.json({
          message: req.param('title') + ' conference has been created successfully!',
          conference: conference
        })
      })
    })
  },

  searchConference: function (req, res) {
    Conference.find({
	  title: { 'like': '%' + req.param('field') + '%'}
    }).exec(function (err, conferences) {
      if (err) return res.json(500, {error: err})
      return res.json({conferences: conferences})
    })
  },

  getData: function (req, res) {
    Conference.findOne({
	  id: req.param('id')
    }).populate('chairs').exec(function (err, conference) {
	  if (err) return res.json(500, {error: err})
	  if (!conference) return res.json(400, {message: 'Conference not found.'})
	  return res.json({conference: conference})
    })
  },

  setStatus: function (req, res) {
    Conference.findOne({
	  id: req.param('id')
    }).exec(function (err, conference) {
	  if (err) return res.json(500, {error: err})
	  if (!conference) return res.json(400, {message: 'Conference not found.'})
	  if (req.param('state') > 2 || req.param('state') < 0) return res.json(400, {message: 'Invalid status value.'})
	  conference.status = req.param('state')
	  conference.save()
	  return res.json({message: 'Conference status changed successfully!'})
    })
  },

  getPendingPapers: function (req, res) {
    Conference.findOne({
	  id: req.param('id')
    }).populate('submission').exec(function (err, conference) {
	  if (err) return res.json(500, {error: err})
	  if (!conference) return res.json(400, {message: 'Conference not found.'})
	  var papers = []
	  conference.submission.forEach(function eq (el) {
    if (el.status === 0 || el.status === 3) papers.add(el)
	  })
	  return res.json({papers: papers, length: papers.length})
    })
  },

  addChair: function (req, res) {
    Conference.findOne({
      id: req.param('id')
    }).populate('chairs').exec(function (err, conference) {
      if (err) return res.json(500, {error: err})
	    if (!conference) return res.json(400, {message: 'Conference not found.'})
	    conference.chairs.add(req.param('add_id'))
      conference.save((err) => {
        if (err) return res.json(500, {error: err})
        Conference.findOne({
          id: req.param('id')
        }).populate('chairs').exec(function (err, conference) {
          if (err) return res.json(500, {error: err})
          if (!conference) return res.json(400, {message: 'Conference not found.'})
          return res.json({message: 'Chair added successfully!', conference: conference})
        })
      })
    })
  },

  deleteChair: function (req, res) {
    Conference.findOne({
      id: req.param('id')
    }).populate('chairs').exec(function (err, conference) {
      if (err) return res.json(500, {error: err})
	    if (!conference) return res.json(400, {message: 'Conference not found.'})
	    if (conference.chairs.length < 2) return res.json(400, {message: 'At least a chair is required for each conference'})
      conference.chairs.remove(req.param('delete_id'))
      conference.save((err) => {
        if (err) return res.json(500, {error: err})
        Conference.findOne({
          id: req.param('id')
        }).populate('chairs').exec(function (err, conference) {
          if (err) return res.json(500, {error: err})
          if (!conference) return res.json(400, {message: 'Conference not found.'})
          return res.json({message: 'Chair removed successfully!', conference: conference})
        })
      })
    })
  },

  addPaper: function (req, res) {
    // if (req.param('papers_id')) return res.json(400, {message: 'Papers field is empty.'})
    if (!req.param('fid')) return res.json(400, {message: 'File field is empty.'})
    if (!req.param('cid')) return res.json(400, {message: 'Conference field is empty.'})
    Paper.create({
      file: req.param('fid'),
      conference: req.param('cid')
    }).exec((err, paper) => {
      if (err) return res.json(500, {error: err})
      return res.json({message: 'Paper committed successfully!', paper: paper})
    })
  },

  destroy: function (req, res) {
    Conference.destroy({
      id: req.param('conference')
    }).exec(function (err) {
      if (err) return res.json(500, {error: err})

      return res.json({
        message: 'Conference deleted'
      })
    })
  }
}
