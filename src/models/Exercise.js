const mongoose = require('mongoose');

const ExerciseSchema = new mongoose.Schema({
  name: String,
  muscle: String,
  reps: Number,
  weight: Number
});

module.exports = mongoose.model('Exercise', ExerciseSchema);
