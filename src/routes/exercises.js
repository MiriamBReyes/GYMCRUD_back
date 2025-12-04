// backend/src/routes/exercise.js
const express = require("express");
const router = express.Router();
const Exercise = require("../models/Exercise");

// Obtener todos los ejercicios
router.get("/", async (req, res) => {
  try {
    const exercises = await Exercise.find();
    res.json(exercises);
  } catch (err) {
    res.status(500).json({ error: "Error al obtener ejercicios" });
  }
});

// Crear un ejercicio
router.post("/", async (req, res) => {
  try {
    const { name, muscle, reps, weight } = req.body;

    const exercise = new Exercise({
      name,
      muscle,
      reps,
      weight
    });

    await exercise.save();
    res.json(exercise);

  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Error al crear ejercicio" });
  }
});

// Editar ejercicio
router.put("/:id", async (req, res) => {
  try {
    const { name, muscle, reps, weight } = req.body;

    const exercise = await Exercise.findByIdAndUpdate(
      req.params.id,
      { name, muscle, reps, weight },
      { new: true }
    );

    res.json(exercise);

  } catch (error) {
    res.status(500).json({ error: "Error al editar ejercicio" });
  }
});

// Eliminar ejercicio
router.delete("/:id", async (req, res) => {
  try {
    await Exercise.findByIdAndDelete(req.params.id);
    res.json({ message: "Ejercicio eliminado" });
  } catch (error) {
    res.status(500).json({ error: "Error al eliminar ejercicio" });
  }
});

module.exports = router;
