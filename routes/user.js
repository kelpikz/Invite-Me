const express = require("express"),
  router = express.Router({ mergeParams: true }), //!IMPORTANT
  { ensureAuthenticated } = require("../config/auth"),
  { sendMail } = require('../config/mailer'),
  {urlSanitizer, userUrlAuth} = require('../config/middlewares'),
  User = require("../models/user"),
  mongoSanitize = require('mongo-sanitize'),
  Invitation = require("../models/invitaion");
require("../config/db");

const invitationRoute = require('./invitations.js');
router.use('/:id/invitations?', invitationRoute);

//* USER DASHBOARD
router.get("/:id", urlSanitizer, ensureAuthenticated, userUrlAuth, async (req, res) => {
  //* Validate User
  if(!req.userUrl) {
    res.redirect(`./${req.user.id}`, 401);
    return;
  }
  // For finding the upcoming event
  let {events, attending} = 
    await (await (req.user)
      .execPopulate({
        path : 'events',
        select : 'time title'
      })).execPopulate({
        path : 'attending',
        select : 'time title'
  });
  let myEvent = {time : new Date(3000, 0, 1), title : 'No Events are coming up'};
  let attendingEvent = {time : new Date(3000, 0, 1), title : 'No events are coming up'};
  events.forEach(event => {
    if(event.time.getTime() > Date.now() && event.time.getTime() < myEvent.time.getTime())
      myEvent = event;
  });
  attending.forEach(event => {
    if(event.time.getTime() > Date.now() && event.time.getTime() < attendingEvent.time.getTime())
      attendingEvent = event;
  });
  //* will render the home(DASHBOARD) page
  res.render("./user/dashboard", { 
    user: req.user,
    myEvent : myEvent,
    attendingEvent : attendingEvent
  });
});

//* SENDING ALL OF THE USER'S NOTIFICATIONS
router.get('/:id/notifications', urlSanitizer, userUrlAuth, async (req, res) => {
  let {notifications} = await User.findById(req.user.id, 'notifications');
  if(notifications.length !== 0)  res.json({notifications});
  else res.status(404).send('empty');
});

//* UPDATING USER'S NOTIFICATIONS
router.delete('/:id/notifications', urlSanitizer, userUrlAuth, async (req, res) => {
  let notifMsg = req.sanitize(mongoSanitize(req.body.msg));
  let user = await User.findById(req.user.id, 'notifications');
  user.notifications.splice(user.notifications.indexOf(notifMsg), 1);
  console.log(user.notifications);
  user = user.save();
  res.send('Done');
});


//! INDEX ROUTE - 3 types invitations, attending events, created events
router.get("/:id/:type", urlSanitizer, ensureAuthenticated, userUrlAuth, async (req, res) => {
  try {
    //* Validate User
    if(!req.userUrl) {
      res.redirect(`http://localhost:3000/user/${req.user.id}/events`, 401);
      return;
    }
    //* Find user
    let user = await User.findById(req.params.id);
    let events;

    //* Populate appropriate events
    if(req.params.type ==='events')
      events = (await user.execPopulate('events', 'title description _id elements time deadline')).events;
    if(req.params.type ==='attending')
      events = (await user.execPopulate('attending', 'title description _id elements time deadline')).attending;
    if(req.params.type ==='invitations')
      events = (await user.execPopulate('invitation', 'title description _id elements time deadline')).invitation;
  
    //* Remove events which are over
    events = events.filter(event => event.deadline.getTime() > new Date().getTime());

    events.forEach(event => {
      event.description = (event.description).slice(0,100) + '...';  //Showing only a small portion of descript
    });
    //* Display them
    if(req.params.type ==='events')
      res.render('invitation/index', {invitations : events, type : 'My Events'});
    if(req.params.type ==='attending')
      res.render('invitation/index', {invitations : events, type : 'Attending events'});
    if(req.params.type ==='invitations')
      res.render('invitation/index', {invitations : events, type : 'My Invitations'});
  } catch (err) {
    console.log(err);
    res.status(500).send("Something went wrong. Try again Later");
  }
});


module.exports = router;
