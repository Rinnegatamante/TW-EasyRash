/**
 * isPaperMine
 *
 * @module      :: Policy
 * @description :: check if paper is user's propriety
 * @docs        :: http://sailsjs.org/#!/documentation/concepts/Policies
 *
 */
module.exports = function (req, res, next) {
  if (!req.param('paper_id')) return res.json(400, {message: 'No paper_id'})

  criteria['papers'] = req.param('paper_id')

  var u = AuthService.user()

  if (!u.papers.find(req.param('paper_id'))) {
    return res.json(400, {
      message: 'This paper is not of your propriety'
    })
  }

  next()
}
