const mongoSanitize = require('mongo-sanitize');
const   { sendMail } = require('./mailer');

//*Sanitizing the URL elements
exports.urlSanitizer = function (req, res, next) {
  if(req.params.id)
    req.params.id = req.sanitize(mongoSanitize(req.params.id));
  if(req.params.inviteId)
    req.params.inviteId = req.sanitize(mongoSanitize(req.params.inviteId));
  next();
};

exports.userUrlAuth = function (req, res, next) {
  //* Check id of user and parameter matches
  if (req.user.id === req.params.id) req.userUrl = true;
  else req.userUrl = false;
  next();
};

//Notification Creator
exports.addNotifications = function (from, to,  request, title, response = '') {
  let notification = '';
  let subject;
  if(request === 'invite') {
    notification = `${from} invited you to ${title}.`;
    subject = `You have a new invite from ${from}`;
  } else if(request == 'response') {
    notification = `${from} ${response} your invite for ${title}.`;
    subject = `${from} responded to your invite`;
  }
  sendMail(subject, notification, to);
  return notification;
};

//Data Sanitizer
exports.dataSanitizer = function (data, sanitize) {
  data.title = sanitize(mongoSanitize(data.title));
  data.description = sanitize(mongoSanitize(data.description));
  data.time = sanitize(mongoSanitize(data.time));
  data.deadline = sanitize(mongoSanitize(data.deadline));
  data.duration = sanitize(mongoSanitize(data.duration));
  data.people = sanitize(mongoSanitize(data.people));
  data.food = sanitize(mongoSanitize(data.food));
  data.private.private = sanitize(mongoSanitize(data.private.private));
  data.private.year = sanitize(mongoSanitize(data.private.year));
  data.private.dept = sanitize(mongoSanitize(data.private.dept));
  data.elements.forEach(element => {
    element.type = sanitize(mongoSanitize(element.type));
    if(element.type === 'Text') {
      element.text = sanitize(mongoSanitize(element.text));
      element.color = sanitize(mongoSanitize(element.color));
      element.size = sanitize(mongoSanitize(element.size));
      element.font = sanitize(mongoSanitize(element.font));
    } else {
      element.src = sanitize(mongoSanitize(element.src));
    }
  });
  return data;
};

