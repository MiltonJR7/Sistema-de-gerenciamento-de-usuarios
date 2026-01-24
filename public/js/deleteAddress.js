


document.addEventListener('DOMContentLoaded', ()=> {
    const btn = document.querySelectorAll('.btnDeletar');
    for(let i = 0; i < btn.length; i++) {
        btn[i].addEventListener('click', (e)=> {
            const id = e.currentTarget.dataset.delete;
            deletar(id);
        });
    }

    function deletar(id) {

        try {
            if(!id) return;

            let obj = id
            if(confirm("Os dados seram deletados apos a confirmação, deseja confirmar?")) {
                fetch('/dashboard/endereco/delete', {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({obj})
                })
                .then((res)=> {
                    return res.json();
                })
                .then((corpo)=> {
                    if(corpo.ok) {
                        window.location.reload();
                    } else {
                        alert("Error na confirmação do corpo.");
                    }
                })
            }

        } catch(err) {
            console.log(err);
            return err;
        }
    }
})