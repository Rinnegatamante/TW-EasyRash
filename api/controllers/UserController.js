module.exports = {
  register: function (req, res) {
    var pass = req.param('password')
    var mail = req.param('email')
    if (pass.length < 8) return res.json(400, {message: 'Password is too weak. Must be at least 8 characters.'})
    User.create({
      name: req.param('name'),
      subname: req.param('subname'),
      email: mail,
	    password: User.encryptPassword(req.param('email'), pass)
    }).exec(function createCB (err, user) {
      if (err) return res.json(500, {error: err})
      if (!user) return res.json(400, {message: 'An error occured during registration.'})

      return res.json({
        message: 'Hello, you have signed in successfully.',
        user: user
      })
    })
  },

  login: function (req, res) {
    User.findOne({
      email: req.param('email')
    }).exec(function (err, user) {
      if (err) return res.json(500, {error: err})
      if (!user) return res.json(400, {message: 'User not found'})
      console.log(user)
      if (!user.verifyPassword(req.param('digest'))) return res.json(401, {message: 'User not found'})

      user.generateToken()

      user.save(function (err) {
        if (err) return res.json(400, err)
        return res.json({
          message: 'Hi ' + user.name,
          user: user,
          token: user.token
        })
      })
    })
  },

  logout: function (req, res) {
    var u = AuthService.user()

    u.generateToken() // ??? CHIEDI ???
    u.save((err) => {
      if (err) return res.json(500, {error: err})

      return res.json({
        message: '',
        user: user
      })
    })
  },

  getData: function (req, res) {
    var u = AuthService.user()

    return res.json(200, {
      user: u
    })
  },

  changePassword: function (req, res) {
    var u = AuthService.user()

    u.password = u.hashPassword(req.param('password'))
    u.save(function updatePassword (err) {
      if (err) return res.json(400, {error: err})

      return res.json({
        message: 'changed',
        user: u
      })
    })
  },

  changeMail: function (req, res) {
    var u = AuthService.user()
    if (!req.param('email')) return res.json({message: 'email is empty'})

    u.email = req.param('email')
    u.save(function updateMail (err) {
      if (err) return res.json(400, {error: err})

      return res.json({message: 'changed'})
    })
  },

  test: function (req, res) {
    return res.json(req.allParams())
  }

}
