const express = require('express');
const connectDatabase = require('./config/db');
const Aluno = require('./models/aluno');


const app = express();
const PORT = 1234;

app.use(express.json());

app.get('/', (req, res) => {
    res.json({ message: 'teste' });
});

app.get('/alunos', async (req, res) => {
    try {
        const alunos = await Aluno.find();
        res.status(200).json(alunos);
    }
    catch (error) {
        res.status(500).json({ message: 'Erro ao buscar alunos', error });
    }
});

app.post('/alunos', async (req, res) => {
    try {
        const aluno = new Aluno(req.body);
        await aluno.save();
        res.status(201).json(aluno);
    }
    catch (error) {
        res.status(500).json({ message: 'Erro ao criar aluno', error });
    }
});

connectDatabase().then(() => {
    app.listen(PORT, () => {
        console.log(`Servidor rodando na porta ${PORT}`);
    });
}).catch((error) => {
    console.error('Erro ao conectar ao banco', error);
});

module.exports = app;