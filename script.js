let inventory = JSON.parse(localStorage.getItem('inventory')) || [];
let chart; // Variável para armazenar a instância do gráfico

function saveToLocalStorage() {
    localStorage.setItem('inventory', JSON.stringify(inventory));
}

// Inicializa o gráfico
function initializeChart() {
    const ctx = document.getElementById('inventoryChart').getContext('2d');
chart = new Chart(ctx, {
    type: 'doughnut',
    data: {
        labels: inventory.map(item => item.nome),
        datasets: [{
            label: 'Quantidade em Estoque',
            data: inventory.map(item => item.quantidade),
            backgroundColor: inventory.map((_, i) => `hsl(${i * 36}, 100%, 50%)`),
            borderColor: '#fff',
            borderWidth: 1
        }]
    },
    options: {
        responsive: true,
        plugins: {
            legend: {
                position: 'top'
            }
        }
    }
});
}

// Atualiza o gráfico com novos dados
function updateChart() {
    chart.data.labels = inventory.map(item => item.nome);
    chart.data.datasets[0].data = inventory.map(item => item.quantidade);
    chart.update();
}

function showAddForm() {
    const formContainer = document.getElementById('form-container');
    formContainer.innerHTML = `
        <h2>Adicionar Item</h2>
        <form id="addForm">
            <input type="text" id="codigo" placeholder="Código do Produto" required>
            <input type="text" id="nome" placeholder="Nome do Item" required>
            <input type="number" id="quantidade" placeholder="Quantidade" required>
            <button type="submit">Adicionar</button>
        </form>
    `;
    document.getElementById('addForm').addEventListener('submit', function(e) {
        e.preventDefault();
        let codigo = document.getElementById('codigo').value;
        let nome = document.getElementById('nome').value;
        let quantidade = document.getElementById('quantidade').value;
        adicionarItem(codigo, nome, quantidade);
        formContainer.innerHTML = '';
        viewInventory();
    });
}

function showUpdateForm() {
    const formContainer = document.getElementById('form-container');
    formContainer.innerHTML = `
        <h2>Atualizar Item</h2>
        <form id="updateForm">
            <input type="text" id="codigo" placeholder="Código do Produto" required>
            <input type="number" id="quantidade" placeholder="Nova Quantidade" required>
            <button type="submit">Atualizar</button>
        </form>
    `;
    document.getElementById('updateForm').addEventListener('submit', function(e) {
        e.preventDefault();
        let codigo = document.getElementById('codigo').value;
        let quantidade = document.getElementById('quantidade').value;
        atualizarItem(codigo, quantidade);
        formContainer.innerHTML = '';
        viewInventory();
    });
}

function showRemoveForm() {
    const formContainer = document.getElementById('form-container');
    formContainer.innerHTML = `
        <h2>Remover Item</h2>
        <form id="removeForm">
            <input type="text" id="codigo" placeholder="Código do Produto" required>
            <button type="submit">Remover</button>
        </form>
    `;
    document.getElementById('removeForm').addEventListener('submit', function(e) {
        e.preventDefault();
        let codigo = document.getElementById('codigo').value;
        removerItem(codigo);
        formContainer.innerHTML = '';
        viewInventory();
    });
}

function adicionarItem(codigo, nome, quantidade) {
    inventory.push({ codigo, nome, quantidade });
    saveToLocalStorage();
    updateChart(); // Atualiza o gráfico
    alert('Item adicionado com sucesso!');
}

function atualizarItem(codigo, quantidade) {
    let itemAtualizado = false;
    for (let i = 0; i < inventory.length; i++) {
        if (inventory[i].codigo === codigo) {
            inventory[i].quantidade = quantidade;
            itemAtualizado = true;
            break;
        }
    }
    if (itemAtualizado) {
        saveToLocalStorage();
        updateChart(); // Atualiza o gráfico
        alert('Item atualizado com sucesso!');
    } else {
        alert('Item não encontrado!');
    }
}

function removerItem(codigo) {
    const novoInventario = inventory.filter(item => item.codigo !== codigo);
    if (novoInventario.length < inventory.length) {
        inventory = novoInventario;
        saveToLocalStorage();
        updateChart(); // Atualiza o gráfico
        alert('Item removido com sucesso!');
    } else {
        alert('Item não encontrado!');
    }
}

function viewInventory() {
    const inventoryContainer = document.getElementById('inventory-container');
    inventoryContainer.innerHTML = `
        <h2>Itens no Estoque</h2>
        <table>
            <tr>
                <th>Código</th>
                <th>Nome</th>
                <th>Quantidade</th>
            </tr>
            ${inventory.map(item => `
                <tr>
                    <td>${item.codigo}</td>
                    <td>${item.nome}</td>
                    <td>${item.quantidade}</td>
                </tr>
            `).join('')}
        </table>
    `;
}

// Inicializar a visualização do estoque e o gráfico ao carregar a página
document.addEventListener('DOMContentLoaded', function() {
    viewInventory();
    initializeChart(); // Inicializa o gráfico
});


