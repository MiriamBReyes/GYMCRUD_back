// backend/src/routes/auth.js
const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

router.post('/register', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password)
      return res.status(400).json({ message: "Email y password requeridos" });

    const existing = await User.findOne({ email });
    if (existing)
      return res.status(400).json({ message: "Usuario ya existe" });

    const hashed = await bcrypt.hash(password, 10);

    const user = new User({ email, password: hashed });
    await user.save();

    res.json({ message: "Usuario creado correctamente" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error en servidor" });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user)
      return res.status(400).json({ message: "Credenciales incorrectas" });

    const valid = await bcrypt.compare(password, user.password);
    if (!valid)
      return res.status(400).json({ message: "Credenciales incorrectas" });

    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({ token });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error en servidor" });
  }
});

module.exports = router;
