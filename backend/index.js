const express = require('express');
const server = express();
const mongoose = require('mongoose');
const cors = require('cors');
const session = require('express-session');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const cookieParser = require('cookie-parser');
const { createProduct } = require('./controller/Product');
const productsRouter = require('./routes/Products');
const categoriesRouter = require('./routes/Categories');
const brandsRouter = require('./routes/Brands');
const usersRouter = require('./routes/Users');
const authRouter = require('./routes/Auth');
const cartRouter = require('./routes/Cart');
const ordersRouter = require('./routes/Order');
const { User } = require('./model/User');
const { isAuth, sanitizeUser, cookieExtractor } = require('./services/common');
const path = require('path')

const SECRET_KEY = 'SECRET_KEY';

const opts = {};
opts.jwtFromRequest = cookieExtractor;
opts.secretOrKey = SECRET_KEY;

//middlewares

server.use(express.static(path.resolve(__dirname, 'build')))
server.use(cookieParser());
server.use(
  session({
    secret: 'keyboard cat',
    resave: false, // don't save session if unmodified
    saveUninitialized: false, // don't create session until something stored
  })
);
server.use(passport.authenticate('session'));
// server.use(
//   cors({ 
//     exposedHeaders: ['X-Total-Count'],
//   })
// );
server.use(cors({
  origin: 'http://localhost:3000', // Adjust to match your frontend origin
  credentials: true,
  exposedHeaders: ['X-Total-Count']
}));
server.use(express.json()); // to parse req.body
server.use('/products', isAuth(), productsRouter.router);
// we can also use JWT token for client-only auth
server.use('/categories', isAuth(), categoriesRouter.router);
server.use('/brands', isAuth(), brandsRouter.router);
server.use('/users', isAuth(), usersRouter.router);
server.use('/auth', authRouter.router);
server.use('/cart', isAuth(), cartRouter.router);
server.use('/orders', ordersRouter.router);

// Passport Strategies
const comparePassword = require('./model/User')
// passport.use(
//   'local',
//   new LocalStrategy(
//     { usernameField: 'email' },
//     async function (email, password, done) {
//       // by default passport expects username, so we set UsernameFIeld to 'email'
//       try {
//         const user = await User.findOne({ email: email });
//         console.log(email, password, user);
//         if (!user) {
//           return done(null, false, { message: 'invalid credentials' });
//           //first parameter of done: error
//           //second: userData
//           //third: message
//         }

//         crypto.pbkdf2(
//           password,
//           user.salt,
//           310000,
//           32,
//           'sha256',
//           async function (err, hashedPassword) {
//             if (!crypto.timingSafeEqual(user.password, hashedPassword)) {
//               return done(null, false, { message: 'invalid credentials' });
//             }
//             const token = jwt.sign(sanitizeUser(user), SECRET_KEY);
//             done(null, { id: user.id, role: user.role, token });
//             // this lines sends userData to serializer. 
//           }
//         );
//       } catch (err) {
//         done(err);
//       }
//     })
// );
passport.use(
  'local',
  new LocalStrategy(
    { usernameField: 'email' },
    async function (email, password, done) {
      // by default passport expects username, so we set UsernameFIeld to 'email'
      try {
        const user = await User.findOne({ email: email });
        if (!user) {
          return done(null, false, { message: 'invalid credentials' });
          //first parameter of done: error
          //second: userData
          //third: message
        }

        const isPasswordMatch = await user.comparePassword(password)
        if (isPasswordMatch) {
          const token = jwt.sign(sanitizeUser(user), SECRET_KEY);
          // console.log("*******************")
          done(null, { id: user.id, role: user.role, token }); 
          // this lines sends userData to serializer.
        }
        else {
          return done(null, false, { message: 'invalid credentials' })
        }
      } catch (err) {
        done(err);
      }
    })
);

passport.use(
  'jwt',
  new JwtStrategy(opts, async function (jwt_payload, done) {
    //opts is an empty object defined above which contains the token and the secret key which is used by Passport to 
    //extract the userPayload
    //async function to be run for this strategy
    // console.log({ jwt_payload });
    try {
      const user = await User.findById(jwt_payload.id);
      if (user) {
        return done(null, sanitizeUser(user)); // this calls serializer
      } else {
        return done(null, false);  
      }
    } catch (err) {
      return done(err, false);
    }
  })
);

// this creates session variable req.user on being called from callbacks
passport.serializeUser(function (user, cb) { 
  //This is a method provided by Passport.js for serializing users into the session. 
  //Serialization is the process of converting user data into a format that can be stored in the session.
  console.log('serialize', user);
  process.nextTick(function () {
    return cb(null, { id: user.id, role: user.role });
    //cb is a callback function to be run when serialization is complete
    //After successful serialization, this object { id: user.id, role: user.role } is set as req.user by Passport
    //null means no error 
  });
});

// this changes session variable req.user when called from authorized request
passport.deserializeUser(function (user, cb) { //user is the userData to be serialized
  console.log('de-serialize', user);
  process.nextTick(function () {
    return cb(null, user)
  }); 
});


async function main() {
  await mongoose.connect('mongodb+srv://aditya2108raj:9zjxfIgm4QRxNYyX@cluster0.wmaei.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0');
  console.log('database connected');
}
main().catch((err) => console.log(err));

server.listen(8080, () => {
  console.log('server started');
});
