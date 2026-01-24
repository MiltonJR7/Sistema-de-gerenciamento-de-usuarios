

document.addEventListener('DOMContentLoaded', ()=> {
    const btn = document.getElementById('btnAlterar');
    btn.addEventListener('click', alterarDados);
    let isSubmitting = false;

    function alterarDados() {
        const nome = document.getElementById('nome');
        const email = document.getElementById('email');
        const genero = document.getElementById('genero');
        const regexLetras = /^[A-Za-zÀ-ÖØ-öø-ÿ]+(?:\s[A-Za-zÀ-ÖØ-öø-ÿ]+)*$/
        const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        let validar = [];

        if(isSubmitting) return;
        isSubmitting = true;

        if(nome.value === "" || !regexLetras.test(nome.value)) { validar.push(nome) } else { nome.style.borderColor = "#f9fafb"; }
        if(email.value === "" || !emailPattern.test(email.value)) { validar.push(email) } else { email.style.borderColor = "#f9fafb"; }
        if(genero.value === "" || !regexLetras.test(genero.value)) { validar.push(genero) } else { genero.style.borderColor = "#f9fafb"; }

        if(validar.length === 0) {

            let obj = {
                nome: nome.value,
                email: email.value,
                genero: genero.value
            }

            fetch('/perfil/alterar', {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(obj)
            })
            .then((res)=> {
                return res.json();
            })
            .then((corpo)=> {
                if(corpo.ok) {
                    window.location.reload();
                } else {
                    return alert('ERRO EM ALTERAR DADOS FETCH FINAL.');
                }
            })
            .finally(()=> {
                isSubmitting = false;
            })

        } else {
            for(let i = 0; i < listaValidar.length; i++) {
                listaValidar[i].style.borderColor = "red";
            }
            isSubmitting = false;
        }
    }
})