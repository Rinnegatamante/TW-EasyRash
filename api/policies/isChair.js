/**
 * isChair
 *
 * @module      :: Policy
 * @description :: check if user is a chair of the conference
 * @docs        :: http://sailsjs.org/#!/documentation/concepts/Policies
 *
 */
module.exports = function (req, res, next) {
  var criteria = {}
  if (!req.param('id')) return res.json(400, {message: 'No conference ID.'})
  var u = AuthService.user()

  if (!u.chair_conferences.find(function eq (el) {
    return (el.id == req.param('id'))
  })) {
    return res.json(400, {
      message: 'You don\'t have the privileges to do this action.'
    })
  }

  next()
}
