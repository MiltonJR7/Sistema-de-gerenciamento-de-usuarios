
document.addEventListener('DOMContentLoaded', ()=> {
    const productList = document.getElementById('productList');
    const sumarryItens = document.getElementById('listaValores');

    if(productList || sumarryItens) {
        const carrinhoStorage = localStorage.getItem('carrinho');
        const objeto = JSON.parse(carrinhoStorage);

        let html = "";
        let htmlTotalCompra = "";
        let preco = 0;
        let precoComFrete = 0;

        for(let i = 0; i < objeto.length; i++) {
            const item = objeto[i];
            preco += objeto[i].preco * objeto[i].quantidade;

            html += `
                <div class="product-item">
                    <img src="${item.imagem}"
                            alt="${item.nome}"
                            class="product-image">
                    <div class="product-info">
                        <h3 class="product-name">${item.nome}</h3>
                        <p class="product-quantity">${item.quantidade}</p>
                    </div>
                    <div class="product-price-container">
                        <p class="product-price">
                            ${(item.preco).toLocaleString("pt-BR", {
                                style: "currency",
                                currency: "BRL"
                            })}
                        </p>
                        <p class="product-unit-price">
                            ${(item.preco).toLocaleString("pt-BR", {
                                style: "currency",
                                currency: "BRL"
                            })} cada
                        </p>
                    </div>
                </div>
            `
            productList.innerHTML = html;
        }

        precoComFrete = preco + 29.90;

        htmlTotalCompra += `
            <div class="summary-item">
                <span class="summary-label">Subtotal</span>
                <span class="summary-value">
                    ${(preco).toLocaleString("pt-BR", {
                        style: "currency",
                        currency: "BRL"
                    })}
                </span>
            </div>
            <div class="summary-item">
                <span class="summary-label">Frete</span>
                <span class="summary-value">R$ 29,90</span>
            </div>
            <div class="summary-total">
                <span class="summary-total-label">Total</span>
                <span class="summary-total-value">
                    ${(precoComFrete).toLocaleString("pt-BR", {
                        style: "currency",
                        currency: "BRL"
                    })}
                </span>
            </div>
        `
        sumarryItens.innerHTML = htmlTotalCompra;
    }
})