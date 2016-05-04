// User.js
module.exports = {
  connection: 'MySQL',
  attributes: {
    id: {
      type: 'objectid',
      autoIncrement: true,
      unique: true,
      primaryKey: true
    },
    name: {
      type: 'string',
    },
    email: {
      type: 'email',
      unique: true
    },
    password: {
      type: 'string'
    },
	token: {
	  type: 'string',
	  unique: true
	}
  }
};
