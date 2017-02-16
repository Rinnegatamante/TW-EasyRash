/**
 * UserController
 *
 * @description :: Server-side logic for managing users.
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
// Settings for the mail sender used for the password recovery
var hat = require('hat')
var nodemailer = require('nodemailer')
var transporter = nodemailer.createTransport('SMTP', {
  service: 'Gmail',
  auth: {
    user: 'easyrashg@gmail.com',
    pass: 'axiiyard'
  }
})

module.exports = {

	// register: Adds a new user to the database
  register: function (req, res) {
    var pass = req.param('password')
    var mail = req.param('email')
    if (pass.length < 8) {
      return res.json(400, {
        message: 'Password is too weak. Must be at least 8 characters.'
      })
    }
    User.create({
      name: req.param('name'),
      sex: req.param('sex'),
      email: mail,
      password: User.encryptPassword(req.param('email'), pass)
    }).exec(function createCB (err, user) {
      if (err) {
        return res.json(500, {
          error: err
        })
      }
      if (!user) {
        return res.json(400, {
          message: 'An error occured during registration.'
        })
      }

      return res.json({
        message: 'Hello, you have signed in successfully.',
        user: user
      })
    })
  },

	// updateData: Updates data of a user in the database
  updateData: function (req, res) {
    var u = AuthService.user()
    var pass = req.param('newpassword')
    var old_digest = req.param('olddigest')
    var old_pass = req.param('oldpassword')
    var mail = req.param('email')
    if (!u.verifyPassword(old_digest)) {
      return res.json(401, {
        message: 'Wrong password.'
      })
    }
    if (pass != undefined) {
      if (pass.length < 8) {
        return res.json(400, {
          message: 'Password is too weak. Must be at least 8 characters.'
        })
      }
      u.password = User.encryptPassword(mail, pass)
    } else {
      u.password = User.encryptPassword(mail, old_pass)
    }
    u.email = mail
    u.save(function updateData (err) {
      if (err) {
        return res.json(400, {
          error: err
        })
      }

      return res.json({
        message: 'Profile settings updated successfully!'
      })
    })
  },

	// searchByName: Executes an users research in the database given a name
  searchByName: function (req, res) {
    User.find({
      name: {
        'like': '%' + req.param('field') + '%'
      }
    }).exec(function (err, users) {
      if (err) {
        return res.json(500, {
          error: err
        })
      }
      return res.json({
        users: users
      })
    })
  },

	// login: Executes login procedure for given credentials
  login: function (req, res) {
    User.findOne({
      email: req.param('email')
    }).exec(function (err, user) {
      if (err) {
        return res.json(500, {
          error: err
        })
      }
      if (!user) {
        return res.json(400, {
          message: 'User not found.'
        })
      }
      if (!user.verifyPassword(req.param('digest'))) {
        return res.json(401, {
          message: 'User not found.'
        })
      }

      user.generateToken()

      user.save(function (err) {
        if (err) {
          return res.json(400, {
            error: err
          })
        }
        return res.json({
          message: 'Welcome ' + user.name,
          user: user,
          token: user.token
        })
      })
    })
  },

	// logout: Executes logout procedure
  logout: function (req, res) {
    var u = AuthService.user()

    u.generateToken()
    u.save(function (err) {
      if (err) {
        return res.json(500, {
          error: err
        })
      }

      return res.json({
        message: 'Successfully logout.'
      })
    })
  },

	// getData: Returns generic data of logged user
  getData: function (req, res) {
    var u = AuthService.user()

    return res.json(200, {
      user: u
    })
  },

	// getPapers: Returns owned papers of an user
  getPapers: function (req, res) {
    var criteria = {}
    req.param('pid') ? criteria['paper'] = req.param('pid') : undefined
    req.param('cid') ? criteria['conference'] = req.param('cid') : undefined

    Paper.find(criteria).populate('conference').populate('author').populate('owner').exec(function (err, papers) {
      if (err) return console.log(err)
      if (!papers) {
        return res.json(400, {
          message: 'You have no papers yet.'
        })
      }
      return res.json({
        papers: papers
      })
    })
  },

	// sendForgot: Sends a mail for the password reset procedure
  sendForgot: function (req, res) {
    if (!req.param('email')) {
      return res.json({
        message: 'E-mail field is empty.'
      })
    }
    User.findOne({
      email: req.param('email')
    }).exec(function (err, user) {
      if (err) {
        return res.json(500, {
          error: err
        })
      }
      if (!user) {
        return res.json(400, {
          message: 'User not found'
        })
      }

      user.generateTempToken() // Will be used as confirmation token in the mail with GET method

      user.save(function update (err) {
        if (err) {
          return res.json(400, {
            error: err
          })
        }
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
          return res.json(400, {
            error: err
          })
        }
        return res.json({
          message: 'Mail successfully sent!'
        })
      })
    })
  },

	// resetpassword: Resets the password of an user given a confirmation token
  resetpassword: function (req, res) {
    if (!req.param('tempToken')) {
      return res.json({
        message: 'Invalid link, please retry the whole procedure.'
      })
    }
    User.findOne({
      tempToken: req.param('tempToken')
    }).exec(function (err, user) {
      if (err) {
        console.log(err)
        return res.json(500, {
          error: err
        })
      }
      if (!user) {
        return res.json(400, {
          message: 'User not found.'
        })
      }
      var newPass = hat()

			// Sends a confirmation mail to the user with the randomly generated new password
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
          return res.json(400, {
            error: err
          })
        }
      })

      user.password = User.encryptPassword(user.email, newPass)
      user.generateTempToken()
      user.save(function updatePassword (err) {
        if (err) {
          return res.json(400, {
            error: err
          })
        }
      })

      return res.json({
        message: 'A new mail has been sent with the new password.'
      })
    })
  }

}
