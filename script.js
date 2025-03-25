document.addEventListener("DOMContentLoaded", () => {
    // Cart state
    const cart = {
        count: 0,
        items: [],
        update() {
            document.getElementById("cart-count").textContent = this.count;
            this.notify();
        },
        notify() {
            const note = document.getElementById("cart-notification");
            note.classList.remove("hidden");
            note.textContent = `Item added! (Total: ${this.count})`;
            setTimeout(() => note.classList.add("hidden"), 3000);
        },
        add(name, price) {
            this.count++;
            this.items.push({ name, price, id: Date.now() });
            this.update();
        }
    };

    // Initialize cart
    document.getElementById("cart-count").textContent = cart.count;

    // Add to cart
    document.querySelectorAll(".add-to-cart").forEach(btn => {
        btn.addEventListener("click", (e) => {
            const card = e.target.closest(".product");
            cart.add(
                card.querySelector("h3").textContent,
                card.querySelector(".price").textContent
            );
            
            // Visual feedback
            btn.textContent = "✓ Added";
            btn.style.backgroundColor = "#4CAF50";
            setTimeout(() => {
                btn.textContent = "Add to Cart";
                btn.style.backgroundColor = "";
            }, 2000);
        });
        
    });

    // Cart dropdown
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

    // Close dropdown when clicking outside
    document.addEventListener("click", (e) => {
        if (!e.target.closest(".user-menu")) {
            dropdown.classList.add("hidden");
        }
    });
});