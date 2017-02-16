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
  if (!req.param('reid')) return res.json(400, {message: 'No reviewer ID.'})

  var u = AuthService.user()

  if (!u.reviewer_conferences.find(function eq (el) {
    return (el.id == req.param('reid'))
  })) {
    return res.json(400, {
      message: 'You don\'t have the privileges to do this action. You aren\'t a reviewer'
    })
  }

  next()
}
