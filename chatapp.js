Chats = new Mongo.Collection('chatdb');

if (Meteor.isClient) {
  var msgLimit = 5;
  Meteor.subscribe('messages', msgLimit)
  Template.chat.helpers({
    messages: function() { //finds and return all messages in chats database
      return Chats.find({}, {
        sort: { createdAt: 1 } // new msg will be added at the bottom
      }); 
    }
  });

  Template.chat.events({
    'click .clickable': function () {
      var message = $('#textbox').val(); // gets the message from chatbox
      $('#textbox').val(''); // empty text area
      Meteor.call('addMessage', message, function(err, result) {
        if (err) {
          console.log(err);
        }
      });
    }
  });
}

if (Meteor.isServer) {
  Meteor.startup(function () {
    // return Meteor.methods({ 
    //   removeAllPosts: function() { // removes everything in the database, call Meteor.call('removeAllPosts') in consle 
    //     return Chats.remove({});
    //   }
    // });
  });

  Meteor.methods({
    addMessage: function(msg) { // method to add message to the database
      Chats.insert({
        text: msg,
        createdAt: new Date()
      });
    }
  });

  Meteor.publish('messages', function(limits){
    return Chats.find({}, {
      limit: limits,
      sort: { createdAt: -1 }
    });
  });
}
