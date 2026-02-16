// ================= FLOWER DATA =================
const flowerData = [
    {
        id: 1,
        name: "Red Rose Bouquet",
        price: 500,
        category: "rose",
        image: "img/Red rose Bouquet.jpeg",
        description: "Beautiful fresh red roses bouquet"
    },
    {
        id: 2,
        name: "White Lily",
        price: 400,
        category: "lily",
        image: "img/White lilies Bouquet.jpeg",
        description: "Elegant white lilies for special occasions"
    },
    {
        id: 3,
        name: "Orchid Arrangement",
        price: 600,
        category: "orchid",
        image: "img/orchid.jpeg",
        description: "Premium orchid flower arrangement"
    },
    {
        id: 4,
        name: "Sunflower Bouquet",
        price: 100,
        category: "sunflower",
        image: "img/sunflower Bouquet.jpeg",
        description: "Bright and cheerful sunflower bouquet"
    },
    {
        id: 5,
        name: "Mixed Flower Basket",
        price: 500,
        category: "mixed",
        image: "img/basket.jpeg",
        description: "Colorful mixed seasonal flowers"
    },
    {
        id: 6,
        name: "Pink Tulip Bunch",
        price: 500,
        category: "tulip",
        image: "img/tulip.jpeg",
        description: "Fresh pink tulips bouquet"
    }
];

// ================= CART =================
let cart = [];

// ================= DOM ELEMENTS =================
const cartLink = document.getElementById('cartLink');
const cartModal = document.getElementById('cartModal');
const closeCart = document.getElementById('closeCart');
const cartItems = document.getElementById('cartItems');
const cartTotal = document.getElementById('cartTotal');
const cartCount = document.querySelector('.cart-count');
const featuredFlowers = document.getElementById('featuredFlowers');
const checkoutBtn = document.getElementById('checkoutBtn');

// ================= INITIALIZE =================
document.addEventListener('DOMContentLoaded', function () {

    loadCartFromLocalStorage();
    updateCartUI();

    if (featuredFlowers) displayFeaturedFlowers();
    if (document.getElementById('menuFlowers')) {
        displayMenuFlowers();
        setupFilterButtons();
    }

    if (cartLink) {
        cartLink.addEventListener('click', function (e) {
            e.preventDefault();
            openCart();
        });
    }

    if (closeCart) closeCart.addEventListener('click', closeCartModal);
    if (checkoutBtn) checkoutBtn.addEventListener('click', checkout);

    window.addEventListener('click', function (e) {
        if (e.target === cartModal) closeCartModal();
    });

    setupContactForm();
});

// ================= FEATURED FLOWERS =================
function displayFeaturedFlowers() {
    featuredFlowers.innerHTML = '';
    const featuredItems = flowerData.slice(0, 3);

    featuredItems.forEach(flower => {
        featuredFlowers.innerHTML += `
        <div class="flower-card">
            <img src="${flower.image}" alt="${flower.name}">
            <div class="flower-info">
                <h3>${flower.name}</h3>
                <p>${flower.description}</p>
                <span class="price">$${flower.price.toFixed(2)}</span>
                <button class="add-to-cart" data-id="${flower.id}">Add to Cart</button>
            </div>
        </div>`;
    });

    activateAddToCartButtons();
}

// ================= MENU FLOWERS =================
function displayMenuFlowers(category = 'all') {
    const menuFlowers = document.getElementById('menuFlowers');
    if (!menuFlowers) return;

    menuFlowers.innerHTML = '';

    const filtered = category === 'all'
        ? flowerData
        : flowerData.filter(f => f.category === category);

    filtered.forEach(flower => {
        menuFlowers.innerHTML += `
        <div class="flower-card">
            <img src="${flower.image}" alt="${flower.name}">
            <div class="flower-info">
                <h3>${flower.name}</h3>
                <p>${flower.description}</p>
                <span class="price">$${flower.price.toFixed(2)}</span>
                <button class="add-to-cart" data-id="${flower.id}">Add to Cart</button>
            </div>
        </div>`;
    });

    activateAddToCartButtons();
}

function setupFilterButtons() {
    const buttons = document.querySelectorAll('.filter-btn');
    buttons.forEach(btn => {
        btn.addEventListener('click', function () {
            buttons.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            displayMenuFlowers(this.getAttribute('data-category'));
        });
    });
}

function activateAddToCartButtons() {
    document.querySelectorAll('.add-to-cart').forEach(btn => {
        btn.addEventListener('click', function () {
            addToCart(parseInt(this.dataset.id));
        });
    });
}

// ================= CART FUNCTIONS =================
function addToCart(id) {
    const flower = flowerData.find(item => item.id === id);
    const existing = cart.find(item => item.id === id);

    if (existing) {
        existing.quantity++;
    } else {
        cart.push({ ...flower, quantity: 1 });
    }

    saveCartToLocalStorage();
    updateCartUI();
    alert(`${flower.name} added to cart!`);
}

function removeFromCart(id) {
    cart = cart.filter(item => item.id !== id);
    saveCartToLocalStorage();
    updateCartUI();
}

function updateQuantity(id, change) {
    const item = cart.find(item => item.id === id);
    if (!item) return;

    item.quantity += change;
    if (item.quantity <= 0) removeFromCart(id);

    saveCartToLocalStorage();
    updateCartUI();
}

function updateCartUI() {
    if (!cartItems || !cartTotal || !cartCount) return;

    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCount.textContent = totalItems;

    if (cart.length === 0) {
        cartItems.innerHTML = '<p>Your cart is empty</p>';
        cartTotal.textContent = '0.00';
        return;
    }

    cartItems.innerHTML = '';
    let total = 0;

    cart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        total += itemTotal;

        cartItems.innerHTML += `
        <div class="cart-item">
            <h4>${item.name}</h4>
            <p>$${item.price.toFixed(2)} x ${item.quantity}</p>
            <button onclick="updateQuantity(${item.id}, -1)">-</button>
            <button onclick="updateQuantity(${item.id}, 1)">+</button>
            <button onclick="removeFromCart(${item.id})">Remove</button>
            <p>Total: $${itemTotal.toFixed(2)}</p>
        </div>`;
    });

    cartTotal.textContent = total.toFixed(2);
}

function openCart() {
    if (cartModal) cartModal.style.display = 'flex';
}

function closeCartModal() {
    if (cartModal) cartModal.style.display = 'none';
}

// ================= CHECKOUT =================
function checkout() {
    if (cart.length === 0) {
        alert('Your cart is empty!');
        return;
    }

    const order = {
        items: [...cart],
        total: cart.reduce((sum, item) => sum + item.price * item.quantity, 0),
        timestamp: new Date().toISOString()
    };

    const orders = JSON.parse(localStorage.getItem('orders')) || [];
    orders.push(order);
    localStorage.setItem('orders', JSON.stringify(orders));

    generateBill(order);

    cart = [];
    saveCartToLocalStorage();
    updateCartUI();
    closeCartModal();
}

function generateBill(order) {
    let content = `BLOOMING PETALS\n\nDate: ${new Date(order.timestamp).toLocaleString()}\n\n`;

    order.items.forEach(item => {
        content += `${item.name} - $${item.price} x ${item.quantity}\n`;
    });

    content += `\nTotal: $${order.total.toFixed(2)}\n\nThank you for shopping with us!`;

    alert(content);
}

// ================= CONTACT FORM =================
function setupContactForm() {
    const form = document.getElementById('contactForm');
    if (!form) return;

    form.addEventListener('submit', function (e) {
        e.preventDefault();

        const message = {
            name: form.name.value,
            email: form.email.value,
            message: form.message.value,
            timestamp: new Date().toISOString()
        };

        const messages = JSON.parse(localStorage.getItem('contactMessages')) || [];
        messages.push(message);
        localStorage.setItem('contactMessages', JSON.stringify(messages));

        form.reset();
        alert('Thank you for contacting Blooming Petals!');
    });
}

// ================= LOCAL STORAGE =================
function saveCartToLocalStorage() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

function loadCartFromLocalStorage() {
    const saved = localStorage.getItem('cart');
    if (saved) cart = JSON.parse(saved);
}