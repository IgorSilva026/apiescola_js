const express = require('express');
const mongoose = require('mongoose');
const connectDatabase = require('./config/db');
const Aluno = require('./models/aluno');

const app = express();
const PORT = 1234;

app.use(express.json());


function validarId(req, res, next) {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        return res.status(400).json({ mensagem: 'ID inválido.' });
    }
    next();
}

app.get('/', (req, res) => {
    res.json({ mensagem: 'API de alunos funcionando' });
});


app.get('/alunos', async (req, res) => {
    try {
        const alunos = await Aluno.find();
        res.status(200).json(alunos);
    } catch (error) {
        res.status(500).json({
            mensagem: 'Erro ao buscar alunos.',
            erro: error.message,
        });
    }
});


app.get('/alunos/:id', validarId, async (req, res) => {
    try {
        const aluno = await Aluno.findById(req.params.id);

        if (!aluno) {
            return res.status(404).json({ mensagem: 'Aluno não encontrado.' });
        }

        res.status(200).json(aluno);
    } catch (error) {
        res.status(500).json({
            mensagem: 'Erro ao buscar aluno.',
            erro: error.message,
        });
    }
});


app.post('/alunos', async (req, res) => {
    try {
        const { nome, curso, turma, ra } = req.body;

        if (!nome || !curso || !turma || !ra) {
            return res.status(400).json({
                mensagem: 'Os campos nome, curso, turma e ra são obrigatórios.',
            });
        }

        const novoAluno = await Aluno.create({ nome, curso, turma, ra });
        res.status(201).json(novoAluno);
    } catch (error) {
        const status = error.name === 'ValidationError' ? 400 : 500;
        res.status(status).json({
            mensagem: 'Erro ao cadastrar aluno.',
            erro: error.message,
        });
    }
});

app.put('/alunos', async (req, res) => {
    try {
        const { _id: id, nome, curso, turma, ra } = req.body;

        if (!id || !nome || !curso || !turma || !ra) {
            return res.status(400).json({
                mensagem: 'Os campos _id, nome, curso, turma e ra são obrigatórios.',
            });
        }

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ mensagem: 'ID inválido.' });
        }

        const alunoAtualizado = await Aluno.findByIdAndUpdate(
            id,
            { nome, curso, turma, ra },
            { new: true, runValidators: true }
        );

        if (!alunoAtualizado) {
            return res.status(404).json({ mensagem: 'Aluno não encontrado.' });
        }

        res.status(200).json(alunoAtualizado);
    } catch (error) {
        const status = error.name === 'ValidationError' ? 400 : 500;
        res.status(status).json({
            mensagem: 'Erro ao atualizar aluno.',
            erro: error.message,
        });
    }
});

app.delete('/alunos/:id', validarId, async (req, res) => {
    try {
        const alunoRemovido = await Aluno.findByIdAndDelete(req.params.id);

        if (!alunoRemovido) {
            return res.status(404).json({ mensagem: 'Aluno não encontrado.' });
        }

        res.status(200).json({ mensagem: 'Aluno removido com sucesso.' });
    } catch (error) {
        res.status(500).json({
            mensagem: 'Erro ao remover aluno.',
            erro: error.message,
        });
    }
});


app.use((error, req, res, next) => {
    if (error instanceof SyntaxError && error.status === 400 && 'body' in error) {
        return res.status(400).json({ mensagem: 'JSON inválido no corpo da requisição.' });
    }
    next(error);
});

connectDatabase()
    .then(() => {
        app.listen(PORT, () => {
            console.log(`Servidor rodando na porta ${PORT}`);
        });
    })
    .catch((error) => {
        console.error('Erro ao conectar ao banco:', error.message);
    });

module.exports = app;