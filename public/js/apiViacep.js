
document.addEventListener('DOMContentLoaded', ()=> {
    const btnLimpar = document.getElementById('btnLimparCampo');
    const cepInput = document.getElementById('cepInput');
    btnLimpar.addEventListener('click', limpa_formulário_cep);

    cepInput.addEventListener('keyup', (event)=> {
        const valor = document.getElementById('cepInput').value;
        var cep = valor.replace(/\D/g, '');

        if(cep !== "") {
            var validacep = /^[0-9]{8}$/;
            if(event.key === 'Enter') {
                if(validacep.test(cep)) {
                    fetch(`https://viacep.com.br/ws/${cep}/json/`)
                    .then((res)=> {
                        return res.json();
                    })
                    .then((corpo)=> {
                        if(!corpo.erro) {
                            document.getElementById('logradouroInput').value=(corpo.logradouro);
                            document.getElementById('bairroInput').value=(corpo.bairro);
                            document.getElementById('cidadeInput').value=(corpo.localidade);
                            document.getElementById('estadoInput').value=(corpo.uf);
                        } else {
                            limpa_formulário_cep();
                            alert("CEP não encontrado.");
                        }
                    })
                    .catch((err)=> {
                        return alert('Error interno, tente novamente mais tarde.');
                    })
                } else {
                    return alert('ERRO: CEP INVALIDO');
                }
            }
        }
    })
    
    function limpa_formulário_cep() {
        document.getElementById('cepInput').value=("");
        document.getElementById('logradouroInput').value=("");
        document.getElementById('bairroInput').value=("");
        document.getElementById('cidadeInput').value=("");
        document.getElementById('estadoInput').value=("");
        document.getElementById('numeroInput').value=("");
        document.getElementById('complementoInput').value=("");
        document.getElementById('paisInput').value=("");
    }
})