/**
 * isFileMine
 *
 * @module      :: Policy
 * @description :: check if paper is user's propriety
 * @docs        :: http://sailsjs.org/#!/documentation/concepts/Policies
 *
 */
module.exports = function (req, res, next) {
  if (!req.param('fid')) return res.json(400, {message: 'No paper_id'})

  var u = AuthService.user()

  if (!u.files.find(function eq (el) {
    return (el.id == req.param('fid'))
  })) {
    return res.json(400, {
      message: 'You don\'t have the privileges to do this action.'
    })
  }

  next()
}
