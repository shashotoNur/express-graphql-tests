const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("../../models/userModel.js");
const jwtSecret = process.env.JWT_SECRET;

const loginUser = async (args) =>
  {
    var { email, password } = args;

    if(email && password)
    {
      try
      {
        var user = await User.findOne({ email });
        if (!user) return { status: 'User does not exists' };

        const validCreds = await bcrypt.compare(password, user.password);
        if (!validCreds) return { status: 'Invalid credentials' };

        const threeDays = (3 * 24 * 60 * 60);
        const token = jwt.sign({ id: user._id }, jwtSecret, { expiresIn: threeDays });
        if (!token) return { status: "Couldn't sign the token" };

        user = { name: user.name, token, status: `Login successful!` }
        return user;
      }
      catch (err) { return { status: err.message }; };
    }

    else return { status: 'Invalid login arguments' };
  };


const createUser = async (args) =>
  {
    const { name, email, password } = args;

    if(email && password && name)
    {
      try
      {
        const user = await User.findOne({ email });
        if (user) return { status: 'User already exists' };

        const salt = await bcrypt.genSalt(10);
        if (!salt) return { status: 'Something went wrong with bcrypt' };

        const hash = await bcrypt.hash(password, salt);
        if (!hash) return { status: 'Something went wrong hashing the password' };

        var newUser = new User( { name, email, password: hash } );

        var savedUser = await newUser.save();
        if (!savedUser) return { status: 'Something went wrong saving the user' };

        const threeDays = (3 * 24 * 60 * 60);
        const token = jwt.sign({ id: savedUser._id }, jwtSecret, { expiresIn: threeDays });
        if (!token) return { status: "Couldn't sign the token" };

        savedUser = { name: savedUser.name, token, status: `SignUp successful!` }
        return savedUser;
      }
      catch (err) { return { status: err.message }; };
    }

    else return { status: 'Invalid signup arguments' };
  };

const deleteUser = async (context) =>
  {
    try
    {
        const { user } = context;

        if(!user) return { status: "Request unauthorized!" };
        if(user.status) return user;
  
        const id = user.id;
        await User.findByIdAndDelete(id);
  
        return { status: 'User deleted successfully!' };
    }
    catch (err) { return { status: err.message }; };
  };

module.exports = { loginUser, createUser, deleteUser };