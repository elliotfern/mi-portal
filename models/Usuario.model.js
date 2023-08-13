const { Schema, model } = require("mongoose");

// TODO: Please make sure you edit the User model to whatever makes sense in this case
const usuarioSchema = new Schema({
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
    required: true,
  },

  rol: {
    type: String,
    enum: ["admin", "user", "mod"],
    default: "user",
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

const Usuario = model("Usuario", usuarioSchema);

module.exports = Usuario;
