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
				return res.send(1);
			}else{
				return res.send(0);
			}
		});
	},
	
	login: function (req, res) {
		var rawPassword = req.param('password');
		var userToken = generateToken();
		User.find({
			email : req.param('email')
		}).exec(function execLogin(err, records){
			if (!err){
				console.log(records);
				if (bcrypt.compareSync(rawPassword, records[0].password)){
					User.update({
						id : records[0].id
					},{
						token : userToken
					}).exec(function (){});
				}
				return res.send(userToken);
			}else{
				return res.send(0);
			}
		});
	},
	
	logout: function (req, res) {
		User.update({
			token: req.param('token')
		},{
			token: "NULL"
		}).exec(function (){});
		return res.send(1);
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
				return res.send(0);
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
				return res.send(1);
			}else{
				return res.send(0);
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
				return res.send(1);
			}else{
				return res.send(0);
			}
		});
	},
 
};

function generateToken(){
	var randomstring = require("randomstring");
	var unique = false;
	while (!unique){
		var token = randomstring.generate();
		User.count({
			token : req.param('token')
		}).exec(function exists(err, records){
			if (records == 0){
				unique = true
			}
		});
	}
	return token;
}

function hashPassword(req){
	var hashed = bcrypt.hashSync(req, saltRounds);
	return hashed;
}