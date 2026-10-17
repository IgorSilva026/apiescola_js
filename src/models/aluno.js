const mongoose = require('mongoose');

const alunoSchema = new mongoose.Schema({
    nome: {
        type: String,
        required: true
    },
    ra: {
        type: Number,
        required: true,
        unique: true
    },
    curso: {
        type: String,
        required: true
    },
    turma: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model('Aluno', alunoSchema);