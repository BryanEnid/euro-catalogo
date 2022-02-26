const express = require("express");
const router = express.Router();
const { save, read } = require("./db");
const { generatePDF } = require("./generatepdf");

// Guarda base de datos
router.post("/save", save);

// Lee base de datos
router.get("/load", read);

// Generar PDF
router.get("/generatePDF", generatePDF);

module.exports = router;
