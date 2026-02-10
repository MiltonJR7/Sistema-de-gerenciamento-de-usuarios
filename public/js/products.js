document.addEventListener("DOMContentLoaded", () => {
    const categoriaSelect = document.getElementById("categoria");
    const subcategoriaSelect = document.getElementById("subcategoria");

    const subcategorias = JSON.parse(
        document.getElementById("data-subcats").textContent
    );

    function carregarSubcats() {
        const catId = categoriaSelect.value;

        subcategoriaSelect.innerHTML = "";
        subcategoriaSelect.disabled = true;

        if (!catId) {
        subcategoriaSelect.innerHTML = `<option value="">Selecione a categoria primeiro</option>`;
        return;
        }

        const filtradas = subcategorias.filter(s => String(s.catID) === String(catId));

        subcategoriaSelect.innerHTML = `<option value="">Selecione</option>`;

        filtradas.forEach(sub => {
        subcategoriaSelect.insertAdjacentHTML(
            "beforeend",
            `<option value="${sub.subID}">${sub.subNome}</option>`
        );
        });

        subcategoriaSelect.disabled = false;
    }

    categoriaSelect.addEventListener("change", carregarSubcats);

    carregarSubcats();
});
