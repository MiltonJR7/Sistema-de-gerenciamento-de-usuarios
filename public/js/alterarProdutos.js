

document.addEventListener('DOMContentLoaded', ()=> {
    const btn = document.getElementById('salvarAlteracaoProdutos');
    btn.addEventListener('click', salvarAlteracao);
    let isSubmitting = false;

    function salvarAlteracao() {

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

        const parts = window.location.pathname.split("/");
        const id = Number(parts[parts.length - 1]);

        const precoLimpo = precoInicial.value;
        const preco = precoLimpo.replace(/\./g, '').replace(',', '.');

        if(isSubmitting) return;
        isSubmitting = true;
        let validar = [];

        if(nome.value === "") { validar.push(nome); } else { nome.style.borderColor = "#D1D5DB"; }
        if(precoInicial.value === "") { validar.push(precoInicial); } else { precoInicial.style.borderColor = "#D1D5DB"; }
        if(codigoBarras.value === "") { validar.push(codigoBarras); } else { codigoBarras.style.borderColor = "#D1D5DB"; }
        if(status.value === "") { validar.push(status); } else { status.style.borderColor = "#D1D5DB"; }
        if(categoria.value === "") { validar.push(categoria); } else { categoria.style.borderColor = "#D1D5DB"; }
        if(subcategoria.value === "") { validar.push(subcategoria); } else { subcategoria.style.borderColor = "#D1D5DB"; }
        if(estoque.value === "") { validar.push(estoque); } else { estoque.style.borderColor = "#D1D5DB"; }

        console.log(subcategoria.value)

        let statusBoolean = "";
        if(status.value === "ativo") statusBoolean = true; else statusBoolean = false;

        if(validar.length === 0) {
            const formData = new FormData();

            formData.append("nome", nome.value);
            formData.append("descricao", descricao.value);
            formData.append("preco", preco);
            formData.append("codigoBarras", codigoBarras.value);
            formData.append("status", statusBoolean);
            formData.append("categoria", categoria.value);
            formData.append("subcategoria", subcategoria.value);
            formData.append("estoque", estoque.value);
            formData.append("estoqueMin", estoqueMin.value);
            if(imagem) formData.append("imagem", imagem.files[0]);

            fetch(`/dashboard/products/${id}`, {
                method: "PUT",
                body: formData
            })
            .then((res)=> {
                return res.json();
            })
            .then((corpo)=> {
                if(corpo.ok) {
                    window.location.reload();
                } else {
                    return alert('NÃO FOI POSSIVEL REALIZAR A OPERAÇÃO TENTE NOVAMENTE MAIS TARDE!');
                }
            })
            .finally(()=> {
                isSubmitting = false;
            })

        } else {
            for(let i = 0; i < validar.length; i++) {
                validar[i].style.borderColor = "red";
            }
            isSubmitting = false;
        }
    }
})