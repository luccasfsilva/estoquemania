let inventory = JSON.parse(localStorage.getItem('inventory')) || [];

function saveToLocalStorage() {
    localStorage.setItem('inventory', JSON.stringify(inventory));
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
}

function atualizarItem(codigo, quantidade) {
    for (let i = 0; i < inventory.length; i++) {
        if (inventory[i].codigo === codigo) {
            inventory[i].quantidade = quantidade;
            break;
        }
    }
    saveToLocalStorage();
}

function removerItem(codigo) {
    inventory = inventory.filter(item => item.codigo !== codigo);
    saveToLocalStorage();
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

// Carregar o inventário ao carregar a página
document.addEventListener('DOMContentLoaded', viewInventory);

