const API = "https://fakestoreapi.com";
const grid = document.getElementById("productGrid");
const modal = document.getElementById("productModal");
const modalTitle = document.getElementById("modalTitle");
const modalImg = document.getElementById("modalImg");
const modalDesc = document.getElementById("modalDesc");
const modalPrice = document.getElementById("modalPrice");
const addToCartBtn = document.getElementById("addToCartBtn");
const closeModal = document.getElementById("closeModal");
const searchInput = document.getElementById("searchInput");
const categoryFilter = document.getElementById("categoryFilter");
const priceFilter = document.getElementById("priceFilter");
const priceValue = document.getElementById("priceValue");
const cartBtn = document.getElementById("cartBtn");
const cartSection = document.getElementById("cartSection");
const cartItems = document.getElementById("cartItems");
const cartCount = document.getElementById("cartCount");
const cartTotal = document.getElementById("cartTotal");
const clearCart = document.getElementById("clearCart");
const darkToggle = document.getElementById("darkToggle");

let products = [];
let filteredProducts = [];
let cart = JSON.parse(localStorage.getItem("cart") || "[]");
updateCartUI();

async function loadProducts() {
  const res = await fetch(`${API}/products`);
  products = await res.json();
  filteredProducts = products;
  renderProducts(products);
}

async function loadCategories() {
  const res = await fetch(`${API}/products/categories`);
  const cats = await res.json();
  categoryFilter.innerHTML = `<option value="">All Categories</option>` + 
    cats.map(c => `<option value="${c}">${c}</option>`).join("");
}

function renderProducts(list) {
  grid.innerHTML = list.map(p => `
    <div class="card">
      <img src="${p.image}" alt="${p.title}" />
      <h4>${p.title}</h4>
      <p>₹${p.price}</p>
      <button onclick="showProduct(${p.id})">View</button>
      <button onclick="addToCart(${p.id})">Add to Cart</button>
    </div>
  `).join("");
}

function showProduct(id) {
  const p = products.find(pr => pr.id === id);
  if (!p) return;
  modalTitle.textContent = p.title;
  modalImg.src = p.image;
  modalDesc.textContent = p.description;
  modalPrice.textContent = `₹${p.price}`;
  addToCartBtn.onclick = () => { addToCart(id); hideModal(); };
  modal.classList.remove("hidden");
}

function hideModal() { modal.classList.add("hidden"); }

function addToCart(id) {
  const p = products.find(pr => pr.id === id);
  const found = cart.find(i => i.id === id);
  if (found) found.qty++;
  else cart.push({ ...p, qty: 1 });
  saveCart();
  updateCartUI();
}

function saveCart() {
  localStorage.setItem("cart", JSON.stringify(cart));
}

function updateCartUI() {
  cartItems.innerHTML = cart.map(i => `
    <div class="cart-item">
      <span>${i.title} (x${i.qty})</span>
      <span>₹${(i.price * i.qty).toFixed(2)}</span>
    </div>
  `).join("");
  cartTotal.textContent = cart.reduce((t, i) => t + i.price * i.qty, 0).toFixed(2);
  cartCount.textContent = cart.reduce((t, i) => t + i.qty, 0);
}

searchInput.addEventListener("input", e => {
  const q = e.target.value.toLowerCase();
  filteredProducts = products.filter(p => p.title.toLowerCase().includes(q));
  renderProducts(filteredProducts);
});

categoryFilter.addEventListener("change", e => {
  const val = e.target.value;
  filteredProducts = val ? products.filter(p => p.category === val) : products;
  renderProducts(filteredProducts);
});

priceFilter.addEventListener("input", e => {
  const val = e.target.value;
  priceValue.textContent = val;
  filteredProducts = products.filter(p => p.price <= val);
  renderProducts(filteredProducts);
});

cartBtn.addEventListener("click", () => cartSection.classList.toggle("hidden"));
clearCart.addEventListener("click", () => {
  cart = [];
  saveCart();
  updateCartUI();
});

closeModal.addEventListener("click", hideModal);
window.onclick = e => { if (e.target === modal) hideModal(); };

darkToggle.addEventListener("click", () => {
  document.body.classList.toggle("dark");
});

document.getElementById("shopNow").onclick = loadProducts;

// Load everything
loadProducts();
loadCategories();
