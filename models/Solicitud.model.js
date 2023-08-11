const mongoose = require("mongoose");

// TODO: Please make sure you edit the User model to whatever makes sense in this case
const solicitudSchema = new Schema(
  {
    titulo: {
      type: String,
      required: true,
    },

    descripcion: {
      type: String,
      required: true,
    },

    categoria: {
      enum: [
        "bricolaje",
        "cuidados",
        "mascotas",
        "transporte",
        "alimentacion",
        "otros",
      ],
      default: ["otros"],
    },

    imagen: {
      type: String,
    },

    fechaServicio: {
      type: Date,
      required: true,
    },

    usuarioCreador: {
      type: Schema.Types.ObjectId,
      ref: "Usuario",
    },

    usuarioBeneficiario: {
      type: Schema.Types.ObjectId,
      ref: "Usuario",
    },

    estado: {
      enum: ["pendiente", "en progreso", "completado"],
      default: ["pendiente"],
    },

    valoracion: {
      type: string,
    },
  },

  {
    timestamps: true,
  }
);

const Solicitud = mongoose.model("Solicitud", solicitudSchema);

module.exports = Solicitud;
