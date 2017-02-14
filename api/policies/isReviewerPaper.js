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
  if (!req.param('pid')) return res.json(400, {message: 'No paper ID.'})

  var u = AuthService.user()

  if (!u.reviewer_papers.find(function eq (el) { // check if user is a reviewer for this paper
    return (el.id == req.param('pid'))
  })) {
    return res.json(403)
  }

  if (u.reviews.find(function eq (el) { // check if reviewer hase alredy comment this paper
    return (el.paper == req.param('pid'))
  })) {
    return res.json(400, {
      message: 'You have already review this paper'
    })
  }

  next()
}
