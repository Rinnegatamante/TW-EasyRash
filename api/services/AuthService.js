// AuthUser.js - in api/services
// return user's id authenticated after sessionAuth
var login_u

exports.user = function (u) {
  if (u) {
    login_u = u
  }
  return login_u
}
