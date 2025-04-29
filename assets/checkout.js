// Ambil data dari localStorage
let cart = JSON.parse(localStorage.getItem('cart')) || [];

const checkoutItems = document.getElementById('checkoutItems');
const totalAmount = document.getElementById('totalAmount');

function renderCart() {
    checkoutItems.innerHTML = '';

    let total = 0;

    cart.forEach((item, index) => {
        total += item.price * item.qty;

        const itemDiv = document.createElement('div');
        itemDiv.className = 'item-card';
        itemDiv.innerHTML = `
            <div class="item-info">
                <strong>${item.name}</strong><br>
                Rp${formatRupiah(item.price)} x ${item.qty}
            </div>
            <div class="item-qty">
                <button onclick="decreaseQty(${index})">-</button>
                <span>${item.qty}</span>
                <button onclick="increaseQty(${index})">+</button>
            </div>
        `;
        checkoutItems.appendChild(itemDiv);
    });

    totalAmount.innerText = `Total: Rp${formatRupiah(total)}`;
}

function increaseQty(index) {
    cart[index].qty++;
    saveCart();
    renderCart();
}

function decreaseQty(index) {
    if (cart[index].qty > 1) {
        cart[index].qty--;
    } else {
        cart.splice(index, 1); // Hapus item kalau qty = 0
    }
    saveCart();
    renderCart();
}

function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

function formatRupiah(angka) {
    return angka.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
}

function sendToWhatsApp() {
    if (cart.length === 0) {
        alert('Keranjang masih kosong!');
        return;
    }

    let message = '*Pesanan Saya:*\n\n';
    cart.forEach(item => {
        message += `- ${item.qty}x ${item.name} (Rp${formatRupiah(item.price)})\n`;
    });

    let total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
    message += `\n*Total: Rp${formatRupiah(total)}*`;

    const phoneNumber = '6281234567890'; // <- Ganti dengan no WA pemilik toko
    const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;

    window.location.href = url;
}

// Render pertama kali
renderCart();
