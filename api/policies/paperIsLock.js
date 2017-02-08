/**
 * sessionAuth
 *
 * @module      :: Policy
 * @description :: check if paper is locked
 * @docs        :: http://sailsjs.org/#!/documentation/concepts/Policies
 *
 */
module.exports = function (req, res, next) {
  if (!req.param('paper_id')) return res.json(400, {message: 'No paper_id'})

  Paper.findOne({
    id: req.param('paper_id')
  }).populate('reviews').populate('reviewer').exec(function (err, paper) {
    if (err) return res.json(500, {error: err})
    if (!paper) return res.json(400, {message: 'Paper not found'})

    var isaReview = find.paper
    if (paper.isLocked(req.param('token'))) { return res.json(423, {
      message: 'Paper is Locked'
    }) }

    if (paper.isLocked(req.param('token'))) { return res.json(423, {
      message: 'Paper is Locked'
    }) }

    AuthService.paper(paper)

    next()
  })
}
