module.exports = {
  ensureAuthenticated: (req, res, next) => {
    if(req.isAuthenticated()) return next();
    else {
      req.session.wrongMsg = 'auth';
      res.redirect('http://localhost:3000/user/login');
    }
  }
};