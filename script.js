let inventory = JSON.parse(localStorage.getItem("inventory")) || [];
let chart;

function saveToLocalStorage() {
    localStorage.setItem("inventory", JSON.stringify(inventory));
}

function showAddForm() {
    const formContainer = document.getElementById("form-container");
    formContainer.innerHTML = `
        <h2>Adicionar Item</h2>
        <form id="addForm">
            <input type="text" id="codigo" placeholder="Código do Produto" required>
            <input type="text" id="nome" placeholder="Nome do Item" required>
            <input type="number" id="quantidade" placeholder="Quantidade" required>
            <input type="number" id="saida" placeholder="Quantidade de Saída" required>
            <input type="date" id="data" required>
            <input type="text" id="setor" placeholder="Setor" required>
            <button type="submit">Adicionar</button>
        </form>
    `;

    document.getElementById("addForm").addEventListener("submit", function (e) {
        e.preventDefault();
        let codigo = document.getElementById("codigo").value;
        let nome = document.getElementById("nome").value;
        let quantidade = parseInt(document.getElementById("quantidade").value);
        let saida = parseInt(document.getElementById("saida").value);
        let data = document.getElementById("data").value;
        let setor = document.getElementById("setor").value;
        let quantidadeAposSaida = quantidade - saida;

        adicionarItem(codigo, nome, quantidade, saida, quantidadeAposSaida, data, setor);
        formContainer.innerHTML = "";
        viewInventory();
    });
}

function adicionarItem(codigo, nome, quantidade, saida, quantidadeAposSaida, data, setor) {
    inventory.push({ codigo, nome, quantidade, saida, quantidadeAposSaida, data, setor });
    saveToLocalStorage();
}

// 🛑 NOVA FUNÇÃO PARA REMOVER ITEM 🛑
function showRemoveForm() {
    const formContainer = document.getElementById("form-container");
    formContainer.innerHTML = `
        <h2>Remover Item</h2>
        <form id="removeForm">
            <input type="text" id="codigoRemover" placeholder="Código do Produto" required>
            <button type="submit">Remover</button>
        </form>
    `;

    document.getElementById("removeForm").addEventListener("submit", function (e) {
        e.preventDefault();
        let codigo = document.getElementById("codigoRemover").value;
        removerItem(codigo);
        formContainer.innerHTML = "";
        viewInventory();
    });
}

function removerItem(codigo) {
    let index = inventory.findIndex((item) => item.codigo === codigo);
    
    if (index !== -1) {
        inventory.splice(index, 1); // Remove o item do array
        saveToLocalStorage();
        alert("Item removido com sucesso!");
    } else {
        alert("Item não encontrado!");
    }
}

// 🔄 ATUALIZAR ITEM 🔄
function showUpdateForm() {
    const formContainer = document.getElementById("form-container");
    formContainer.innerHTML = `
        <h2>Atualizar Item</h2>
        <form id="updateForm">
            <input type="text" id="codigo" placeholder="Código do Produto" required>
            <input type="number" id="quantidade" placeholder="Nova Quantidade" required>
            <input type="number" id="saida" placeholder="Nova Quantidade de Saída" required>
            <input type="date" id="data" required>
            <input type="text" id="setor" placeholder="Setor" required>
            <button type="submit">Atualizar</button>
        </form>
    `;

    document.getElementById("updateForm").addEventListener("submit", function (e) {
        e.preventDefault();
        let codigo = document.getElementById("codigo").value;
        let quantidade = parseInt(document.getElementById("quantidade").value);
        let saida = parseInt(document.getElementById("saida").value);
        let data = document.getElementById("data").value;
        let setor = document.getElementById("setor").value;
        atualizarItem(codigo, quantidade, saida, data, setor);
        formContainer.innerHTML = "";
        viewInventory();
    });
}

function atualizarItem(codigo, quantidade, saida, data, setor) {
    let itemAtualizado = false;
    for (let i = 0; i < inventory.length; i++) {
        if (inventory[i].codigo === codigo) {
            inventory[i].quantidade = quantidade;
            inventory[i].saida = saida;
            inventory[i].quantidadeAposSaida = quantidade - saida;
            inventory[i].data = data;
            inventory[i].setor = setor;
            itemAtualizado = true;
            break;
        }
    }
    if (itemAtualizado) {
        saveToLocalStorage();
    } else {
        alert("Item não encontrado!");
    }
}

// 📊 VISUALIZAR ESTOQUE 📊
function viewInventory() {
    const inventoryContainer = document.getElementById("inventory-container");
    inventoryContainer.innerHTML = `
        <h2>Itens no Estoque</h2>
        <table>
            <tr>
                <th>Código</th>
                <th>Nome</th>
                <th>Quantidade</th>
                <th>Saída</th>
                <th>Quantidade Após Saída</th>
                <th>Data</th>
                <th>Setor</th>
            </tr>
            ${inventory
                .map(
                    (item) => `
                <tr>
                    <td>${item.codigo}</td>
                    <td>${item.nome}</td>
                    <td>${item.quantidade}</td>
                    <td>${item.saida}</td>
                    <td>${item.quantidadeAposSaida}</td>
                    <td>${item.data}</td>
                    <td>${item.setor}</td>
                </tr>
            `
                )
                .join("")}
        </table>
    `;

    atualizarGrafico();
}

// 📈 ATUALIZAR GRÁFICO 📈
function atualizarGrafico() {
    if (chart) {
        chart.destroy();
    }

    let ctx = document.getElementById("chart").getContext("2d");
    let labels = inventory.map((item) => item.nome);
    let data = inventory.map((item) => item.quantidadeAposSaida);

    chart = new Chart(ctx, {
        type: "bar",
        data: {
            labels: labels,
            datasets: [
                {
                    label: "Quantidade Após Saída",
                    data: data,
                    backgroundColor: "rgba(54, 162, 235, 105)",
                    borderColor: "rgba(54, 162, 235, 105)",
                    borderWidth: 1,
                },
            ],
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true,
                },
            },
        },
    });
}

// 🏁 INICIALIZA A VISUALIZAÇÃO AO CARREGAR A PÁGINA 🏁
document.addEventListener("DOMContentLoaded", function () {
    viewInventory();
});
