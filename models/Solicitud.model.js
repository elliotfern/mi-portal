const { Schema, model } = require("mongoose");

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
      type: String,
      enum: [
        "bricolaje",
        "cuidados",
        "mascotas",
        "transporte",
        "alimentacion",
        "otros",
      ],
      default: "otros",
    },

    imagenSolicitud: {
      type: String,
      default: "https://res.cloudinary.com/drwwdhhgc/image/upload/v1692260685/fotos-de-perfiles/vwa26nkheoyrqmrtaf1f.jpg"
    },

    fechaServicio: {
      type: Date,
      // required: true,
    },

    usuarioCreador: {
      type: Schema.Types.ObjectId,
      ref: "Usuario",
    },

    // no tocar nunca jamás
    usuarioPrestante: {
      type: Schema.Types.ObjectId,
      ref: "Usuario",
    },

    estado: {
      type: String,
      enum: ["pendiente", "en progreso", "completado"],
      default: "pendiente",
    },

    valoracion: {
      type: String,
    },
  },

  {
    timestamps: true,
  }
);

const Solicitud = model("Solicitud", solicitudSchema);

module.exports = Solicitud;
