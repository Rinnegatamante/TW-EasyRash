/**
 * ControllerController
 *
 * @description :: Server-side logic for managing Controllers
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {

  index: function (req, res) {
    return res.json('')
  },

  create: function (req, res) {
    Conference.create({
      title: req.param('title'),
      acronym: req.param('acronym')
    }).exec(function (err, conference) {
      if (err) return res.json(500, {error: err})
      if (!conference) return res.json(400, {message: 'Conference not create'})

      for (i = 0; req.param('chairs')[i]; i++) {
        conference.chairs.add(req.param('chairs')[i])
      }
      for (i = 0; req.param('papers')[i]; i++) {
        conference.papers.add(req.param('chairs')[i])
      }

      return res.json({
        message: '',
        conference: conference
      })
    })
  },

  addPapers: function (req, res) {
    if (req.param('papers_id')) return res.json(400, {message: 'papers is empty'})

    Conference.findOne({
      id: req.param('conference_id')
    }).exec(function (err, cpnference) {
      if (err) return res.json(500, {error: err})
      if (!conference) return res.json(400, {message: 'Conference not found'})

      conference.papers.add(req.param('papers_id'))
      conference.save(function (err) {
        if (err) return res.json(500, {error: err})

        return res.json({
          message: '',
          conference: conference
        })
      })
    })
  },

  addChairs: function (req, res) {
    if (req.param('chairs_id')) return res.json(400, {message: 'chairs is empty'})

    Conference.findOne({
      id: req.param('conference_id')
    }).exec(function (err, cpnference) {
      if (err) return res.json(500, {error: err})
      if (!conference) return res.json(400, {message: 'Conference not found'})

      conference.chairs.add(req.param('chairs_id'))
      conference.save(function (err) {
        if (err) return res.json(500, {error: err})

        return res.json({
          message: '',
          conference: conference
        })
      })
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
