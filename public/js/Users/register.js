
document.addEventListener('DOMContentLoaded', ()=> {
    const btn = document.getElementById('btnRegister');
    btn.addEventListener('click', registerSystem);

    function registerSystem() {
        const nome = document.getElementById('name');
        const email = document.getElementById('email');
        const senha = document.getElementById('senha');
        const confSenha = document.getElementById('confSenha');
        const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        let listaValidar = [];

        if(nome.value === "") { listaValidar.push(nome) } else { nome.style.borderColor = "rgba(15, 23, 42, 0.15)"; }

        if(email.value === "" || !emailPattern.test(email.value)) { listaValidar.push(email) } else { email.style.borderColor = "rgba(15, 23, 42, 0.15)"; }

        if(senha.value === "" || senha.value.length < 6 || senha.value !== confSenha.value) { listaValidar.push(senha, confSenha) } else { 
            senha.style.borderColor = "rgba(15, 23, 42, 0.15)";
            confSenha.style.borderColor = "rgba(15, 23, 42, 0.15)";
        }

        if(listaValidar.length == 0) {

        } else {
            for(let i = 0; i < listaValidar.length; i++) {
                listaValidar[i].style.borderColor = "red";
            }
        }
    }
})