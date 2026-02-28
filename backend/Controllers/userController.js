const User = require("../Models/User");

exports.createUser = async (req, res) => {
  try {
    const { name, email, amount } = req.body;

    const user = await User.create({
      name,
      email,
      amount,
    });

    res.status(201).json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getUsers = async (req, res) => {
  const users = await User.find();
  res.json(users);
};

exports.getUserById = async (req, res) => {
  const user = await User.findById(req.params.id);
  res.json(user);
};