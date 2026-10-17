const mongoose = require('mongoose');


const MONGO_URL = 'mongodb+srv://igorssilva026_db_user:n3BBetQp5YXff0ok@cluster0.hsdfx9f.mongodb.net/?appName=Cluster0';

async function connectDatabase() {
    await mongoose.connect(MONGO_URL, { dbName: 'alunos' });
    console.log('MongoDB conectado com sucesso');
}

module.exports = connectDatabase;