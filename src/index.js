const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}


const app = express();
app.use(cors());
app.use(express.json());

// IMPORTAR RUTAS
const exerciseRoutes = require('./routes/exercises');

// USAR RUTAS
app.use('/exercises', exerciseRoutes);

// AUTH ROUTES
const User = require('./models/User');

// REGISTER
app.post('/auth/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ message: "El usuario ya existe" });

    const newUser = new User({ name, email, password });
    await newUser.save();

    res.json({ message: "Usuario registrado", user: newUser });

  } catch (error) {
    res.status(500).json({ message: "Error en el servidor" });
  }
});

// LOGIN
app.post('/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) return res.status(404).json({ message: "Usuario no encontrado" });
    if (user.password !== password) return res.status(400).json({ message: "Contraseña incorrecta" });

    res.json({
      message: "Login correcto",
      token: "dummy-token",
      user: {
        id: user._id,
        name: user.name,
        email: user.email
      }
    });

  } catch (error) {
    res.status(500).json({ message: "Error en el servidor" });
  }
});

// ---------- CONNECT MONGO -----------
mongoose.connect(process.env.MONGO_URL)
  .then(() => console.log("MongoDB conectado"))
  .catch(err => console.error(err));

app.listen(process.env.PORT || 3000, "0.0.0.0", () =>
  console.log("API running on port", process.env.PORT || 3000)
);
