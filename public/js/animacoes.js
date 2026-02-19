document.addEventListener('DOMContentLoaded', function () {
    const menuToggle = document.getElementById('menuToggle');
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('overlay');
    const navItems = document.querySelectorAll('.nav-item');

    function closeSidebar() {
        sidebar.classList.remove('open');
    }

    menuToggle.addEventListener('click', function () {
        sidebar.classList.toggle('open');
    });

    overlay.addEventListener('click', closeSidebar);

    navItems.forEach(item => {
        item.addEventListener('click', function () {
            const tabName = this.getAttribute('data-tab');
            this.classList.add('active');

            if(tabName === 'usuarios') {
                window.location.href = "/dashboard";
            } else if(tabName === 'enderecos') {
                window.location.href = "/dashboard/address";
            } else if(tabName === 'produtos') {
                window.location.href = "/dashboard/products";
            } else {
                window.location.href = "/";
            }

            closeSidebar();
        });
    });
});

document.addEventListener('DOMContentLoaded', ()=> {
    const savedTheme = localStorage.getItem("theme") || "light";
    let banner1 = document.getElementById('banner1');
    let banner2 = document.getElementById('banner2');
    let banner3 = document.getElementById('banner3');

    if(savedTheme === "dark") {
        banner1.src = "/img/iphone-banner-black.jpg"
        banner2.src = "/img/intel-banner-black.webp"
        banner3.src = "/img/logitech-banner-black.webp"
    }
});
