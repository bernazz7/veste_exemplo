const products = [
  {
    id: 1, name: "Camisa Urban", category: "Masculino", price: 129.90, oldPrice: null, tag: "Mais vendido",
    image: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=800&q=80",
    alt: "Camisa casual em tom neutro"
  },
  {
    id: 2, name: "Calça Essential", category: "Feminino", price: 189.90, oldPrice: 219.90, tag: "Novo",
    image: "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=800&q=80",
    alt: "Calça casual de estilo contemporâneo"
  },
  {
    id: 3, name: "Jaqueta Street", category: "Masculino", price: 249.90, oldPrice: null, tag: "",
    image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=800&q=80",
    alt: "Jaqueta moderna"
  },
  {
    id: 4, name: "Bolsa Minimal", category: "Acessórios", price: 159.90, oldPrice: null, tag: "Escolha VESTE",
    image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=800&q=80",
    alt: "Bolsa minimalista"
  },
  {
    id: 5, name: "Blusa Serena", category: "Feminino", price: 119.90, oldPrice: null, tag: "",
    image: "https://images.unsplash.com/photo-1551163943-3f6a855d1153?auto=format&fit=crop&w=800&q=80",
    alt: "Blusa feminina casual"
  },
  {
    id: 6, name: "Camiseta Básica", category: "Masculino", price: 79.90, oldPrice: null, tag: "",
    image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=800&q=80",
    alt: "Camiseta básica"
  },
  {
    id: 7, name: "Óculos Solar", category: "Acessórios", price: 89.90, oldPrice: null, tag: "Novo",
    image: "https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=800&q=80",
    alt: "Óculos de sol"
  },
  {
    id: 8, name: "Vestido Leve", category: "Feminino", price: 199.90, oldPrice: null, tag: "",
    image: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=800&q=80",
    alt: "Vestido feminino"
  }
];

const productGrid = document.querySelector("#productGrid");
const emptyState = document.querySelector("#emptyState");
const searchInput = document.querySelector("#searchInput");
const cartDrawer = document.querySelector("#cartDrawer");
const cartBackdrop = document.querySelector("#cartBackdrop");
const cartItemsElement = document.querySelector("#cartItems");
const cartCount = document.querySelector("#cartCount");
const cartTotal = document.querySelector("#cartTotal");
const toast = document.querySelector("#toast");

let activeFilter = "Todos";
let cart = [];
let likedProducts = new Set();
let toastTimeout;

function money(value) {
  return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

function renderProducts() {
  const term = searchInput.value.trim().toLocaleLowerCase("pt-BR");
  const filtered = products.filter(product => {
    const matchesCategory = activeFilter === "Todos" || product.category === activeFilter;
    const matchesSearch = `${product.name} ${product.category}`.toLocaleLowerCase("pt-BR").includes(term);
    return matchesCategory && matchesSearch;
  });

  productGrid.innerHTML = filtered.map(product => `
    <article class="product-card">
      <div class="product-image">
        <img src="${product.image}" alt="${product.alt}" loading="lazy">
        ${product.tag ? `<span class="product-tag">${product.tag}</span>` : ""}
        <button class="add-button" data-add="${product.id}">Adicionar à sacola +</button>
      </div>
      <div class="product-info">
        <div class="product-name-row">
          <div>
            <p class="product-name">${product.name}</p>
            <p class="product-category">${product.category}</p>
          </div>
          <button class="heart-button ${likedProducts.has(product.id) ? "liked" : ""}" data-like="${product.id}" aria-label="${likedProducts.has(product.id) ? "Remover dos favoritos" : "Adicionar aos favoritos"}">${likedProducts.has(product.id) ? "♥" : "♡"}</button>
        </div>
        <span class="product-price">${money(product.price)}</span>
        ${product.oldPrice ? `<span class="product-old-price">${money(product.oldPrice)}</span>` : ""}
      </div>
    </article>
  `).join("");

  emptyState.hidden = filtered.length > 0;
}

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(toastTimeout);
  toastTimeout = setTimeout(() => toast.classList.remove("show"), 2300);
}

function addToCart(id) {
  const product = products.find(item => item.id === id);
  if (!product) return;
  const existing = cart.find(item => item.id === id);
  if (existing) existing.quantity += 1;
  else cart.push({ ...product, quantity: 1 });
  renderCart();
  showToast(`${product.name} foi adicionada à sacola.`);
}

function removeFromCart(id) {
  cart = cart.filter(item => item.id !== id);
  renderCart();
}

function renderCart() {
  const count = cart.reduce((sum, item) => sum + item.quantity, 0);
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  cartCount.textContent = count;
  cartTotal.textContent = money(total);

  if (!cart.length) {
    cartItemsElement.innerHTML = '<p class="cart-empty">Sua sacola está vazia por enquanto.</p>';
    return;
  }

  cartItemsElement.innerHTML = cart.map(item => `
    <article class="cart-item">
      <img src="${item.image}" alt="${item.alt}">
      <div>
        <h3>${item.name}</h3>
        <p>${money(item.price)} · Qtd. ${item.quantity}</p>
        <button class="remove-item" data-remove="${item.id}">Remover</button>
      </div>
      <strong>${money(item.price * item.quantity)}</strong>
    </article>
  `).join("");
}

function openCart() {
  cartDrawer.classList.add("open");
  cartBackdrop.classList.add("open");
  cartDrawer.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
}

function closeCart() {
  cartDrawer.classList.remove("open");
  cartBackdrop.classList.remove("open");
  cartDrawer.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
}

document.querySelectorAll(".filter").forEach(button => {
  button.addEventListener("click", () => {
    activeFilter = button.dataset.filter;
    document.querySelectorAll(".filter").forEach(item => item.classList.toggle("active", item === button));
    renderProducts();
  });
});

document.querySelectorAll("[data-category-link]").forEach(link => {
  link.addEventListener("click", () => {
    activeFilter = link.dataset.categoryLink;
    document.querySelectorAll(".filter").forEach(item => item.classList.toggle("active", item.dataset.filter === activeFilter));
    renderProducts();
    document.querySelector("#mainNav").classList.remove("open");
    document.querySelector("#menuToggle").setAttribute("aria-expanded", "false");
  });
});

productGrid.addEventListener("click", event => {
  const addButton = event.target.closest("[data-add]");
  const likeButton = event.target.closest("[data-like]");
  if (addButton) addToCart(Number(addButton.dataset.add));
  if (likeButton) {
    const id = Number(likeButton.dataset.like);
    if (likedProducts.has(id)) likedProducts.delete(id);
    else likedProducts.add(id);
    renderProducts();
  }
});

cartItemsElement.addEventListener("click", event => {
  const button = event.target.closest("[data-remove]");
  if (button) removeFromCart(Number(button.dataset.remove));
});

document.querySelector("#cartToggle").addEventListener("click", openCart);
document.querySelector("#cartClose").addEventListener("click", closeCart);
cartBackdrop.addEventListener("click", closeCart);
document.addEventListener("keydown", event => {
  if (event.key === "Escape") closeCart();
});

document.querySelector("#searchToggle").addEventListener("click", () => {
  const bar = document.querySelector("#searchBar");
  bar.classList.toggle("visible");
  if (bar.classList.contains("visible")) searchInput.focus();
});
searchInput.addEventListener("input", renderProducts);

document.querySelector("#menuToggle").addEventListener("click", () => {
  const nav = document.querySelector("#mainNav");
  const isOpen = nav.classList.toggle("open");
  document.querySelector("#menuToggle").setAttribute("aria-expanded", String(isOpen));
});

document.querySelector("#newsletterForm").addEventListener("submit", event => {
  event.preventDefault();
  const email = document.querySelector("#emailInput").value.trim();
  document.querySelector("#newsletterMessage").textContent = `Obrigado! O cadastro de ${email} é apenas demonstrativo.`;
  event.target.reset();
});

document.querySelector("#checkoutButton").addEventListener("click", () => {
  if (!cart.length) {
    showToast("Adicione um produto antes de finalizar.");
    return;
  }
  showToast("Este é um exemplo: o pagamento ainda não está conectado.");
});

renderProducts();
renderCart();
