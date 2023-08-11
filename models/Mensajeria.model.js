const mongoose = require("mongoose");

// TODO: Please make sure you edit the User model to whatever makes sense in this case
const mensajeriaSchema = new Schema({
  usuarioCreador: {
    type: Schema.Types.ObjectId,
    ref: "Usuario",
  },

  usuarioBeneficiario: {
    type: Schema.Types.ObjectId,
    ref: "Usuario",
  },

  mensaje: {
    type: String,
    required: true,
  },

  nombreServicio: [
    {
      type: Schema.Types.ObjectId,
      ref: "Solicitud",
    },
  ],
});

const Mensajeria = mongoose.model("Mensajeria", mensajeriaSchema);

module.exports = Mensajeria;
