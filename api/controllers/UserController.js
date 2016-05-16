var bcrypt = require('bcrypt');
const saltRounds = 10;

module.exports = {
	register: function (req, res) {
		User.create({
			name : req.param('name'),
			email : req.param('email'),
			password : hashPassword(req.param('password'))
		}).exec(function createCB(err, created){
			if (!err){
				//console.log(created);
				return res.json({message:created});
			}else{
				return res.json(400,err);
			}
		});
	},

	login: function (req, res) {
		var rawPassword = req.param('password');
		var userToken = generateToken();
		User.findOne({
			email : req.param('email'),
		}).exec(function execLogin(err, record){
			if (!err && record){
				if (bcrypt.compareSync(rawPassword, record.password)){
					User.update({
						id : record.id
					},{
						token : userToken
					}).exec(function (err,s){
						if (err) return res.json(400,err);
						return res.json({token:userToken});
					});
				}else{
					return res.json(401,{message:'unauthorized'})
				}
			}else{
				return res.json(400,err);
			}
		});
	},

	logout: function (req, res) {
		User.update({
			token: req.param('token')
		},{
			token: "NULL"
		}).exec(function (){});
		return res.json({logout:userToken});
	},

	getData: function (req, res) {
		User.find({
			token: req.param('token')
		}).exec(function purgeArray(req, res2){
			if (res2[0]){
				delete res2[0].token;
				delete res2[0].password;
				return res.json(res2[0]);
			}else{
				return res.json(400,err);
			}
		});
	},

	changePassword: function (req, res) {
		User.update({
			token : req.param('token')
		},{
			password : hashPassword(req.param('password'))
		}).exec(function updatePassword(err, records){
			if (!err){
				return res.json({message:'changed'});
			}else{
				return res.json(400,err);
			}
		});
	},

	changeMail: function (req, res) {
		User.update({
			token : req.param('token')
		},{
			email : req.param('email')
		}).exec(function updateMail(err, records){
			if (!err){
				return res.json({message:'changed'});
			}else{
				return res.json(400,err);
			}
		});
	},

	test: function (req, res) {
		return res.json(req.allParams());
	},

};

function generateToken(){
	var randomstring = require("randomstring");
	//var unique = false;
	//while (!unique){
		var utoken = randomstring.generate();
		/*User.count({
			token : utoken,
		}).exec(function exists(err, records){
			console.log(unique, records);
			if (records == 0){
				unique = true
			}
		});
	}*/
	return utoken;
}

function hashPassword(req){
	var hashed = bcrypt.hashSync(req, saltRounds);
	return hashed;
}
