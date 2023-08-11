const mongoose = require("mongoose");

// TODO: Please make sure you edit the User model to whatever makes sense in this case
const usuarioSchema = new Schema({
  usuario: {
    type: String,
    trim: true,
    required: true,
    unique: true,
  },

  correo: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },

  password: {
    type: String,
    required: true,
  },

  nombreCompleto: {
    type: String,
  },

  rol: {
    enum: ["admin", "user", "mod"],
    default: "user",
  },

  telefono: {
    type: String,
  },

  direccion: {
    type: String,
  },

  imagen: {
    type: String,
  },

  favoritos: [
    {
      type: Schema.Types.ObjectId,
      ref: "Usuario",
    },
  ],
});

const Usuario = mongoose.model("Usuario", usuarioSchema);

module.exports = Usuario;
