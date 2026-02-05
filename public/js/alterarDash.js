
document.addEventListener('DOMContentLoaded', ()=> {
    
    const btn = document.getElementById("salvarAlteracao");
    const phoneInput = document.getElementById('telefone');
    btn.addEventListener("click", alterarDados);
    let isSubmitting = false;

    phoneInput.addEventListener('input', (e)=> {
        e.target.value = formatPhone(e.target.value);
    })

    function formatPhone(str) {
        const regex = /^(55)?(?:([1-9]{2})?)(\d{4,5})(\d{4})$/;
        return str
            .replace(/\D/g, '')
            .replace(regex,
            (fullMatch, country, ddd, prefixTel, suffixTel) => {
                if (country) return `+${ country } (${ ddd }) ${ prefixTel }-${ suffixTel}`;
                if (ddd) return `(${ ddd }) ${ prefixTel }-${ suffixTel}`;
                if (prefixTel && suffixTel) return `${ prefixTel }-${ suffixTel }`;
                return str;
            }
        );
    }

    function alterarDados() {
        const nome = document.getElementById('nome');
        const email = document.getElementById('email');
        const genero = document.getElementById('genero');
        const numero = document.getElementById('telefone');
        const senha = document.getElementById('senha');
        const confSenha = document.getElementById('confSenha');
        const imagem = document.getElementById('avatarInput')

        const cleanNumber = numero.value.replace(/\D/g, "");
        const regexLetras = /^[A-Za-zÀ-ÖØ-öø-ÿ]+(?:\s[A-Za-zÀ-ÖØ-öø-ÿ]+)*$/;
        const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        const regex = /^[1-9]{2}\d{9}$/;

        const parts = window.location.pathname.split("/");
        const id = Number(parts[parts.length - 1]);

        let validar = [];

        if(isSubmitting) return;
        isSubmitting = true;

        if(!regexLetras.test(nome.value)) { validar.push(nome) } else { nome.style.borderColor = "#f9fafb"; }
        if(!emailPattern.test(email.value)) { validar.push(email) } else { email.style.borderColor = "#f9fafb"; }
        if(!regexLetras.test(genero.value)) { validar.push(genero) } else { genero.style.borderColor = "#f9fafb"; }
        if(senha.value !== confSenha.value && senha.value.length < 6) { 
            validar.push(senha, confSenha); 
        } else { 
            senha.style.borderColor = "#f9fafb";
            confSenha.style.borderColor = "#f9fafb";
         }
        if(cleanNumber !== "" && !regex.test(cleanNumber)) { validar.push(numero); } else { numero.style.borderColor = "#f9fafb"; }

        if(validar.length === 0) {

            const formData = new FormData();

            formData.append('nome', nome.value);
            formData.append('email', email.value);
            formData.append('genero', genero.value);
            formData.append('senha', senha.value);
            formData.append('cleanNumber', cleanNumber);
            formData.append('imagem', imagem.files[0]);

            fetch(`/dashboard/user/${id}`, {
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
                    return alert('ERRO EM ALTERAR DADOS FETCH FINAL.');
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