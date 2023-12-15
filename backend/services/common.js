const passport = require('passport');

exports.isAuth = (req, res, done) => {
  return passport.authenticate('jwt');
};

exports.sanitizeUser = (user) => {
  return { id: user.id, role: user.role };
};

exports.cookieExtractor = function (req) {
  let token = null;
  if (req && req.cookies) {
    token = req.cookies['jwt'];
  }
  //TODO : this is temporary token for testing without cookie
  // token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY0NTdlZTg1ZTZmZmRiOGM5MDI2NTM3NiIsInJvbGUiOiJ1c2VyIiwiaWF0IjoxNjgzNjQ3NTgwfQ.KzUVWb-AowMJicigDGruC2VJPc3-Z92IE37BnCpwI_c"
  // token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY1N2IzZjg3YWEzZDVlMGZkMzY2MGQzZiIsInJvbGUiOiJ1c2VyIiwiaWF0IjoxNzAyNjUzODM3fQ.FcYx7WAP1F8xw-S5S8aFT6dUze8qLjuXXhT4luZktlw"
  // token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY1N2M2M2E2ZjJmNTBhZTlmOWRjZDYwYiIsInJvbGUiOiJhZG1pbiIsImlhdCI6MTcwMjY2ODE0NH0.m-442xUP5HXIhcjoiLD6Rrtru5vkS1DsEgVeSbILjpE"

  return token;
};
