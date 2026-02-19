document.addEventListener('DOMContentLoaded', () => {

    const parts = window.location.pathname.split("/");
    const idParams = Number(parts[parts.length - 1]);

    const btn = document.getElementById('btnAddCart');
    const nomeElemento = document.getElementById('nomeProduto');
    const precoElemento = document.getElementById('precoProduto');
    const imagemElemento = document.getElementById('imgProduct');
    const estrutura = document.getElementById('estruturaCompleta');
    const estruturaPrecoTotal = document.getElementById('precoFinal');

    let nomeProduto = "";
    let precoProduto = 0;
    let imagemProduto = "";
    let quantidadeInicial = 1;

    if (nomeElemento) nomeProduto = nomeElemento.dataset.nomeProduct;
    if (precoElemento) precoProduto = Number(precoElemento.dataset.precoProduct);
    if (imagemElemento) imagemProduto = imagemElemento.dataset.imagemProduct;

    if (btn) {
        btn.addEventListener('click', () => {

            let carrinho = JSON.parse(localStorage.getItem("carrinho")) || [];

            let product = {
                id: idParams,
                nome: nomeProduto,
                preco: precoProduto,
                imagem: imagemProduto,
                quantidade: quantidadeInicial
            };

            const index = carrinho.findIndex(p => p.id === product.id);

            if (index !== -1) {
                carrinho[index].quantidade += 1;
            } else {
                carrinho.push(product);
            }

            salvarCarrinho(carrinho);
        });
    }

    function salvarCarrinho(carrinho) {
        localStorage.setItem("carrinho", JSON.stringify(carrinho));
        if (estrutura) listarCarrinho();
    }

    function listarCarrinho() {
        const listaCarrinho = JSON.parse(localStorage.getItem("carrinho")) || [];
        let somaTotal = 0;
        let html = "";

        for (let i = 0; i < listaCarrinho.length; i++) {
            const item = listaCarrinho[i];
            somaTotal += item.preco * item.quantidade;

            html += `
                <div class="carrinho-item">
                    <img src="${item.imagem}"
                        alt="${item.nome}" class="carrinho-item-imagem">

                    <div class="carrinho-item-info">
                        <p class="carrinho-item-nome">${item.nome}</p>

                        <p class="carrinho-item-preco">
                            ${(item.preco).toLocaleString("pt-BR", {
                                style: "currency",
                                currency: "BRL"
                            })}
                        </p>

                        <div class="carrinho-quantidade">
                            <button class="carrinho-quantidade-btn btnMenos" data-id="${item.id}">−</button>

                            <input type="number"
                                   class="carrinho-quantidade-input"
                                   value="${item.quantidade}"
                                   min="1"
                                   data-id="${item.id}">

                            <button class="carrinho-quantidade-btn btnMais" data-id="${item.id}">+</button>
                        </div>
                    </div>

                    <button class="carrinho-btn-remover btnRemove"
                            data-id="${item.id}"
                            title="Remover item">
                        <i class="bi bi-trash3"></i>
                    </button>
                </div>
            `;
        }
        estrutura.innerHTML = html;
        estruturaPrecoTotal.innerHTML = `
            <span class="carrinho-subtotal-label">Subtotal:</span>
            <p class="carrinho-subtotal-valor">
                ${somaTotal.toLocaleString("pt-BR", {
                    style: "currency",
                    currency: "BRL"
                })}
            </p>
        `;
    }

    if (estrutura) {
        listarCarrinho();
        estrutura.addEventListener('click', (e) => {
            const carrinho = JSON.parse(localStorage.getItem("carrinho")) || [];
            const btnRemove = e.target.closest('.btnRemove');

            if (btnRemove) {
                const id = Number(btnRemove.dataset.id);
                const index = carrinho.findIndex(p => p.id === id);
                if (index !== -1) {
                    carrinho.splice(index, 1);
                    salvarCarrinho(carrinho);
                }
                return;
            }

            const btnMais = e.target.closest('.btnMais');
            if (btnMais) {
                const id = Number(btnMais.dataset.id);
                const index = carrinho.findIndex(p => p.id === id);

                if (index !== -1) {
                    carrinho[index].quantidade += 1;
                    salvarCarrinho(carrinho);
                }
                return;
            }

            const btnMenos = e.target.closest('.btnMenos');

            if (btnMenos) {
                const id = Number(btnMenos.dataset.id);
                const index = carrinho.findIndex(p => p.id === id);
                if (index !== -1) {

                    if (carrinho[index].quantidade > 1) {
                        carrinho[index].quantidade -= 1;
                    } else {
                        carrinho.splice(index, 1);
                    }
                    salvarCarrinho(carrinho);
                }
                return;
            }
        });

        estrutura.addEventListener('change', (e) => {
            const input = e.target.closest('.carrinho-quantidade-input');
            if (!input) return;

            let carrinho = JSON.parse(localStorage.getItem("carrinho")) || [];

            const id = Number(input.dataset.id);
            const novaQtd = Number(input.value);

            const index = carrinho.findIndex(p => p.id === id);

            if (index !== -1 && novaQtd > 0) {
                carrinho[index].quantidade = novaQtd;
                salvarCarrinho(carrinho);
            }
        });
    }
});
