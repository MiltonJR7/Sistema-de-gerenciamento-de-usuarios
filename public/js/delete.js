
document.addEventListener('DOMContentLoaded', ()=> {
    const btn = document.querySelectorAll('.btnDeletar');
    for(let i = 0; i < btn.length; i++) {
        btn[i].addEventListener('click', (e)=> {
            const idUser = e.currentTarget.dataset.deleteUser;
            const idAddress = e.currentTarget.dataset.deleteAddress;
            const idUserEdit = e.currentTarget.dataset.deleteUserEditPage;
            const idAddressProfile = e.currentTarget.dataset.deleteAddressProfile;

            let router = "";
            let id = "";

            if(idUser) {
                router = "/dashboard/user/delete";
                id = idUser;
            } else if(idAddress) {
                router = "/dashboard/address/delete";
                id = idAddress;
            } else if(idUserEdit){
                router = `/dashboard/user/delete/${idUserEdit}`;
                id = idUserEdit;
            } else {
                router = `/profile/delete`;
                id = idAddressProfile;
            }

            deletar(id, router);
        });
    }

    function deletar(id, router) {

        try {
            let obj = id;

            if(confirm("Os dados seram deletados apos a confirmação, deseja confirmar?")) {
                fetch(`${router}`, {
                    method: "DELETE",
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