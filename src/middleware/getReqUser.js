const jwt = require('jsonwebtoken');

const jwtSecret = process.env.JWT_SECRET;
const User = require('../models/userModel');

const getReqUser = async (req, res, next) =>
  {
    const token = req.headers.token;

    if (!token || token == "null" || token == undefined)
    {
      res.locals.user = null;
      next();
    }

    else
    {
      try
      {
        const decodedToken = jwt.verify(token, jwtSecret);
        const id = decodedToken.id;
        
        const user = await User.findOne({ _id: id });
        if (!user) res.locals.user = { status: 'User does not exist' };
        else res.locals.user = user;

        next();
      }
      catch (err) { res.locals.user = { status: 'Token is not valid' }; };
    };
  };

module.exports = { getReqUser };