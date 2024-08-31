const { User } = require('../model/User');
const { sanitizeUser } = require('../services/common');
const SECRET_KEY = 'SECRET_KEY';
const jwt = require('jsonwebtoken');

// exports.createUser = async (req, res) => {
//   try {
//     const salt = crypto.randomBytes(16);
//     console.log("*******************"+typeof(salt))
//     crypto.pbkdf2(
//       req.body.password, //The password to be hashed
//       salt,
//       310000,
//       32,
//       'sha256',
//       async function (err, hashedPassword) { //The last parameter is a callback function that will be called once the hashing is 
//         //complete. It takes two parameters: err and hashedPassword.
//         const user = new User({ ...req.body, password: hashedPassword, salt:salt });
//         console.log("new user is:  "+user)
//         const doc = await user.save();


//         //after adding user to the DB, we create a session for user
//         req.login(sanitizeUser(doc), (err) => { //this sanitizeUser has nothing to do with passport.sanitize()
//           //The user object representing the authenticated user, we dont pass entire user just the santized version
//           if (err) {
//             res.status(400).json(err);
//           } else {
//             const token = jwt.sign(sanitizeUser(doc), SECRET_KEY);
//             res
//               .cookie('jwt', token, {
//                 expires: new Date(Date.now() + 3600000),
//                 httpOnly: true,
//               })
//               .status(201)
//               .json({ id: doc.id, role: doc.role });
//           }
//         });
//       }
//     );
//   } catch (err) {
//     res.status(400).json(err);
//   }
// };
// while creating a new user, we first add it to the DB, then create a session for it where we create a jwt token & set it as a cookie

exports.createUser = async (req, res) => {
  try {
    const data = req.body 
    const newPerson = new User(data);
    const doc = await newPerson.save();
    console.log('user succesfully registered');

    //after adding user to the DB, we create a session for user
    req.login(sanitizeUser(doc), (err) => { //this sanitizeUser has nothing to do with passport.serialize()
      //The user object representing the authenticated user, we dont pass entire user just the santized version
      if (err) {
        res.status(400).json(err);
      } else {
        const token = jwt.sign(sanitizeUser(doc), SECRET_KEY);
        res
          .cookie('jwt', token, {
            expires: new Date(Date.now() + 3600000),
            httpOnly: true,
          })
          .status(201)
          .json({ id: doc.id, role: doc.role });
      }
    });
  } catch (err) {
    res.status(400).json(err);
  }
};
// while creating a new user, we first add it to the DB, then create a session for it where we create a jwt token & set it as a cookie


exports.loginUser = async (req, res) => {
  const user = req.user
  //When a user tries to login, Local Strategy is implemented. Then Passport calls serialization to create a session. 
  //After serialization, Passport creates user object on the request object (req.user), which is fetched by loginUser and 
  //all other protected routes
  res
    .cookie('jwt', user.token, {
      expires: new Date(Date.now() + 3600000),
      httpOnly: true,
    })
    .status(201)
    .json({ id: user.id, role: user.role });
};

exports.logout = async (req, res) => {
  res
    .cookie('jwt', null, {
      expires: new Date(Date.now()),
      httpOnly: true,
    })
    .sendStatus(200)
};

exports.checkAuth = async (req, res) => {
  //this route is used to check for req.user for frontend protected routes
  if (req.user) {
    res.json(req.user);
  } else {
    res.sendStatus(401);
  }
};
 