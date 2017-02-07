/**
 * Policy Mappings
 * (sails.config.policies)
 *
 * Policies are simple functions which run **before** your controllers.
 * You can apply one or more policies to a given controller, or protect
 * its actions individually.
 *
 * Any policy file (e.g. `api/policies/authenticated.js`) can be accessed
 * below by its filename, minus the extension, (e.g. "authenticated")
 *
 * For more information on how policies work, see:
 * http://sailsjs.org/#!/documentation/concepts/Policies
 *
 * For more information on configuring policies, check out:
 * http://sailsjs.org/#!/documentation/reference/sails.config/sails.config.policies.html
 */

module.exports.policies = {

  /***************************************************************************
  *                                                                          *
  * Default policy for all controllers and actions (`true` allows public     *
  * access)                                                                  *
  *                                                                          *
  ***************************************************************************/

  '*': false,

  /***************************************************************************
  *                                                                          *
  * Here's an example of mapping some policies to run before a controller    *
  * and its actions                                                          *
  *                                                                          *
  ***************************************************************************/
  UserController: {
    '*': true,
    login: true,
    logout: 'sessionAuth',
    getData: 'sessionAuth',
    getFiles: 'sessionAuth',
    changePassword: 'sessionAuth',
    changeMail: 'sessionAuth'
  },

  ConferenceController: {
    create: 'sessionAuth',
    addPaper: ['sessionAuth', 'isPaperMine'],
    addChair: ['sessionAuth', 'isChair'],
  	deleteChair: ['sessionAuth', 'isChair'],
	addReviewer: ['sessionAuth', 'isChair'],
  	deleteReviewer: ['sessionAuth', 'isChair'],
  	searchConference: 'sessionAuth',
  	getPapers: 'sessionAuth',
  	getData: 'sessionAuth',
  	setStatus: ['sessionAuth', 'isChair']
  },

  PaperController: {
    upload: 'sessionAuth',
    find: 'sessionAuth',
    pending: 'sessionAuth',
    reject: 'sessionAuth',
    accept: 'sessionAuth',
    delete: ['sessionAuth', 'isPaperMine'],
    addAuthor: ['sessionAuth', 'isPaperMine'],
    removeAuthor: ['sessionAuth', 'isPaperMine']
  },

  ReviewController: {
    create: 'sessionAuth',
    update: ['sessionAuth', 'isMine'],
    lock: ['sessionAuth', 'isMine', 'paperIsLock'],
    destroy: ['sessionAuth', 'isMine']
  },

  RatingController: {
    create: 'sessionAuth',
    update: ['sessionAuth', 'isMine']
  }

}
