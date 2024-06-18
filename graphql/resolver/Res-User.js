const bcrypt = require('bcryptjs')
const User = require('../../models/user.js')
const jwt = require("jsonwebtoken")
require("dotenv").config

// exporting user Mutations
module.exports = {

    // mutations

    createUser: async (args) => {
        try {
            const existinguser = await User.findOne({ email: args.userInput.email });
            if (!existinguser) {
                const hashedpassword = await bcrypt.hash(args.userInput.password, 10)
                const newuser = new User({
                    email: args.userInput.email,
                    password: hashedpassword
                })

                const result = await newuser.save();

                // here i am explicitly returning password as null so in this way otherwise just return user;
                return {
                    ...result._doc,
                    password: null,
                }
            } else {
                throw new Error("User exists already");
            }
        } catch (error) {
            throw new Error(error.message);
        }
    },

    login: async ({email, password}) => {
        try {
            if(!email || !password) throw new Error("Please enter  valid credentials");

            const user = await User.findOne({ email: email});
            if(!user) throw new Error("User not found");

            const isequal =  await bcrypt.compare(password, user.password);
            if(!isequal) throw new Error("Please enter correct password");

            const token = jwt.sign({userId: user.id, email: user.email},process.env.SECRET_KEY,{
                expiresIn:'1h'
            });

            return {
                userId:user.id,
                token:token,
                tokenExpiration:1
            }

        } catch (error) {
            throw new Error(error.message);
        }
    }
}; 