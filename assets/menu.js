document.getElementById('search-button').addEventListener('click', function () {
    document.getElementById('search-container').classList.toggle('hidden');
});

document.getElementById('close-search').addEventListener('click', function () {
    document.getElementById('search-container').classList.add('hidden');
});

// Branch selection modal
document.getElementById('branch-selector-button').addEventListener('click', function () {
    document.getElementById('branch-modal').classList.remove('hidden');
    document.getElementById('branch-modal').classList.add('flex');
});

document.getElementById('close-branch-modal').addEventListener('click', function () {
    document.getElementById('branch-modal').classList.add('hidden');
    document.getElementById('branch-modal').classList.remove('flex');
});

// Item detail modal
document.querySelectorAll('.add-to-cart').forEach(button => {
    button.addEventListener('click', function () {
        document.getElementById('item-modal').classList.remove('hidden');
        document.getElementById('item-modal').classList.add('flex');
    });
});

document.getElementById('close-item-modal').addEventListener('click', function () {
    document.getElementById('item-modal').classList.add('hidden');
    document.getElementById('item-modal').classList.remove('flex');
});

// Cart modal
document.getElementById('view-cart').addEventListener('click', function () {
    document.getElementById('cart-modal').classList.remove('hidden');
    document.getElementById('cart-modal').classList.add('flex');
});

document.getElementById('close-cart-modal').addEventListener('click', function () {
    document.getElementById('cart-modal').classList.add('hidden');
    document.getElementById('cart-modal').classList.remove('flex');
});

// Toggle order type buttons
document.getElementById('pickup-button').addEventListener('click', function () {
    this.classList.remove('text-gray-700', 'border', 'border-gray-300');
    this.classList.add('bg-primary-500', 'text-white');

    const takeawayButton = document.getElementById('takeaway-button');
    takeawayButton.classList.remove('bg-primary-500', 'text-white');
    takeawayButton.classList.add('text-gray-700', 'border', 'border-gray-300');
});

document.getElementById('takeaway-button').addEventListener('click', function () {
    this.classList.remove('text-gray-700', 'border', 'border-gray-300');
    this.classList.add('bg-primary-500', 'text-white');

    const pickupButton = document.getElementById('pickup-button');
    pickupButton.classList.remove('bg-primary-500', 'text-white');
    pickupButton.classList.add('text-gray-700', 'border', 'border-gray-300');
});

// Category buttons
document.querySelectorAll('.category-button').forEach(button => {
    button.addEventListener('click', function () {
        // Remove active class from all buttons
        document.querySelectorAll('.category-button').forEach(btn => {
            btn.classList.remove('text-primary-500', 'font-semibold', 'border-b-2', 'border-primary-500');
            btn.classList.add('text-gray-700', 'font-medium');
        });

        // Add active class to clicked button
        this.classList.remove('text-gray-700', 'font-medium');
        this.classList.add('text-primary-500', 'font-semibold', 'border-b-2', 'border-primary-500');
    });
});

// Quantity controls
document.getElementById('decrease-quantity').addEventListener('click', function () {
    const quantityElement = this.nextElementSibling;
    let quantity = parseInt(quantityElement.textContent);
    if (quantity > 1) {
        quantity--;
        quantityElement.textContent = quantity;

        // Update add to cart button price
        const pricePerItem = 48182;
        const addToCartButton = document.getElementById('add-item-to-cart');
        addToCartButton.textContent = `Add to Cart - Rp${(pricePerItem * quantity).toLocaleString('id-ID')}`;
    }
});

document.getElementById('increase-quantity').addEventListener('click', function () {
    const quantityElement = this.previousElementSibling;
    let quantity = parseInt(quantityElement.textContent);
    quantity++;
    quantityElement.textContent = quantity;

    // Update add to cart button price
    const pricePerItem = 48182;
    const addToCartButton = document.getElementById('add-item-to-cart');
    addToCartButton.textContent = `Add to Cart - Rp${(pricePerItem * quantity).toLocaleString('id-ID')}`;
});

// Branch selection
document.querySelectorAll('.branch-option').forEach(option => {
    option.addEventListener('click', function () {
        const branchName = this.querySelector('h4').textContent;
        const branchAddress = this.querySelector('p:first-of-type').textContent;
        const branchHours = this.querySelector('p:last-of-type').textContent.replace('Open: ', 'Open today, ');

        document.getElementById('branch-name').textContent = branchName;
        document.getElementById('branch-address').textContent = branchAddress;
        document.getElementById('branch-hours').textContent = branchHours;

        document.getElementById('branch-modal').classList.add('hidden');
        document.getElementById('branch-modal').classList.remove('flex');
    });
});

// Checkout button (WhatsApp integration)
document.getElementById('checkout-button').addEventListener('click', function () {
    const phoneNumber = '+62812345678'; // This would normally be dynamically set based on the selected branch or store

    // Format the order message
    let orderMessage = "**Item yang dipesan (" + cart.length + ")** \n\n";

    // Add each item to the message
    cart.forEach(item => {
        orderMessage += `${item.quantity}x ${item.name}`;

        // Add customizations if any
        if (item.customizations && item.customizations.length > 0) {
            item.customizations.forEach(customization => {
                orderMessage += ` - ${customization}`;
            });
        }

        orderMessage += "\n";
    });

    // Add total price
    orderMessage += "\nTotal: **Rp" + calculateTotalPrice().toLocaleString('id-ID') + "**";

    // Encode the message for URL
    const encodedMessage = encodeURIComponent(orderMessage);

    // Create WhatsApp URL
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;

    // Open WhatsApp in a new tab
    window.open(whatsappUrl, '_blank');
});

// Function to calculate total price
function calculateTotalPrice() {
    let total = 0;
    cart.forEach(item => {
        total += item.price * item.quantity;

        // Add price of customizations if any
        if (item.customizationPrice) {
            total += item.customizationPrice;
        }
    });
    return total;
}

// Function to update cart counter
function updateCartCounter() {
    const counter = document.getElementById('cart-counter');
    if (cart.length > 0) {
        counter.textContent = cart.length;
        counter.classList.remove('hidden');
    } else {
        counter.classList.add('hidden');
    }
}

// Function to handle adding items to cart
function addToCart(menuItem) {
    // Clone the menu item to avoid reference issues
    const item = { ...menuItem };

    // Check if the item already exists in cart
    const existingItemIndex = cart.findIndex(cartItem =>
        cartItem.id === item.id &&
        JSON.stringify(cartItem.customizations) === JSON.stringify(item.customizations)
    );

    if (existingItemIndex !== -1) {
        // If item exists, just increase the quantity
        cart[existingItemIndex].quantity += 1;
    } else {
        // Otherwise add as new item with quantity 1
        item.quantity = 1;
        cart.push(item);
    }

    // Save cart to session storage
    sessionStorage.setItem('cart', JSON.stringify(cart));

    // Update UI
    updateCartCounter();
    showToast('Item ditambahkan ke keranjang');
}

// Function to show toast notification
function showToast(message) {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.classList.remove('hidden');

    // Hide after 3 seconds
    setTimeout(() => {
        toast.classList.add('hidden');
    }, 3000);
}

// Function to render cart items
function renderCartItems() {
    const cartItemsContainer = document.getElementById('cart-items');
    cartItemsContainer.innerHTML = '';

    if (cart.length === 0) {
        cartItemsContainer.innerHTML = '<p class="text-center py-4">Keranjang kosong</p>';
        document.getElementById('checkout-button').disabled = true;
        return;
    }

    document.getElementById('checkout-button').disabled = false;

    cart.forEach((item, index) => {
        const itemElement = document.createElement('div');
        itemElement.className = 'flex justify-between items-center p-3 border-b';
        itemElement.innerHTML = `
  <div class="flex-1">
      <h4 class="font-medium">${item.name}</h4>
      ${item.customizations && item.customizations.length > 0 ?
                `<p class="text-sm text-gray-600">${item.customizations.join(', ')}</p>` : ''}
      <p class="text-primary font-medium">Rp${(item.price * item.quantity).toLocaleString('id-ID')}</p>
  </div>
  <div class="flex items-center">
      <button class="decrement-item px-2 py-1 bg-gray-200 rounded-l" data-index="${index}">-</button>
      <span class="px-3">${item.quantity}</span>
      <button class="increment-item px-2 py-1 bg-gray-200 rounded-r" data-index="${index}">+</button>
      <button class="remove-item ml-3 text-red-500" data-index="${index}">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
      </button>
  </div>
`;
        cartItemsContainer.appendChild(itemElement);
    });

    // Add total price
    const totalElement = document.createElement('div');
    totalElement.className = 'p-3 font-bold text-lg flex justify-between';
    totalElement.innerHTML = `
<span>Total:</span>
<span>Rp${calculateTotalPrice().toLocaleString('id-ID')}</span>
`;
    cartItemsContainer.appendChild(totalElement);

    // Add event listeners for cart item controls
    addCartItemEventListeners();
}

// Function to add event listeners to cart item controls
function addCartItemEventListeners() {
    // Increment quantity
    document.querySelectorAll('.increment-item').forEach(button => {
        button.addEventListener('click', function () {
            const index = parseInt(this.dataset.index);
            cart[index].quantity += 1;
            sessionStorage.setItem('cart', JSON.stringify(cart));
            renderCartItems();
        });
    });

    // Decrement quantity
    document.querySelectorAll('.decrement-item').forEach(button => {
        button.addEventListener('click', function () {
            const index = parseInt(this.dataset.index);
            if (cart[index].quantity > 1) {
                cart[index].quantity -= 1;
            } else {
                cart.splice(index, 1);
            }
            sessionStorage.setItem('cart', JSON.stringify(cart));
            updateCartCounter();
            renderCartItems();
        });
    });

    // Remove item
    document.querySelectorAll('.remove-item').forEach(button => {
        button.addEventListener('click', function () {
            const index = parseInt(this.dataset.index);
            cart.splice(index, 1);
            sessionStorage.setItem('cart', JSON.stringify(cart));
            updateCartCounter();
            renderCartItems();
        });
    });
}

// Initialize the application
document.addEventListener('DOMContentLoaded', function () {
    // Load cart from session storage
    const savedCart = sessionStorage.getItem('cart');
    if (savedCart) {
        cart = JSON.parse(savedCart);
        updateCartCounter();
    }

    // Fetch menu data from API or use static data for now
    fetchMenuData();

    // Setup cart modal
    setupCartModal();
});

// Function to render categories
function renderCategories(categories) {
    const categoryContainer = document.getElementById('category-tabs');
    categoryContainer.innerHTML = '';

    categories.forEach(category => {
        const categoryTab = document.createElement('button');
        categoryTab.className = 'category-tab px-4 py-2 mx-1 rounded-lg';
        categoryTab.textContent = category.name;
        categoryTab.dataset.categoryId = category.id;

        categoryTab.addEventListener('click', function () {
            // Remove active class from all tabs
            document.querySelectorAll('.category-tab').forEach(tab => {
                tab.classList.remove('bg-primary', 'text-white');
                tab.classList.add('bg-gray-200', 'text-gray-800');
            });

            // Add active class to clicked tab
            this.classList.remove('bg-gray-200', 'text-gray-800');
            this.classList.add('bg-primary', 'text-white');

            // Filter menu items
            filterMenuItems(category.id);
        });

        // Set first category as active
        if (category.id === 1) {
            categoryTab.classList.add('bg-primary', 'text-white');
        } else {
            categoryTab.classList.add('bg-gray-200', 'text-gray-800');
        }

        categoryContainer.appendChild(categoryTab);
    });
}

// Function to filter menu items by category
function filterMenuItems(categoryId) {
    document.querySelectorAll('.menu-item').forEach(item => {
        if (item.dataset.categoryId == categoryId) {
            item.classList.remove('hidden');
        } else {
            item.classList.add('hidden');
        }
    });
}

// Function to render menu items
function renderMenuItems(items) {
    const menuContainer = document.getElementById('menu-items');
    menuContainer.innerHTML = '';

    items.forEach(item => {
        const menuItem = document.createElement('div');
        menuItem.className = 'menu-item bg-white rounded-lg shadow-md overflow-hidden mb-4';
        menuItem.dataset.categoryId = item.categoryId;

        menuItem.innerHTML = `
  <img src="${item.image}" alt="${item.name}" class="w-full h-40 object-cover">
  <div class="p-4">
      <h3 class="font-bold text-lg">${item.name}</h3>
      <p class="text-gray-600 text-sm mb-2">${item.description}</p>
      <div class="flex justify-between items-center">
          <span class="text-primary font-bold">Rp${item.price.toLocaleString('id-ID')}</span>
          <button class="add-to-cart px-3 py-1 bg-primary text-white rounded-lg">
              + Tambah
          </button>
      </div>
  </div>
`;

        // Add event listener to the add to cart button
        menuItem.querySelector('.add-to-cart').addEventListener('click', function () {
            addToCart(item);
        });

        menuContainer.appendChild(menuItem);
    });

    // Initially filter to show first category
    filterMenuItems(1);
}

// Function to setup cart modal
function setupCartModal() {
    const cartModal = document.getElementById('cart-modal');
    const cartButton = document.getElementById('cart-button');
    const closeCartButton = document.getElementById('close-cart');

    cartButton.addEventListener('click', function () {
        cartModal.classList.remove('hidden');
        renderCartItems();
    });

    closeCartButton.addEventListener('click', function () {
        cartModal.classList.add('hidden');
    });

    // Close modal when clicking outside
    cartModal.addEventListener('click', function (e) {
        if (e.target === cartModal) {
            cartModal.classList.add('hidden');
        }
    });}