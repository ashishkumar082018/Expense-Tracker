const User = require("../models/user");
const bcrypt = require("bcrypt");

exports.signUp = async (req, res) => {
  try {
    const name = req.body.name;
    const email = req.body.email;
    const password = req.body.password;
    const saltRounds = 10;
    const hash = await bcrypt.hash(password, saltRounds);

    // Check if a user with the provided email already exists
    const existingUser = await User.findOne({
      where: { email: email },
    });

    // If user already exists, return an error
    if (existingUser) {
      return res.status(400).json({ error: "Email already in use" });
    }

    //if user don't exists then create an new user
    const result = await User.create({
      name: name,
      email: email,
      password: hash,
    });
    res.status(201).json(result);
  } catch (error) {
    console.error(error);
  }
};

exports.logIn = async (req, res) => {
  try {
    const email = req.body.email;
    const password = req.body.password;
    const findEmail = await User.findOne({ where: { email: email } });
    if (!findEmail) {
      return res.status(404).json({ message: "User not found" });
    }
    const comparePass = await bcrypt.compare(password, findEmail.password);
    if (!comparePass) {
      return res.status(401).json({ message: "User not authorized" });
    }
    res.status(200).json(findEmail);
  } catch (error) {
    res.status(500).json({ message: "User login successful" });
  }
};
