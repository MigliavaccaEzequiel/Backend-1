const socket = io()
const productsList = document.getElementById("productsList")
const cartList = document.getElementById("cartList")
const cartTotal = document.getElementById("cartTotal")
const cartSelect = document.getElementById("cartSelect")
const newCartBtn = document.getElementById("newCartBtn")
const paginationContainer = document.getElementById("pagination")
const categoryFilter = document.getElementById("categoryFilter")
const applyFiltersBtn = document.getElementById("applyFiltersBtn")
const sortSelect = document.getElementById("sortSelect")

let currentCartId = null
let currentPage = 1
let currentQuery = ""
let currentSort = ""

function renderProducts(products) {
  productsList.innerHTML = "";
  products.forEach(p => {
    const li = document.createElement("li")
    li.innerHTML = `
      ${p.title} - $${p.price} 
      <button onclick="addToCart('${p._id}')">Agregar al carrito</button>
      <a href="/products/${p._id}" class="btn btn-info">Ver producto</a>`
    productsList.appendChild(li)
  });
}

function renderCart(cart) {
  if (!cart || !cart.products) return
  currentCartId = cart._id

  cartList.innerHTML = "";
  let total = 0;

  if (cart.products.length === 0) {
    cartList.innerHTML = "<li>El carrito está vacío</li>"
    cartTotal.textContent = "Total: $0"
    return;
  }

  cart.products.forEach(p => {
    const li = document.createElement("li")
    li.innerHTML = `
      ${p.product.title} - $${p.product.price} x ${p.quantity}
      <button onclick="updateQuantity('${p.product._id}', 'subtract')">-</button>
      <button onclick="updateQuantity('${p.product._id}', 'add')">+</button>
      <button onclick="removeFromCart('${p.product._id}')">Eliminar</button>
    `;
    cartList.appendChild(li)
    total += p.product.price * p.quantity
  });

  cartTotal.textContent = `Total: $${total}`
}

function setupPagination(data) {
  paginationContainer.innerHTML = "";
  if (data.totalPages <= 1) return;

  if (data.hasPrevPage) {
    const btnPrev = document.createElement("button")
    btnPrev.textContent = "Anterior"
    btnPrev.onclick = () => loadProducts(data.prevPage, 5, currentQuery, currentSort)
    paginationContainer.appendChild(btnPrev)
  }

  for (let i = 1; i <= data.totalPages; i++) {
    const btn = document.createElement("button")
    btn.textContent = i
    if (i === data.page) btn.disabled = true
    btn.onclick = () => loadProducts(i, 5, currentQuery, currentSort)
    paginationContainer.appendChild(btn)
  }

  if (data.hasNextPage) {
    const btnNext = document.createElement("button")
    btnNext.textContent = "Siguiente"
    btnNext.onclick = () => loadProducts(data.nextPage, 5, currentQuery, currentSort)
    paginationContainer.appendChild(btnNext)
  }
}

async function loadProducts(page = 1, limit = 5, query = "", sort = "") {
  try {
    currentPage = page
    currentQuery = query
    currentSort = sort

    const res = await fetch(`/api/products?limit=${limit}&page=${page}&query=${query}&sort=${sort}`)
    const data = await res.json()
    renderProducts(data.payload)
    setupPagination(data)
  } catch (err) {
    console.error("Error al cargar productos:", err)
  }
}

socket.on("cartUpdated", (cart) => renderCart(cart))

socket.on("allCarts", (carts) => {
  cartSelect.innerHTML = "";
  carts.forEach(c => {
    const option = document.createElement("option")
    option.value = c._id;
    option.textContent = c._id;
    cartSelect.appendChild(option);
  });
  if (!currentCartId && carts.length > 0) currentCartId = carts[0]._id;
  fetch(`/api/carts/${currentCartId}/json`)
      .then(res => res.json())
      .then(cart => renderCart(cart))
      .catch(err => console.error("Error al cargar carrito inicial:", err))
})


function addToCart(productId) {
  if (!currentCartId) return alert("Seleccione un carrito válido")
  socket.emit("addToCart", { cartId: currentCartId, productId })
}

function updateQuantity(productId, action) {
  if (!currentCartId) return alert("Seleccione un carrito válido")
  socket.emit("updateQuantity", { cartId: currentCartId, productId, action })
}

function removeFromCart(productId) {
  if (!currentCartId) return alert("Seleccione un carrito válido")
  socket.emit("removeFromCart", { cartId: currentCartId, productId })
}

newCartBtn.addEventListener("click", async () => {
  try {
    const res = await fetch("/api/carts", { method: "POST" })
    const newCart = await res.json()

    currentCartId = newCart._id
    const option = document.createElement("option")
    option.value = newCart._id
    option.textContent = newCart._id
    cartSelect.appendChild(option)
    cartSelect.value = newCart._id

    renderCart(newCart)
  } catch (err) {
    console.error("Error al crear nuevo carrito:", err)
    alert("No se pudo crear un nuevo carrito")
  }
})

cartSelect.addEventListener("change", async () => {
  const selectedCartId = cartSelect.value
  if (!selectedCartId) return;
  try {
    const res = await fetch(`/api/carts/${selectedCartId}/json`)
    const cart = await res.json()
    renderCart(cart)
    currentCartId = cart._id
  } catch (err) {
    console.error("Error al cambiar de carrito:", err)
    alert("No se pudo cambiar de carrito")
  }
})

applyFiltersBtn?.addEventListener("click", () => {
  const query = categoryFilter.value
  const sort = sortSelect.value
  loadProducts(1, 5, query, sort)
})

document.addEventListener("DOMContentLoaded", () => {
  loadProducts();
})