/**
 * sessionAuth
 *
 * @module      :: Policy
 * @description :: check if paper is locked
 * @docs        :: http://sailsjs.org/#!/documentation/concepts/Policies
 *
 */
module.exports = function (req, res, next) {
  if (!req.param('pid')) return res.json(400, {message: 'No paper_id'})

  Paper.findOne({
    id: req.param('pid')
  }).exec(function (err, paper) {
    if (err) return res.negotiate(err)
    if (!paper) return res.json(400, {message: 'Paper not found'})

    if (paper.isLocked(req.param('token'))) {
      var start_time = new Date(paper.updatedAt).getTime()
      var now = new Date().getTime()
      var minutes = new Date((start_time + sails.config.globals.timeLock) - now).getMinutes()
	  var seconds = new Date((start_time + sails.config.globals.timeLock) - now).getSeconds()
      return res.json(423, {
        message: 'Paper is still locked for other ' + minutes + ' minutes and ' + seconds + 'seconds. Please, ry again later.'
      })
    }

    AuthService.paper(paper)

    next()
  })
}
