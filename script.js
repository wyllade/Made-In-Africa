document.addEventListener("DOMContentLoaded", function () {
    const cart = [];
    const cartCount = document.getElementById("cart-count");
    const cartItemsList = document.getElementById("cart-items");
    const totalPriceElement = document.getElementById("total-price");

    function updateCartUI() {
        cartItemsList.innerHTML = "";
        let totalPrice = 0;

        cart.forEach((item, index) => {
            const li = document.createElement("li");
            li.textContent = `${item.name} - $${item.price}`;
            cartItemsList.appendChild(li);
            totalPrice += item.price;
        });

        cartCount.textContent = cart.length;
        totalPriceElement.textContent = totalPrice.toFixed(2);
    }

    document.querySelectorAll(".add-to-cart").forEach(button => {
        button.addEventListener("click", function () {
            const product = this.closest(".product");
            const id = product.getAttribute("data-id");
            const name = product.getAttribute("data-name");
            const price = parseFloat(product.getAttribute("data-price"));

            cart.push({ id, name, price });
            updateCartUI();
        });
    });

    document.getElementById("checkout-btn").addEventListener("click", function () {
        alert("Thank you for your purchase!");
        cart.length = 0; // Clear the cart
        updateCartUI();
    });
});