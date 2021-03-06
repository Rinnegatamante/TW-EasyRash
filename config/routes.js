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
  'post /paper/create': 'PaperController.upload', // Against REST due to library limitation
  'post /paper/:pid/accept': 'PaperController.accept',
  'post /paper/:pid/reject': 'PaperController.reject',
  'delete /paper/:pid/delete': 'PaperController.delete',
  'put /paper/:pid/addauthor/:aid': 'PaperController.addAuthor',
  'delete /paper/:pid/removeauthor/:aid': 'PaperController.removeAuthor',
  'put /paper/:pid/addreviewer/:reid': 'PaperController.addReviewer',
  'delete /paper/:pid/removereviewer/:reid': 'PaperController.removeReviewer',
  'get /paper/:pid/imReviewer': 'PaperController.isaReviewer',
  'get /paper/:pid/epub': 'PaperController.getEPUB',
  'get /paper/:pid': 'PaperController.find',
  // CONFERENCE
  'put /conference/create': 'ConferenceController.create',
  'get /conference/:id/papers': 'ConferenceController.getPapers',
  'get /conference/:id/getData': 'ConferenceController.getData',
  'delete /conference/:id/deleteChair/:delete_id': 'ConferenceController.deleteChair',
  'put /conference/addChair': 'ConferenceController.addChair',
  'delete /conference/:id/deleteReviewer/:delete_id': 'ConferenceController.deleteReviewer',
  'put /conference/addReviewer': 'ConferenceController.addReviewer',
  'post /conference/searchConference/': 'ConferenceController.searchConference',
  'post /conference/setStatus': 'ConferenceController.setStatus',
  // USER
  'get /user/searchByName/:field': 'UserController.searchByName',
  'post /user/login': 'UserController.login',
  'put /user/register': 'UserController.register',
  'get /user/getdata': 'UserController.getData',
  'post /user/logout': 'UserController.logout',
  'post /user/reset/psw': 'UserController.resetPassword',
  'post /user/reset/send': 'UserController.sendForgot',
  'post /user/change/data': 'UserController.updateData',
  // REVIEW
  'get /paper/:pid/reviews/': 'ReviewController.ofPaper',
  'put /paper/:pid/review/create': 'ReviewController.create',
  'post /paper/:pid/review/update': 'ReviewController.update',
  'post /paper/:pid/lock': 'ReviewController.lockPaper',
  'post /paper/:pid/free/:token': 'ReviewController.freePaper',
  'get /paper/:pid/islockvalid/:token': 'ReviewController.isLockValid',
  // RATING
  'post /rating/create': 'RatingController.create',
  'post /rating/update': 'RatingController.update'

}
