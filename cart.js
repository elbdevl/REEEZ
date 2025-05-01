document.addEventListener('DOMContentLoaded', function() {
  // Product database - the only place you need to maintain product info
  const products = [
    {
      id: '1',
      name: 'Velvet Matte Lipstick',
      price: 29.99,
      image: 'images/btcanalysis.jpg',
      description: 'Luxurious matte finish with long-lasting color'
    },
    {
      id: '2',
      name: 'Gold Rush Palette',
      price: 49.99,
      image: 'images/th.jpg',
      description: 'Eyeshadow palette with 12 shimmering gold tones'
    },
    {
      id: '3',
      name: '24K Gold Serum',
      price: 79.99,
      image: 'images/thr.jpg',
      description: 'Anti-aging serum infused with 24K gold particles'
    },
    {
      id: '4',
      name: 'riiiii7a',
      price: 89.99,
      image: 'images/OIP.jpg',
      description: 'Mysterious and elegant fragrance for evening wear'
    }
  ];

  // Initialize cart from localStorage or empty array
  let cart = JSON.parse(localStorage.getItem('cart')) || [];
  
  // Render products on the homepage
  if (document.querySelector('.product-grid')) {
    renderProducts();
  }

  // Update cart count in the header
  updateCartCount();
  
  // Display cart items on cart.html
  if (document.getElementById('cart-table-body')) {
    displayCartItems();
  }
  
  // Checkout button
/*  if (document.getElementById('checkout-btn')) {
    document.getElementById('checkout-btn').addEventListener('click', function() {
      alert('Thank you for your purchase!');
      cart = [];
      saveCart();
      updateCartCount();
      displayCartItems();
    });
  }*/

  function renderProducts() {
    const productGrid = document.querySelector('.product-grid');
    productGrid.innerHTML = '';
    
    products.forEach(product => {
      const productCard = document.createElement('div');
      productCard.className = 'product-card';
      productCard.innerHTML = `
        <img src="${product.image}" alt="${product.name}">
        <h3>${product.name}</h3>
        <p class="description">${product.description}</p>
        <p class="price">$${product.price.toFixed(2)}</p>
        <button class="add-to-cart" 
                data-id="${product.id}" 
                data-name="${product.name}" 
                data-price="${product.price}">
          Add to Cart
        </button>
      `;
      productGrid.appendChild(productCard);
    });

    // Add event listeners to all add-to-cart buttons
    document.querySelectorAll('.add-to-cart').forEach(button => {
      button.addEventListener('click', function() {
        const id = this.getAttribute('data-id');
        const name = this.getAttribute('data-name');
        const price = parseFloat(this.getAttribute('data-price'));
        const imgElement = this.closest('.product-card').querySelector('img');
        const image = imgElement.src;
        
        addToCart(id, name, price, image);
      });
    });
  }
  
  function addToCart(id, name, price, image) {
    const existingItem = cart.find(item => item.id === id);
    
    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      cart.push({
        id,
        name,
        price,
        image,
        quantity: 1
      });
    }
    
    saveCart();
    updateCartCount();
    alert(`${name} has been added to your cart!`);
  }
  
  function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
  }
  
  function updateCartCount() {
    const count = cart.reduce((total, item) => total + item.quantity, 0);
    document.querySelectorAll('.cart-count').forEach(element => {
      element.textContent = count;
    });
  }
  
  function displayCartItems() {
    const cartTableBody = document.getElementById('cart-table-body');
    cartTableBody.innerHTML = '';
    
    if (cart.length === 0) {
      cartTableBody.innerHTML = '<tr><td colspan="6">Your cart is empty</td></tr>';
      updateCartSummary();
      return;
    }
    
    cart.forEach(item => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td><img src="${item.image}" alt="${item.name}" class="cart-product-image"></td>
        <td>${item.name}</td>
        <td>$${item.price.toFixed(2)}</td>
        <td>
          <button class="quantity-btn minus" data-id="${item.id}">-</button>
          <span class="quantity">${item.quantity}</span>
          <button class="quantity-btn plus" data-id="${item.id}">+</button>
        </td>
        <td>$${(item.price * item.quantity).toFixed(2)}</td>
        <td><button class="remove-btn" data-id="${item.id}"><i class="fas fa-trash"></i></button></td>
      `;
      cartTableBody.appendChild(row);
    });
    
    // Add event listeners to quantity buttons
    document.querySelectorAll('.quantity-btn').forEach(button => {
      button.addEventListener('click', function() {
        const id = this.getAttribute('data-id');
        const isPlus = this.classList.contains('plus');
        updateQuantity(id, isPlus);
      });
    });
    
    // Add event listeners to remove buttons
    document.querySelectorAll('.remove-btn').forEach(button => {
      button.addEventListener('click', function() {
        const id = this.getAttribute('data-id');
        removeItem(id);
      });
    });
    
    updateCartSummary();
  }
  
  function updateQuantity(id, isPlus) {
    const item = cart.find(item => item.id === id);
    
    if (item) {
      if (isPlus) {
        item.quantity += 1;
      } else {
        item.quantity = Math.max(1, item.quantity - 1);
      }
      
      saveCart();
      updateCartCount();
      displayCartItems();
    }
  }
  
  function removeItem(id) {
    cart = cart.filter(item => item.id !== id);
    saveCart();
    updateCartCount();
    displayCartItems();
  }
  
  function updateCartSummary() {
    const subtotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    const shipping = subtotal > 0 ? 5.99 : 0;
    const total = subtotal + shipping;
    
    document.getElementById('subtotal').textContent = `$${subtotal.toFixed(2)}`;
    document.getElementById('shipping').textContent = `$${shipping.toFixed(2)}`;
    document.getElementById('total').textContent = `$${total.toFixed(2)}`;
  }
});