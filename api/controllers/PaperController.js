/**
 * PaperController
 *
 * @description :: Server-side logic for managing files
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
  _config: {
    actions: false,
    shortcuts: false,
    rest: false
  },

  index: function (req, res) {
    return res.views('paper_up')
  },

  find: function (req, res) {
    Paper.findOne(req.param('pid')).populate('conference').populate('file').exec((err, paper) => {
      if (err) { console.log(err) }
      return res.json({
        paper: paper
      })
    })
  },

  accept: function (req, res) {
    Paper.findOne(req.param('pid')).populate('conference').populate('file').exec((err, paper) => {
      paper.status = 1
      paper.save((err) => {
        if (err) { console.log(err) }
        return res.json({
          message: 'Saved',
          paper: paper
        })
      })
    })
  },

  reject: function (req, res) {
    Paper.findOne(req.param('pid')).populate('conference').populate('file').exec((err, paper) => {
      paper.status = 0
      paper.save((err) => {
        if (err) { console.log(err) }
        return res.json({
          message: 'Saved ',
          paper: paper
        })
      })
    })
  },

  delete: function (req, res) {
    Paper.destroy({id: req.param('pid')}).exec((err, paper) => {
      if (err) { return res.negotiate(err) }
      return res.json({
        message: 'Delete'
      })
    })
  }
}
