

document.addEventListener('DOMContentLoaded', ()=> {
    const btn = document.getElementById('btnSalvarProduto');
    const btnLimpar = document.getElementById('clearBtn');

    btn.addEventListener('click', addNewProduct);
    btnLimpar.addEventListener('click', limparImputs);
    let isSubmitting = false;

    function addNewProduct() {

        const nome = document.getElementById('nome');
        const descricao = document.getElementById('descricao');
        const precoInicial = document.getElementById('preco');
        const codigoBarras = document.getElementById('codigoBarras');
        const status = document.getElementById('status');
        const categoria = document.getElementById('categoria');
        const imagem = document.getElementById('prodimgInput');
        const estoque = document.getElementById('estoque');
        const estoqueMin = document.getElementById('estoqueMin');
        const subcategoria = document.getElementById('subcategoria');

        const precoLimpo = precoInicial.value;
        const preco = precoLimpo.replace(/\./g, '').replace(',', '.');
        const regexNumeros = /^\d+$/

        console.log(subcategoria.value)

        if (isSubmitting) return;
        isSubmitting = true;
        let validar = [];

        if(nome.value === "") { validar.push(nome); } else { nome.style.borderColor = "#D1D5DB"; }
        if(precoInicial.value === "" || preco.value < 0) { validar.push(precoInicial); } else { precoInicial.style.borderColor = "#D1D5DB"; }
        if(codigoBarras.value === "" || codigoBarras.value < 0 || !regexNumeros.test(codigoBarras.value)) { validar.push(codigoBarras); } else { codigoBarras.style.borderColor = "#D1D5DB"; }
        if(status.value === "") { validar.push(status); } else { status.style.borderColor = "#D1D5DB"; }
        if(categoria.value === "") { validar.push(categoria); } else { categoria.style.borderColor = "#D1D5DB"; }
        if(subcategoria.value === "") { validar.push(subcategoria); } else { subcategoria.style.borderColor = "#D1D5DB"; }
        if(estoque.value === "" || estoque.value < 0 || !regexNumeros.test(estoque.value)) { validar.push(estoque); } else { estoque.style.borderColor = "#D1D5DB"; }
        if(estoqueMin.value < 0 || !regexNumeros.test(estoqueMin.value)) { validar.push(estoqueMin); } else { estoqueMin.style.borderColor = "#D1D5DB"; }


        if(validar.length === 0) {

            const formData = new FormData();

            formData.append("nome", nome.value);
            formData.append("descricao", descricao.value);
            formData.append("preco", preco);
            formData.append("codigoBarras", codigoBarras.value);
            formData.append("status", status.value);
            formData.append("categoria", categoria.value);
            formData.append("subcategoria", subcategoria.value);
            formData.append("estoque", estoque.value);
            formData.append("estoqueMin", estoqueMin.value);
            if(imagem) formData.append("imagem", imagem.files[0]);

            fetch('/dashboard/products/add-new', {
                method: "POST",
                body: formData
            })
            .then((res)=> {
                return res.json();
            })
            .then((corpo)=> {
                if(corpo.ok) {
                    window.location.reload();
                } else {
                    alert('erro em cadastro de produto!');
                }
            })
            .finally(() => {
                isSubmitting = false;
            });

        } else {
            for(let i = 0; i < validar.length; i++) {
                validar[i].style.borderColor = "red";
            }
            isSubmitting = false;
        }
    }

    function limparImputs() {
        const nome = document.getElementById('nome');
        const descricao = document.getElementById('descricao');
        const preco = document.getElementById('preco');
        const codigoBarras = document.getElementById('codigoBarras');
        const status = document.getElementById('status');
        const categoria = document.getElementById('categoria');
        const estoque = document.getElementById('estoque');

        nome.value = "";
        nome.style.borderColor = "#D1D5DB";

        descricao.value = "";
        descricao.style.borderColor = "#D1D5DB";

        preco.value = "";
        preco.style.borderColor = "#D1D5DB";

        codigoBarras.value = "";
        codigoBarras.style.borderColor = "#D1D5DB";

        status.value = "";
        status.style.borderColor = "#D1D5DB";

        categoria.value = "";
        categoria.style.borderColor = "#D1D5DB";

        estoque.value = "";
        estoque.style.borderColor = "#D1D5DB";
    }
})