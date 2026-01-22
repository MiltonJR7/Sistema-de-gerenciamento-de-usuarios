
document.addEventListener('DOMContentLoaded', ()=> {
    const btn = document.getElementById('btnLogar');
    btn.addEventListener('click', logarSystem);

    function logarSystem() {
        const email = document.getElementById('email');
        const senha = document.getElementById('password');
        const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        let listaValidar = [];

        if(email.value === "" || !emailPattern.test(email.value)) { listaValidar.push(email) } else { 
            email.style.borderColor = "rgba(15, 23, 42, 0.15)"; 
            email.style.boxShadow = "none"; 
        }
        if(senha.value === "" || senha.value.length < 6) { listaValidar.push(senha) } else { 
            senha.style.borderColor = "rgba(15, 23, 42, 0.15)"; 
            senha.style.boxShadow = "none";
        }

        if(listaValidar.length == 0) {

            let obj = {
                email: email.value,
                senha: senha.value
            }

            fetch('/login', {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(obj)
            })
            .then((res)=> {
                return res.json();
            })
            .then((corpo)=> {
                if(corpo.ok) {
                    if(corpo.id == 1) {
                        window.location.href = "/dashboard";
                    } else {
                        window.location.href = "/";
                    }
                } else {
                    const divForm = document.getElementById('divFormLogin');
                    email.value = "";
                    senha.value = "";
                    divForm.style.boxShadow = "5px 5px 8px rgba(248, 16, 16, 0.51)";
                }
            })

        } else {
            for(let i = 0; i < listaValidar.length; i++) {
                listaValidar[i].style.boxShadow = "2px 2px 8px rgba(248, 16, 16, 0.51)";
                listaValidar[i].style.borderColor = "rgba(212, 85, 85, 0.52)";
            }
        }
    }
})