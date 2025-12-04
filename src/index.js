const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const ObjectId = mongoose.Types.ObjectId;
const token = "dummy-token";

const User = require('./models/User');
const Exercise = require('./models/Exercise');

require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

// ---------- ROUTES EXERCISES  ----------
app.get('/exercises', async (req, res) => {
  try {
    const exercises = await Exercise.find();
    res.json(exercises);
  } catch (err) {
    res.status(500).json({ message: "Error al obtener ejercicios" });
  }
});

app.post('/exercises', async (req, res) => {
  try {
    const exercise = new Exercise(req.body);
    await exercise.save();
    res.json(exercise);
  } catch (err) {
    res.status(500).json({ message: "Error al crear ejercicio" });
  }
});

app.put('/exercises/:id', async (req, res) => {
  try {
    const updated = await Exercise.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ message: "Ejercicio no encontrado" });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: "Error al actualizar ejercicio" });
  }
});

app.delete('/exercises/:id', async (req, res) => {
  try {
    const id = req.params.id.trim();
    if (!ObjectId.isValid(id)) return res.status(400).json({ message: "ID inválido" });
    const result = await Exercise.findByIdAndDelete(id);
    if (!result) return res.status(404).json({ message: "Ejercicio no encontrado" });
    res.json({ message: 'Deleted', result });
  } catch (err) {
    res.status(500).json({ message: "Error al eliminar ejercicio" });
  }
});

// ----------- AUTH ROUTES -------------

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
      token,
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

app.listen(process.env.PORT || 3000, "0.0.0.0", () => {
  console.log("API running on port", process.env.PORT || 3000);
});
