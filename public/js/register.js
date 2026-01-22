
document.addEventListener('DOMContentLoaded', ()=> {
    const btn = document.getElementById('btnRegister');
    if(btn) { btn.addEventListener('click', registerSystem); }

    const btnEndereco = document.getElementById('btnRegistrarEndereco');
    if(btnEndereco) { btnEndereco.addEventListener('click', registerAddress); }

    function registerSystem() {
        const nome = document.getElementById('name');
        const email = document.getElementById('email');
        const senha = document.getElementById('password');
        const confSenha = document.getElementById('confirm-password');
        const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        const genero = document.getElementById('gender');
        let listaValidar = [];

        if(nome.value === "") { listaValidar.push(nome) } else { nome.style.borderColor = "rgba(15, 23, 42, 0.15)"; }
        if(email.value === "" || !emailPattern.test(email.value)) { listaValidar.push(email) } else { email.style.borderColor = "rgba(15, 23, 42, 0.15)"; }
        if(senha.value === "" || senha.value.length < 6 || senha.value !== confSenha.value) { listaValidar.push(senha, confSenha) } else { 
            senha.style.borderColor = "rgba(15, 23, 42, 0.15)";
            confSenha.style.borderColor = "rgba(15, 23, 42, 0.15)";
        }

        if(genero.value === "") { listaValidar.push(genero); } else { genero.style.borderColor = "rgba(15, 23, 42, 0.15)"; }

        if(listaValidar.length == 0) {

            let obj = {
                nome: nome.value,
                email: email.value,
                senha: senha.value,
                genero: genero.value
            }

            fetch('/register', {
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
                    window.location.href = "/login";
                } else {
                    window.location.reload();
                    alert('falhou foi mal ae erro de DEV KKK');
                }
            })

        } else {
            for(let i = 0; i < listaValidar.length; i++) {
                listaValidar[i].style.borderColor = "red";
            }
        }
    }

    function registerAddress() {
        const cep = document.getElementById('cepInput');
        const logradouro = document.getElementById('logradouroInput');
        const numero = document.getElementById('numeroInput');
        const complemento = document.getElementById('complementoInput');
        const bairro = document.getElementById('bairroInput');
        const cidade = document.getElementById('cidadeInput');
        const uf = document.getElementById('estadoInput');
        const pais = document.getElementById('paisInput');
        let listaValidar = [];

        if(cep.value === "") { listaValidar.push(cep) } else { cep.style.borderColor = "#f9fafb"; }
        if(logradouro.value === "") { listaValidar.push(logradouro) } else { logradouro.style.borderColor = "#f9fafb"; }
        if(numero.value === "") { numero.value = "n/a"; }
        if(complemento.value === "") { complemento.value = "n/a"; }
        if(bairro.value === "") { listaValidar.push(bairro) } else { bairro.style.borderColor = "#f9fafb"; }
        if(cidade.value === "") { listaValidar.push(cidade) } else { cidade.style.borderColor = "#f9fafb"; }
        if(uf.value === "") { listaValidar.push(uf) } else { uf.style.borderColor = "#f9fafb"; }
        if(pais.value === "") { listaValidar.push(pais) } else { pais.style.borderColor = "#f9fafb"; }

        if(listaValidar.length === 0) {

            let obj  = {
                cep: cep.value,
                logradouro: logradouro.value,
                numero: numero.value,
                complemento: complemento.value,
                bairro: bairro.value,
                cidade: cidade.value,
                uf: uf.value,
                pais: pais.value
            }

            fetch("/perfil", {
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
                    return alert('ERRO IN RETURN BODY IS NOT -- OK --');
                }
            })

        } else {
            for(let i = 0; i < listaValidar.length; i++) {
                listaValidar[i].style.borderColor = "red";
            }
        }
    }
})