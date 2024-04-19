const User = require('../models/user');

exports.signUp = async (req, res) =>{
    try {
        const name = req.body.name;
        const email = req.body.email;
        const password = req.body.password;

        // Check if a user with the provided email already exists
        const existingUser = await User.findOne({
            where: { email: email },
          });
          
        // If user already exists, return an error
        if (existingUser) {
            return res.status(400).json({ error: 'Email already in use' });
          }
          
          //if user don't exists then create an new user
        const result = await User.create({
            name: name,
            email: email,
            password: password
        })
        res.status(201).json(result);
    }
    catch (error) {
        console.error(error);
    }
}