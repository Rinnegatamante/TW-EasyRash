/**
 * Route Mappings
 * (sails.config.routes)
 *
 * Your routes map URLs to views and controllers.
 *
 * If Sails receives a URL that doesn't match any of the routes below,
 * it will check for matching files (images, scripts, stylesheets, etc.)
 * in your assets directory.  e.g. `http://localhost:1337/images/foo.jpg`
 * might match an image file: `/assets/images/foo.jpg`
 *
 * Finally, if those don't match either, the default 404 handler is triggered.
 * See `api/responses/notFound.js` to adjust your app's 404 logic.
 *
 * Note: Sails doesn't ACTUALLY serve stuff from `assets`-- the default Gruntfile in Sails copies
 * flat files from `assets` to `.tmp/public`.  This allows you to do things like compile LESS or
 * CoffeeScript for the front-end.
 *
 * For more information on configuring custom routes, check out:
 * http://sailsjs.org/#!/documentation/concepts/Routes/RouteTargetSyntax.html
 */

module.exports.routes = {

  /***************************************************************************
  *                                                                          *
  * Make the view located at `views/homepage.ejs` (or `views/homepage.jade`, *
  * etc. depending on your default view engine) your home page.              *
  *                                                                          *
  * (Alternatively, remove this and add an `index.html` file in your         *
  * `assets` directory)                                                      *
  *                                                                          *
  ***************************************************************************/

  /***************************************************************************
  *                                                                          *
  * Custom routes here...                                                    *
  *                                                                          *
  * If a request to a URL doesn't match any of the custom routes above, it   *
  * is matched against Sails route blueprints. See `config/blueprints.js`    *
  * for configuration options and examples.                                  *
  *                                                                          *
  ***************************************************************************/

  // PAPER
  'post /paper/create': 'PaperController.upload',
  'post /paper/:pid/accept': 'PaperController.accept',
  'post /paper/:pid/pending': 'PaperController.pending',
  'post /paper/:pid/reject': 'PaperController.reject',
  'post /paper/:pid/delete': 'PaperController.delete',
  'post /paper/:pid/addauthor/:aid': 'PaperController.addAuthor',
  'post /paper/:pid/removeauthor/:aid': 'PaperController.removeAuthor',
  'post /paper/:pid/addreviewer/:reid': 'PaperController.addReviewer',
  'post /paper/:pid/removereviewer/:reid': 'PaperController.removeReviewer',
  'get /paper/:pid': 'PaperController.find',
  // CONFERENCE
  'post /conference/create': 'ConferenceController.create',
  'post /conference/papers': 'ConferenceController.getPapers',
  'post /conference/getData': 'ConferenceController.getData',
  'post /conference/deleteChair': 'ConferenceController.deleteChair',
  'post /conference/addChair': 'ConferenceController.addChair',
  'post /conference/deleteReviewer': 'ConferenceController.deleteReviewer',
  'post /conference/addReviewer': 'ConferenceController.addReviewer',
  'post /conference/searchConference': 'ConferenceController.searchConference',
  // 'post /conference/getPendingPapers': 'ConferenceController.getPendingPapers',
  'post /conference/addpaper': 'ConferenceController.addPaper',
  'post /conference/setStatus': 'ConferenceController.setStatus',
  // USER
  'post /user/searchByName': 'UserController.searchByName',
  'post /user/login': 'UserController.login',
  'post /user/register': 'UserController.register',
  'post /user/change/psw': 'UserController.changePassword',
  'post /user/change/mail': 'UserController.changeMail',
  'post /user/getdata': 'UserController.getData',
  'post /user/getfiles': 'UserController.getFiles',
  'post /user/logout': 'UserController.logout',
  'post /user/test': 'UserController.test',
  'post /user/reset/psw': 'UserController.resetPassword',
  'post /user/reset/send': 'UserController.sendForgot',
  'post /user/change/data': 'UserController.updateData',
  // REVIEW
  'get /review/': 'ReviewController.find',
  'get /paper/:pid/reviews/': 'ReviewController.ofPaper',
  'post /paper/:pid/review/create': 'ReviewController.create',
  'post /paper/:pid/review/update': 'ReviewController.update',
  'get /paper/:pid/lock': 'ReviewController.lockPaper',
  'get /paper/:pid/free/:token': 'ReviewController.freePaper',
  // RATING
  'post /rating/create': 'RatingController.create',
  'post /rating/update': 'RatingController.update'

}
