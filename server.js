const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());

// Caminho onde o arquivo do banco SQLite será salvo/criado
const dbPath = path.resolve(__dirname, 'barbearia.db');

// Conecta ou cria o arquivo do banco de dados local
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Erro ao abrir o banco de dados SQLite:', err.message);
    } else {
        console.log('Conectado ao banco de dados SQLite local (barbearia.db).');
        // Cria a tabela automaticamente se ela não existir
        db.run(`
            CREATE TABLE IF NOT EXISTS agendamentos (
                id_cliente INTEGER PRIMARY KEY AUTOINCREMENT,
                nome_cliente TEXT NOT NULL,
                telefone_cliente TEXT NOT NULL,
                email_cliente TEXT NOT NULL,
                data_agendamento TEXT NOT NULL,
                hora_agendamento TEXT NOT NULL,
                servico_desejado TEXT NOT NULL
            )
        `);
    }
});

// Rota POST para receber o formulário da SPA
app.post('/api/agendamentos', (req, res) => {
    const { nome_cliente, telefone_cliente, email_cliente, data_agendamento, hora_agendamento, servico_desejado } = req.body;

    // Validação de segurança no lado do servidor
    if (!nome_cliente || !telefone_cliente || !email_cliente || !data_agendamento || !hora_agendamento || !servico_desejado) {
        return res.status(400).json({ erro: 'Todos os campos são obrigatórios.' });
    }

    const query = `
        INSERT INTO agendamentos (nome_cliente, telefone_cliente, email_cliente, data_agendamento, hora_agendamento, servico_desejado)
        VALUES (?, ?, ?, ?, ?, ?)
    `;

    db.run(query, [nome_cliente, telefone_cliente, email_cliente, data_agendamento, hora_agendamento, servico_desejado], function(err) {
        if (err) {
            console.error('Erro ao salvar no SQLite:', err.message);
            return res.status(500).json({ erro: 'Erro interno ao salvar o agendamento.' });
        }
        // Retorna o sucesso e o ID gerado automaticamente
        return res.status(201).json({ mensagem: 'Sucesso!', id_cliente: this.lastID });
    });
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});