/**
 * sessionAuth
 *
 * @module      :: Policy
 * @description :: check if object is user's propriety - but not paper :)
 * @docs        :: http://sailsjs.org/#!/documentation/concepts/Policies
 *
 */
module.exports = function (req, res, next) {
  var criteria = {}

  if (req.param('review_id')) criteria['reviews'] = req.param('review_id')
  if (req.param('rating_id')) criteria['ratings'] = req.param('rating_id')

  var u = AuthService.user()

  for (i in criteria) {
    if (!u[i].find(criteria[i])) {
      return res.json(400, {
        error: '',
        message: 'This ' + i + ' is not of your propriety'
      })
    }
  }

  next()
}
