const bar = document.getElementById('bar');
const close = document.getElementById('close');
const nav = document.getElementById('navbar');
//const blog = document.querySelectorAll(".blog-box");

if(bar){
    bar.addEventListener('click',()=>{
        nav.classList.add('active');
    })
}

if(close){
    close.addEventListener('click',()=>{
        nav.classList.remove('active');
    })
}

// script.js

// Wait for DOM to load
document.addEventListener("DOMContentLoaded", () => {
    const products = document.querySelectorAll(".pro");

    products.forEach(product => {
        product.addEventListener("click", (e) => {
            //Prevent click if its the cart button
            if (e.target.closest(".add-to-cart")) return;

            // Get product data from HTML attributes
            const productData = {
                name: product.getAttribute("data-name"),
                price: product.getAttribute("data-price"),
                description: product.getAttribute("data-description"),
                category: product.getAttribute("data-category"),
                image: product.getAttribute("data-image")
            };

            // Save to localStorage
            localStorage.setItem("selectedProduct", JSON.stringify(productData));

            // Open sproduct.html
            window.location.href = "sproduct.html";
        });
    });
});



//ADD to cart LocalStorage

document.addEventListener("DOMContentLoaded", () => {
  const cartButtons = document.querySelectorAll(".add-to-cart");

  cartButtons.forEach(button => {
    button.addEventListener("click", () => {
      const name = button.dataset.name;
      const price = parseFloat(button.dataset.price);
      const image = button.dataset.image;

      // Get cart or start with empty array
      let cart = JSON.parse(localStorage.getItem("cart")) || [];

      // Check if product already exists in cart
      let existingItem = cart.find(item => item.name === name);
      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        cart.push({ name, price, image, quantity: 1 });
      }

      // Save back to localStorage
      localStorage.setItem("cart", JSON.stringify(cart));

      // Show confirmation
      alert(`${name} added to cart!`);
    });
  });
});

// ---------------- CART PAGE SCRIPT ----------------

// Declare these globally so they are accessible in all functions
let subtotalElement, totalElement, discountAmount = 0;

document.addEventListener("DOMContentLoaded", () => {
  if (!document.querySelector("#cart-table")) return; // Run only on cart page

  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  const tableBody = document.querySelector("#cart-table tbody");
  subtotalElement = document.getElementById("subtotal-value");
  totalElement = document.getElementById("total-value");
  const emptyMessage = document.getElementById("empty-cart-message");

  tableBody.innerHTML = "";

  if (cart.length === 0) {
    emptyMessage.style.display = "block";
    subtotalElement.textContent = "₹0";
    totalElement.textContent = "₹0";
    return;
  } else {
    emptyMessage.style.display = "none";
  }

  let cartSubtotal = 0;

  cart.forEach((item, index) => {
    const rowTotal = item.price * item.quantity;
    cartSubtotal += rowTotal;

    tableBody.innerHTML += `
      <tr>
        <td><button onclick="removeItem(${index})">Remove</button></td>
        <td><img src="${item.image}" width="50"></td>
        <td>${item.name}</td>
        <td>₹${item.price}</td>
        <td><input type="number" value="${item.quantity}" min="1" onchange="changeQty(${index}, this.value)"></td>
        <td id="total-${index}">₹${rowTotal.toFixed(2)}</td>
      </tr>
    `;
  });

  subtotalElement.textContent = `₹${cartSubtotal.toFixed(2)}`;
  totalElement.textContent = `₹${cartSubtotal.toFixed(2)}`;
});

// Coupon apply event
document.getElementById("apply-coupon")?.addEventListener("click", () => {
    const code = document.getElementById("coupon-code").value.trim().toUpperCase();
    const subtotalValue = parseFloat(subtotalElement.textContent.replace("₹", ""));

    if (code === "SAVE10") {
        discountAmount = subtotalValue * 0.10; // 10% discount
        document.getElementById("coupon-message").textContent = "Coupon applied! 10% discount.";
        document.getElementById("coupon-message").style.color = "green";
    } else if (code === "SAVE100") {
        discountAmount = 100; // Flat ₹100 discount
        document.getElementById("coupon-message").textContent = "Coupon applied! ₹100 off.";
        document.getElementById("coupon-message").style.color = "green";
    } else {
        discountAmount = 0;
        document.getElementById("coupon-message").textContent = "Invalid coupon code.";
        document.getElementById("coupon-message").style.color = "red";
    }

    updateTotalsWithDiscount();
});

function updateTotalsWithDiscount() {
    const subtotalValue = parseFloat(subtotalElement.textContent.replace("₹", ""));
    let newTotal = subtotalValue - discountAmount;
    if (newTotal < 0) newTotal = 0;

    document.getElementById("discount-value").textContent = `₹${discountAmount.toFixed(2)}`;
    totalElement.textContent = `₹${newTotal.toFixed(2)}`;
}

//Change quantity
function changeQty(index, qty) {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  cart[index].quantity = parseInt(qty) || 1;
  localStorage.setItem("cart", JSON.stringify(cart));

  // Update the item total
  const newTotal = cart[index].price * cart[index].quantity;
  document.getElementById(`total-${index}`).textContent = `₹${newTotal.toFixed(2)}`;

  // Update subtotal & total
  let cartSubtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  document.getElementById("subtotal-value").textContent = `₹${cartSubtotal.toFixed(2)}`;
  document.getElementById("total-value").textContent = `₹${cartSubtotal.toFixed(2)}`;
}

//Remove Item
function removeItem(index) {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  cart.splice(index, 1);
  localStorage.setItem("cart", JSON.stringify(cart));

  // Refresh the table without reloading
  document.addEventListener("DOMContentLoaded", () => {});
  location.reload();
}


window.addEventListener("DOMContentLoaded", () => {
  const blogs = document.querySelectorAll(".blog-box");

  function changePage(page = 1) {
    const blogsPerPage = 3;
    const start = (page - 1) * blogsPerPage;
    const end = start + blogsPerPage;

    blogs.forEach((blog, index) => {
      blog.style.display = index >= start && index < end ? "flex" : "none";
    });
  }

  // Expose function globally so HTML buttons can use it
  window.changePage = changePage;

  // Show first page initially
  changePage(1);
});

//Payment page

 document.getElementById("payment-form").addEventListener("submit", function(e){
      e.preventDefault();
      const method = document.querySelector('input[name="payment"]:checked').value;
      alert("✅ Payment successful via " + method.toUpperCase() + "!\nThank you for shopping with VAZA.");
      window.location.href = "index.html"; // redirect to home after payment
    });