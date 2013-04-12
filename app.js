var EPOCH = 5 * 1000;

Students = new Meteor.Collection('students');

/*
 * Reset app state
 * ```javascript
 *   window.localStorage.clear();
 *   Students.find().forEach(function(a) {console.log(Students.remove({_id: a._id}));})
 * ```
 */

if (Meteor.isClient) {

  /*
   * helper functions
   */

  var randomId = function () {
    return (Math.random()*100000000000000000).toString();
  };

  var getId = function () {
    return window.localStorage.getItem('id');
  };

  var setId = function (id) {
    window.localStorage.setItem('id', id);
  };

  var getUser = function () {
    return Students.findOne(getId());
  };

  var now = function () {
    return (new Date()).getTime();
  };

  var numTotal = function () {
    return Students.find({ 'lastActivity': { $gt: now() - EPOCH }}).count();
  };

  var numConfused = function () {
    return Students.find({ confused: true, 'lastActivity': { $gt: now() - EPOCH }}).count();
  };

  var setConfused = function (value) {
    Students.update(getId(), { $set: { confused: value }});
  };

  var toggleConfused = function () {
    if (getUser().confused) {
      setConfused(false);
    } else {
      setConfused(true);
    }

    Session.set('hack', randomId()); // HACK: this forces reload of view
  };

  
  /*
   * Create user if there isn't a user already
   */

  Meteor.startup(function () {
    if (!getId()) {
      console.log('adding new user');
      var id = randomId();
      setId(id);
      Students.insert({_id: getId(), confused: false });
    }
  });


  /*
   * Template.button
   */

  Template.button.user = function () {
    Session.get('hack'); // HACK: Need this to force live-reload
    return getUser();
  };

  Template.button.events({
    'click input' : function () {
      toggleConfused();
    }
  });

  /*
   * Template.peers
   */

  Template.peers.confused = function () {
    return numConfused();
  };

  Template.peers.total = function () {
    return numTotal();
  };

  Template.peers.good = function () {
    return 100 * numConfused() / numTotal();
  };

  Template.peers.bad = function () {
    return 100 - 100 * numConfused() / numTotal();
  };

  /*
   * Set lastActivity every EPOCH
   */

  Meteor.setInterval(function () {
    Students.update(getId(), { $set: { 'lastActivity': now() }});
  }, EPOCH / 2);
}


/*
 * Meteor.Server
 */

if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
  });
}
