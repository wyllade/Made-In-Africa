document.addEventListener("DOMContentLoaded", async () => {
    // API Configuration
    const API_BASE_URL = "https://your-api-endpoint.com";
    let products = [];

    // 1. First, fetch products from API
    try {
        const response = await fetch(`${API_BASE_URL}/products`);
        if (!response.ok) throw new Error('Network response was not ok');
        products = await response.json();
        renderProducts(products);
    } catch (error) {
        console.error("Error loading products:", error);
        // Fallback to existing products in the HTML
        products = Array.from(document.querySelectorAll('.product')).map(product => ({
            id: product.dataset.id || Date.now(),
            name: product.querySelector('h3').textContent,
            price: product.querySelector('.price').textContent,
            origin: product.querySelector('.origin').textContent,
            image: product.querySelector('img').src
        }));
    }

    // 2. Cart state with API integration
    const cart = {
        count: 0,
        items: [],
        async update() {
            document.getElementById("cart-count").textContent = this.count;
            this.notify();
            await this.syncWithAPI();
        },
        notify() {
            const note = document.getElementById("cart-notification");
            note.classList.remove("hidden");
            note.querySelector("#cart-notification-count").textContent = this.count;
            setTimeout(() => note.classList.add("hidden"), 3000);
        },
        async add(productId) {
            try {
                const product = products.find(p => p.id == productId);
                if (!product) return;
                
                const response = await fetch(`${API_BASE_URL}/cart`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        productId,
                        price: parseFloat(product.price.replace('$', '')),
                        name: product.name
                    })
                });

                if (response.ok) {
                    this.count++;
                    this.items.push({ 
                        id: productId,
                        name: product.name,
                        price: product.price 
                    });
                    this.update();
                    return true;
                }
            } catch (error) {
                console.error("Error adding to cart:", error);
                // Fallback to local storage
                this.count++;
                this.items.push({
                    id: productId,
                    name: products.find(p => p.id == productId).name,
                    price: products.find(p => p.id == productId).price
                });
                localStorage.setItem('cart', JSON.stringify(this.items));
                this.update();
                return false;
            }
        },
        async syncWithAPI() {
            try {
                const response = await fetch(`${API_BASE_URL}/cart`);
                if (response.ok) {
                    const data = await response.json();
                    this.count = data.count;
                    this.items = data.items;
                }
            } catch (error) {
                console.error("Error syncing cart:", error);
                // Fallback to local storage
                const localCart = JSON.parse(localStorage.getItem('cart')) || [];
                this.count = localCart.length;
                this.items = localCart;
            }
        }
    };

    // Initialize cart
    await cart.syncWithAPI();
    document.getElementById("cart-count").textContent = cart.count;

    // 3. Add to cart functionality with API
    document.querySelectorAll(".add-to-cart").forEach(btn => {
        btn.addEventListener("click", async (e) => {
            const productCard = e.target.closest(".product");
            const productId = productCard.dataset.id || Date.now();
            
            const success = await cart.add(productId);
            
            // Visual feedback
            if (success) {
                btn.textContent = "✓ Added";
                btn.style.backgroundColor = "#4CAF50";
                setTimeout(() => {
                    btn.textContent = "Add to Cart";
                    btn.style.backgroundColor = "";
                }, 2000);
            } else {
                btn.textContent = "Try Again";
                btn.style.backgroundColor = "#f44336";
                setTimeout(() => {
                    btn.textContent = "Add to Cart";
                    btn.style.backgroundColor = "";
                }, 2000);
            }
        });
    });

    // 4. Cart dropdown (unchanged but now uses API data)
    const cartLink = document.querySelector(".cart-link");
    const dropdown = document.createElement("div");
    dropdown.className = "cart-dropdown hidden";
    document.querySelector(".user-menu").appendChild(dropdown);

    cartLink.addEventListener("click", (e) => {
        e.preventDefault();
        dropdown.classList.toggle("hidden");
        if (!dropdown.classList.contains("hidden")) showCart();
    });

    function showCart() {
        if (!cart.items.length) {
            dropdown.innerHTML = "<p>Your cart is empty</p>";
            return;
        }

        const total = cart.items.reduce((sum, item) =>
            sum + parseFloat(item.price.replace('$', '')), 0);

        dropdown.innerHTML = `
            <h4>Your Cart</h4>
            <ul>
                ${cart.items.map(item => `
                    <li>
                        <span>${item.name}</span>
                        <span>${item.price}</span>
                    </li>
                `).join('')}
            </ul>
            <div class="cart-total">Total: $${total.toFixed(2)}</div>
            <button class="checkout-btn">Checkout</button>
        `;
    }

    // 5. Product rendering function for API data
    function renderProducts(products) {
        const productGrid = document.querySelector('.product-grid');
        productGrid.innerHTML = products.map(product => `
            <article class="product" data-id="${product.id}">
                <img src="${product.image}" alt="${product.name} from ${product.origin}" loading="lazy">
                <div class="product-info">
                    <h3>${product.name}</h3>
                    <p class="origin">${product.origin}</p>
                    <p class="price">$${product.price.toFixed(2)}</p>
                    <button class="add-to-cart" aria-label="Add ${product.name} to cart">
                        Add to Cart
                    </button>
                </div>
            </article>
        `).join('');
    }

    // Rest of your existing code (sidebar, logout, etc.) remains the same...
    const sidebar = document.getElementById("sidebar");
    const toggleButton = document.getElementById("menu-toggle");

    if (toggleButton) {
        toggleButton.addEventListener("click", () => {
            sidebar.classList.toggle("open");
        });
    }

    // Handle user navigation
    document.querySelectorAll(".user-menu a").forEach(link => {
        link.addEventListener("click", (e) => {
            const targetPage = e.target.getAttribute("href");

            if (targetPage === "#logout") {
                logoutUser();
                return;
            }

            window.location.href = targetPage;
        });
    });

    async function logoutUser() {
        try {
            await fetch(`${API_BASE_URL}/auth/logout`, {
                method: 'POST'
            });
        } catch (error) {
            console.error("Logout error:", error);
        } finally {
            localStorage.removeItem('userToken');
            localStorage.removeItem('cart');
            window.location.href = 'index.html';
        }
    }
});