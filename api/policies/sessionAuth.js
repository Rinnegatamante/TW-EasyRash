/**
 * sessionAuth
 *
 * @module      :: Policy
 * @description :: Simple policy to allow any authenticated user
                    HEADER : 'WWW-Authenticate' , (id+' '+token) -> in base64
 * @docs        :: http://sailsjs.org/#!/documentation/concepts/Policies
 *
 */
module.exports = function (req, res, next) {
  if (!req.headers['www-authenticate']) return res.forbidden('You are not permitted to perform this action.')

  var header = req.headers['www-authenticate']
  var raw_credential = new Buffer(header, 'base64').toString()

  var credential = raw_credential.split(' ') // [id, token]
  if (credential.length != 2) return res.forbidden('You are not permitted to perform this action.')

  var id = credential[0]
  var token = credential[1]

  User.findOne({
    id: id,
    token: token
  }).exec(function (err, user) {
    if (err) return res.forbidden('You are not permitted to perform this action.')
    if (!user) return res.forbidden('You are not permitted to perform this action.')
    console.log('#A:- authorized user: ' + user.name + ' - id: ' + user.id)
    AuthService.user(user)
    return next()
  })
}
