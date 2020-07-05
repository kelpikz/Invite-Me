const express = require("express"),
  router = express.Router({ mergeParams: true }), //!IMPORTANT
  { ensureAuthenticated } = require("../config/auth"),
  {urlSanitizer, userUrlAuth, addNotifications, dataSanitizer } = require('../config/middlewares'),
  User = require("../models/user"),
  Invitation = require("../models/invitaion");
require("../config/db");


//! NEW ROUTE
router.get("/new", urlSanitizer, ensureAuthenticated, userUrlAuth , (req, res) => {
  //* Validate User
  if(!req.userUrl) {
    res.redirect(`./${req.user.id}/invitation/new`, 401);
    return;
  }
  //* New invitation page
  res.render("invitation/new");
});

//! CREATE ROUTE
router.post("/", urlSanitizer, async (req, res) => {

  req.body = dataSanitizer(req.body, req.sanitize);
  try {
    //* Creating new invitation
    let creator = await User.findById(req.user.id); // Finding the user who created this invite
    let invite = await Invitation.create(req.body); // Creatring the invite
    invite.creator = creator; // Saving creator credentials to the invite and vice-versa
    invite.acceptees.push(creator);
    creator.events.push(invite);
    invite = await invite.save();
    creator = await creator.save();
    //* Add the invite to user invitations
    if(!invite.private.private) {
      let users = await User.find();
      users.forEach(async user => {
        if(!creator._id.equals(user._id)){
          user.notifications.push(addNotifications(creator.username, user.email, 'invite', invite.title));
          user.invitation.push(invite);
        }
          user = await user.save();
      });
    } else {
      if(invite.private.year !== 0 || invite.private.dept !== '0'){
        //* Creaing queries for finding users
        parameters = new Object({});
        if(invite.private.year !== 0) parameters.year = invite.private.year;
        if(invite.private.dept !== '0') parameters.dept = invite.private.dept;
        console.log(parameters);
        let users = await User.find(parameters);
        users.forEach(async user => {
          if(!creator._id.equals(user._id)){
            user.notifications.push(addNotifications(creator.username, user.email, 'invite', invite.title));
            user.invitation.push(invite);
          }
            user = await user.save();
        });
      }
    }
    res.send(invite._id);
  } catch (err) {
    console.log(err);
    res.status(400).send("something went wrong");
  }
});

//! SHOW ROUTE
router.get("/:inviteId", urlSanitizer, ensureAuthenticated, userUrlAuth,async (req, res) => {
  //* Validate User
  if(!req.userUrl) {
    res.redirect(`http://localhost:3000/user/${req.user.id}/invitation/${req.params.inviteId}`, 401);
    return;
  }
  try {
    //Wrong URL
    if (req.params.inviteId.length !== 24) {
      res.status(404).render('./errors/404');
      return;
    }
    let user = await User.findById(req.params.id);
    //find the required event
    let invite = await Invitation.findById(req.params.inviteId);
    if (!invite) {
      //If no event exist, 404 status
      res.status(404).render('./errors/404');
      return;
    }
    //Populating the username field of the creator
    invite = await (await (await 
      invite
        .execPopulate("creator", "username"))  //Creator cretentials to show everyone
          .execPopulate('acceptees', 'username year dept')) //acceptees => creator and other acceptees before event begins
            .execPopulate('attendees', 'username year dept'); //When event is happening

    //Checks if user is the creator
    invite.isCreator = false;
    // Check if the user is the creator of that event
    if (user._id.equals(invite.creator._id)) invite.isCreator = true;

    //Checking if the person is an acceptee
    invite.isAcceptee = false;
    if (!invite.isCreator) {
      invite.acceptees.forEach(acceptee => {
        if(acceptee._id.equals(user._id)) {
          invite.isAcceptee = true;
          invite.visitor = user.username;
        }
      });
    }

    //Check if the deadline is up
    if (new Date().getTime() > invite.deadline.getTime())
      invite.deadlineOver = true;
    else invite.deadlineOver = false;


    //Check if the event is over
    if (new Date().getTime() > invite.duration.getTime())
      invite.eventeOver = true;
    else invite.eventeOver = false;

    //Checking Population
    invite.population = invite.acceptees.length;
    if (invite.population < invite.people)
      invite.populationLimitReached = false;
    else invite.populationLimitReached = true;

    //Check if the event ig going on
    if ((new Date().getTime() > invite.time.getTime()) && (new Date().getTime() < invite.duration.getTime())){
      invite.happening = true;
      invite.acceptees.push(user);
      await invite.save();
    }
    else invite.happening = false;

    res.render("invitation/show", { invite });
  } catch (err) {
    console.log(err);
    res.status(500).send("Something went wrong. Try again Later");
  }
});


//* For accepting / declining the invite
router.put("/:inviteId", urlSanitizer, async (req, res) => {
  try {
    let i = -1;
    let user = await User.findById(req.params.id);
    let invite = await Invitation.findById(req.params.inviteId);
    if (req.body.response === "accept") {
      //*Check if the user is already an acceptee => to prevent exploitation
      invite.acceptees.forEach((acceptorId) => {
        if (acceptorId._id.toString() === user._id.toString()) i = 1;
      });
      //*If accept and not an acceptee already
      if (i === -1) {
        invite.acceptees.push(user);  //Adding user to the acceptee list of the the invite
        user.attending.push(invite);  //Adding invite to attending list of the user
        let creator = await User.findById(invite.creator._id, 'notifications');  //Creating notification for the creator
        creator.notifications.push(addNotifications(user.username, creator.email, 'response', invite.title, 'accepted'));
        creator = await creator.save();
        invite = await invite.save();
        user = await user.save();
      }
      i = -1;
    } else if(req.body.response === 'decline') {
      let creator = await User.findById(invite.creator._id, 'notifications'); //Creating notification for the user
      creator.notifications.push(addNotifications(user.username, creator.email, 'response', invite.title, 'declined'));
      creator = await creator.save();
    }
    //*Remove invitation from user if its present
    for (let index = 0; index < user.invitation.length; index++) {
      //Check if invitation is present in user
      if (invite._id.toString() === user.invitation[index]._id.toString())
        i = index;
    }
    if (i !== -1) user.invitation.splice(i, 1); //removing invite from the user
    user = await user.save();
    res.send("updated!");
  } catch (err) {
    console.log(err);
    res.status(500).send("Something went wrong. Try again Later");
  }
});



module.exports = router;