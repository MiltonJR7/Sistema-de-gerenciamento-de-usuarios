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

let currentStep = 2;

const btnContinue = document.getElementById('btn-continue');
const btnBack = document.getElementById('btn-back');
const addressSection = document.getElementById('address-section');
const paymentSection = document.getElementById('payment-section');
const paymentMethods = document.querySelectorAll('.payment-method');
const paymentDetails = document.getElementById('payment-details');
const stepCircles = document.querySelectorAll('.step-circle');
const stepItems = document.querySelectorAll('.step-item');

function updateStepIndicator() {
    stepItems.forEach((item, index) => {
        const circle = item.querySelector('.step-circle');
        const stepNumber = index + 1;

        circle.classList.remove('active', 'completed');

        if (stepNumber < currentStep) {
            circle.classList.add('completed');
            circle.innerHTML = '<i class="bi bi-check-lg"></i>';
        } else if (stepNumber === currentStep) {
            circle.classList.add('active');
            circle.textContent = stepNumber;
        } else {
            circle.textContent = stepNumber;
        }
    });
}

function goToPaymentStep() {
    currentStep = 3;

    addressSection.classList.remove('fade-in');
    addressSection.classList.add('d-none');

    paymentSection.classList.remove('d-none');
    paymentSection.classList.add('slide-in-right');

    setTimeout(() => {
        paymentSection.classList.remove('slide-in-right');
    }, 400);

    updateStepIndicator();

    btnContinue.innerHTML = 'Finalizar Compra';

    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

function goToAddressStep() {
    currentStep = 2;

    paymentSection.classList.remove('fade-in');
    paymentSection.classList.add('d-none');

    addressSection.classList.remove('d-none');
    addressSection.classList.add('slide-in-left');

    setTimeout(() => {
        addressSection.classList.remove('slide-in-left');
    }, 400);

    updateStepIndicator();

    btnContinue.innerHTML = 'Continuar para Pagamento';

    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

function finishOrder() {
    const confirmation = document.createElement('div');
    confirmation.innerHTML = `
        <div style="
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.5);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 9999;
            animation: fadeIn 0.3s ease-in;
        ">
            <div style="
                background: white;
                padding: 2rem;
                border-radius: 12px;
                max-width: 400px;
                text-align: center;
                animation: slideInRight 0.4s ease-out;
            ">
                <div style="
                    width: 60px;
                    height: 60px;
                    background: #10b981;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    margin: 0 auto 1rem;
                ">
                    <i class="bi bi-check-lg" style="color: white; font-size: 2rem;"></i>
                </div>
                <h3 style="color: #1f2937; margin-bottom: 0.5rem;">Pedido Confirmado!</h3>
                <p style="color: #6b7280; margin-bottom: 1.5rem;">
                    Este é apenas uma demonstração visual. Seu pedido não foi processado.
                </p>
                <button class="btn btn-primary" onclick="this.closest('div').parentElement.remove()">
                    Fechar
                </button>
            </div>
        </div>
    `;
    document.body.appendChild(confirmation);
}

btnContinue.addEventListener('click', () => {
    if (currentStep === 2) {
        goToPaymentStep();
    } else if (currentStep === 3) {
        finishOrder();
    }
});

btnBack.addEventListener('click', () => {
    goToAddressStep();
});

paymentMethods.forEach(method => {
    method.addEventListener('click', () => {
        paymentMethods.forEach(m => m.classList.remove('selected'));

        method.classList.add('selected');

        const selectedMethod = method.dataset.method;

        if (selectedMethod === 'credit') {
            paymentDetails.innerHTML = `
                <h3 class="payment-details-title mb-4">Dados do cartão</h3>

                <div class="mb-3">
                    <label class="form-label">Número do cartão</label>
                    <input type="text" class="form-control" placeholder="0000 0000 0000 0000" maxlength="19">
                </div>

                <div class="mb-3">
                    <label class="form-label">Nome no cartão</label>
                    <input type="text" class="form-control" placeholder="João Silva">
                </div>

                <div class="row g-3">
                    <div class="col-md-6">
                        <label class="form-label">Validade</label>
                        <input type="text" class="form-control" placeholder="MM/AA" maxlength="5">
                    </div>
                    <div class="col-md-6">
                        <label class="form-label">CVV</label>
                        <input type="text" class="form-control" placeholder="123" maxlength="4">
                    </div>
                </div>

                <div class="mt-3">
                    <label class="form-label">Parcelas</label>
                    <select class="form-select">
                        <option>1x de R$ 5.029,50 sem juros</option>
                        <option>2x de R$ 2.514,75 sem juros</option>
                        <option>3x de R$ 1.676,50 sem juros</option>
                        <option>4x de R$ 1.257,38 sem juros</option>
                        <option>5x de R$ 1.005,90 sem juros</option>
                        <option>6x de R$ 838,25 sem juros</option>
                        <option>7x de R$ 718,50 sem juros</option>
                        <option>8x de R$ 628,69 sem juros</option>
                        <option>9x de R$ 558,83 sem juros</option>
                        <option>10x de R$ 502,95 sem juros</option>
                        <option>11x de R$ 457,23 sem juros</option>
                        <option>12x de R$ 419,13 sem juros</option>
                    </select>
                </div>
            `;
            paymentDetails.classList.remove('d-none');
        } else if (selectedMethod === 'pix') {
            paymentDetails.innerHTML = `
                <div style="text-align: center;">
                    <i class="bi bi-qr-code" style="font-size: 120px; color: var(--color-text); margin: 1rem auto;"></i>
                    <p style="font-size: 0.875rem; color: var(--color-text-secondary); margin-bottom: 1rem;">
                        Após finalizar, você receberá o QR Code para pagamento
                    </p>
                    <p style="font-size: 0.875rem; color: var(--color-text); font-weight: 600;">
                        Pagamento aprovado na hora!
                    </p>
                </div>
            `;
            paymentDetails.classList.remove('d-none');
        } else if (selectedMethod === 'boleto') {
            paymentDetails.innerHTML = `
                <p style="font-size: 0.875rem; color: var(--color-text-secondary); margin-bottom: 0.5rem;">
                    Após finalizar, o boleto será gerado e enviado para seu e-mail.
                </p>
                <p style="font-size: 0.875rem; color: var(--color-text); font-weight: 600;">
                    Vencimento: 3 dias após emissão
                </p>
            `;
            paymentDetails.classList.remove('d-none');
        } else if (selectedMethod === 'wallet') {
            paymentDetails.innerHTML = `
                <p style="font-size: 0.875rem; color: var(--color-text-secondary); margin-bottom: 1rem;">
                    Selecione sua carteira digital preferida:
                </p>
                <div style="display: grid; gap: 0.75rem;">
                    <button class="btn btn-outline-primary">PayPal</button>
                    <button class="btn btn-outline-primary">PicPay</button>
                    <button class="btn btn-outline-primary">Mercado Pago</button>
                </div>
            `;
            paymentDetails.classList.remove('d-none');
        }

        paymentDetails.classList.add('fade-in');
        setTimeout(() => {
            paymentDetails.classList.remove('fade-in');
        }, 400);
    });
});

document.addEventListener('DOMContentLoaded', () => {
    updateStepIndicator();

    addressSection.classList.add('fade-in');
    setTimeout(() => {
        addressSection.classList.remove('fade-in');
    }, 400);
});

