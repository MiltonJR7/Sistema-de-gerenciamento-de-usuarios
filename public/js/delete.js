

document.addEventListener('DOMContentLoaded', ()=> {
    const btn = document.querySelectorAll('.btnDeletar');
    for(let i = 0; i < btn.length; i++) {
        btn[i].addEventListener('click', (e)=> {
            const idUser = e.currentTarget.dataset.deleteUser;
            const idAddress = e.currentTarget.dataset.deleteAddress;
            const idUserEdit = e.currentTarget.dataset.deleteUserEditPage;
            let router = "";
            let id = "";

            if(idUser) {
                router = "delete";
                id = idUser;
            } else if(idAddress) {
                router = "endereco/delete";
                id = idAddress;
            } else {
                router = `update/${idUserEdit}`;
                id = idUserEdit;
            }

            deletar(id, router);
        });
    }

    function deletar(id, router) {

        try {
            let obj = id;

            if(confirm("Os dados seram deletados apos a confirmação, deseja confirmar?")) {
                fetch(`/dashboard/${router}`, {
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
                        if(window.location.href === "/dashboard") {
                            window.location.reload();
                        } else {
                            window.location.href = "/dashboard";
                        }
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