var hat = require('hat')
var nodemailer = require('nodemailer')
var transporter = nodemailer.createTransport('SMTP', {
  service: 'Gmail',
  auth: {
    user: 'easyrash67@gmail.com',
    pass: 'easyrash'
  }
})

module.exports = {

  register: function (req, res) {
    var pass = req.param('password')
    var mail = req.param('email')
    if (pass.length < 8) return res.json(400, {message: 'Password is too weak. Must be at least 8 characters.'})
    User.create({
      name: req.param('name'),
      sex: req.param('sex'),
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
  
  searchByName: function (req, res) {
	User.find({
		name: { 'like' : '%' + req.param('field') + '%'}
	}).exec(function (err, users){
	  if (err) return res.json(500, {error: err})
	  return res.json({users: users})
	})
  },
  
  login: function (req, res) {
    User.findOne({
      email: req.param('email')
    }).exec(function (err, user) {
      if (err) return res.json(500, {error: err})
      if (!user) return res.json(400, {message: 'User not found'})
      if (!user.verifyPassword(req.param('digest'))) return res.json(401, {message: 'User not found'})

      user.generateToken()

      user.save(function (err) {
        if (err) return res.json(400, {error: err})
        return res.json({
          message: 'Welcome ' + user.name,
          user: user,
          token: user.token
        })
      })
    })
  },

  logout: function (req, res) {
    var u = AuthService.user()

    u.generateToken()
    u.save((err) => {
      if (err) return res.json(500, {error: err})

      return res.json({
        message: 'Successfully logout'
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

    u.password = User.encryptPassword(u.email, req.param('password'))
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

  sendForgot: function (req, res) {
    if (!req.param('email')) return res.json({message: 'E-mail field is empty.'})
    User.findOne({
      email: req.param('email')
    }).exec(function (err, user) {
      if (err) return res.json(500, {error: err})
      if (!user) return res.json(400, {message: 'User not found'})

	  user.generateTempToken()

      user.save(function update (err) {
        if (err) return res.json(400, {error: err})
      })

	  var mailOptions = {
    from: '"EasyRash" <easyrash67@gmail.com>',
    to: user.email,
    subject: 'Password Recovery',
    text: '',
    html: 'Click the link below to reset your password:<br>http://localhost:1337/#reset?t=' + user.tempToken
	  }

	  transporter.sendMail(mailOptions, function (err, info) {
	    if (err) {
		  console.log(err)
      return res.json(400, {error: err})
    }
    return res.json({
      message: 'Mail successfully sent!'
    })
  })
    })
  },

  resetpassword: function (req, res) {
    if (!req.param('tempToken')) return res.json({message: 'Invalid link, please retry the whole procedure.'})
    console.log(req.param('tempToken'))
    User.findOne({
      tempToken: req.param('tempToken')
    }).exec(function (err, user) {
      if (err) {
        console.log(err)
        return res.json(500, {error: err})
      }
	  if (!user) return res.json(400, {message: 'User not found.'})
	  var newPass = hat()

	  var mailOptions = {
    from: '"EasyRash" <easyrash67@gmail.com>',
    to: user.email,
    subject: 'Password Reset',
    text: '',
    html: 'This is the new randomly generated password for your account:<br>' + newPass
	  }

	  transporter.sendMail(mailOptions, function (err, info) {
	    if (err) {
		  console.log(err)
      return res.json(400, {error: err})
    }
  })

	  user.password = User.encryptPassword(user.email, newPass)
      user.generateTempToken()
	  user.save(function updatePassword (err) {
    if (err) return res.json(400, {error: err})
  })

      return res.json({
        message: 'A new mail has been sent with the new password.'
      })
    })
  },

  test: function (req, res) {
    return res.json(req.allParams())
  }

}
