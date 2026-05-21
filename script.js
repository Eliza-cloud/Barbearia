document.getElementById('formAgendamento').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const feedback = document.getElementById('feedback');
    feedback.className = 'message'; // Reseta classes de erro/sucesso
    
    // Captura dos dados do formulário
    const dados = {
        nome_cliente: document.getElementById('nome_cliente').value.trim(),
        telefone_cliente: document.getElementById('telefone_cliente').value.trim(),
        email_cliente: document.getElementById('email_cliente').value.trim(),
        data_agendamento: document.getElementById('data_agendamento').value,
        hora_agendamento: document.getElementById('hora_agendamento').value,
        servico_desejado: document.getElementById('servico_desejado').value
    };

    // Validação Frontend (Todos os campos obrigatórios)
    if (Object.values(dados).some(valor => !valor)) {
        feedback.textContent = 'Por favor, preencha todos os campos obrigatórios.';
        feedback.classList.add('error');
        return;
    }

    try {
        // Envio dos dados para o backend Node.js
        const response = await fetch('http://localhost:3000/api/agendamentos', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(dados)
        });

        const resultado = await response.json();

        if (response.ok) {
            feedback.textContent = 'Agendamento realizado com sucesso!';
            feedback.classList.add('success');
            document.getElementById('formAgendamento').reset(); // Limpa o formulário
        } else {
            feedback.textContent = resultado.erro || 'Erro ao processar agendamento.';
            feedback.classList.add('error');
        }
    } catch (error) {
        feedback.textContent = 'Erro ao conectar-se com o servidor.';
        feedback.classList.add('error');
    }
});