const sidebar = document.getElementById('sidebar');
const sidebarOverlay = document.getElementById('sidebarOverlay');
const menuToggle = document.getElementById('menuToggle');
const sidebarClose = document.getElementById('sidebarClose');

function openSidebar() {
    sidebar.classList.add('active');
    sidebarOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeSidebar() {
    sidebar.classList.remove('active');
    sidebarOverlay.classList.remove('active');
    document.body.style.overflow = '';
}

menuToggle.addEventListener('click', openSidebar);
sidebarClose.addEventListener('click', closeSidebar);
sidebarOverlay.addEventListener('click', closeSidebar);

sidebar.addEventListener('click', (e) => {
    if (e.target.classList.contains('sidebar-menu')) {
        return;
    }
    e.stopPropagation();
});

const expandableToggles = document.querySelectorAll('.sidebar-expandable-toggle');
expandableToggles.forEach(toggle => {
    toggle.addEventListener('click', function() {
        const targetId = this.getAttribute('data-target');
        const target = document.getElementById(targetId);

        this.classList.toggle('active');
        target.classList.toggle('active');
    });
});

const brandToggles = document.querySelectorAll('.brand-category-toggle');
brandToggles.forEach(toggle => {
    toggle.addEventListener('click', function() {
        const targetId = this.getAttribute('data-target');
        const target = document.getElementById(targetId);
        const isActive = this.classList.contains('active');

        brandToggles.forEach(t => {
            if (t !== this) {
                t.classList.remove('active');
                const otherId = t.getAttribute('data-target');
                document.getElementById(otherId).classList.remove('active');
            }
        });

        this.classList.toggle('active');
        target.classList.toggle('active');
    });
});

const sidebarContent = document.querySelector('.sidebar-content');
let startX, startY, scrollLeft, scrollTop;
let isDragging = false;

sidebarContent.addEventListener('touchstart', (e) => {
    isDragging = true;
    startY = e.touches[0].pageY - sidebarContent.offsetTop;
    scrollTop = sidebarContent.scrollTop;
}, { passive: true });

sidebarContent.addEventListener('touchmove', (e) => {
    if (!isDragging) return;
    const y = e.touches[0].pageY - sidebarContent.offsetTop;
    const walk = (y - startY) * 1.5;
    sidebarContent.scrollTop = scrollTop - walk;
}, { passive: true });

sidebarContent.addEventListener('touchend', () => {
    isDragging = false;
});

let currentBrandIndex = 0;
let brandInterval;
const brands = document.querySelectorAll('.brand-item');
const totalBrands = brands.length;

function updateBrandsCarousel() {
    brands.forEach((brand, index) => {
        brand.classList.remove('center', 'left', 'right', 'hidden');

        const leftIndex = (currentBrandIndex - 1 + totalBrands) % totalBrands;
        const rightIndex = (currentBrandIndex + 1) % totalBrands;

        if (index === currentBrandIndex) {
            brand.classList.add('center');
        } else if (index === leftIndex) {
            brand.classList.add('left');
        } else if (index === rightIndex) {
            brand.classList.add('right');
        } else {
            brand.classList.add('hidden');
        }
    });
}

function rotateBrands() {
    currentBrandIndex = (currentBrandIndex + 1) % totalBrands;
    updateBrandsCarousel();
}

function startBrandsCarousel() {
    updateBrandsCarousel();
    brandInterval = setInterval(rotateBrands, 5000);
}

if (brands.length > 0) {
    startBrandsCarousel();
}

const categoriesGrid = document.querySelector('.categories-grid');
let startXCategories, scrollLeftCategories;
let isDraggingCategories = false;

if (categoriesGrid) {
    categoriesGrid.addEventListener('touchstart', (e) => {
        isDraggingCategories = true;
        startXCategories = e.touches[0].pageX;
        scrollLeftCategories = categoriesGrid.scrollLeft;
    }, { passive: true });

    categoriesGrid.addEventListener('touchmove', (e) => {
        if (!isDraggingCategories) return;
        const x = e.touches[0].pageX;
        const walk = (startXCategories - x) * 1.5;
        categoriesGrid.scrollLeft = scrollLeftCategories + walk;
    }, { passive: true });

    categoriesGrid.addEventListener('touchend', () => {
        isDraggingCategories = false;
    });

    categoriesGrid.style.overflowX = 'auto';
    categoriesGrid.style.scrollBehavior = 'smooth';
}

const productsTrack = document.getElementById('startTechTrack');
let startXProducts, scrollLeftProducts;
let isDraggingProducts = false;

if (productsTrack) {
    productsTrack.addEventListener('touchstart', (e) => {
        isDraggingProducts = true;
        startXProducts = e.touches[0].pageX - productsTrack.offsetLeft;
        scrollLeftProducts = productsTrack.scrollLeft;
        productsTrack.style.cursor = 'grabbing';
    }, { passive: true });

    productsTrack.addEventListener('touchmove', (e) => {
        if (!isDraggingProducts) return;
        const x = e.touches[0].pageX - productsTrack.offsetLeft;
        const walk = (startXProducts - x) * 2;
        productsTrack.scrollLeft = scrollLeftProducts + walk;
    }, { passive: true });

    productsTrack.addEventListener('touchend', () => {
        isDraggingProducts = false;
        productsTrack.style.cursor = 'grab';
    });

    productsTrack.addEventListener('mousedown', (e) => {
        isDraggingProducts = true;
        startXProducts = e.pageX - productsTrack.offsetLeft;
        scrollLeftProducts = productsTrack.scrollLeft;
        productsTrack.style.cursor = 'grabbing';
        e.preventDefault();
    });

    productsTrack.addEventListener('mousemove', (e) => {
        if (!isDraggingProducts) return;
        const x = e.pageX - productsTrack.offsetLeft;
        const walk = (startXProducts - x) * 2;
        productsTrack.scrollLeft = scrollLeftProducts + walk;
    });

    productsTrack.addEventListener('mouseup', () => {
        isDraggingProducts = false;
        productsTrack.style.cursor = 'grab';
    });

    productsTrack.addEventListener('mouseleave', () => {
        isDraggingProducts = false;
        productsTrack.style.cursor = 'grab';
    });

    productsTrack.style.cursor = 'grab';
}
