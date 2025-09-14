const socket = io()
const productsList = document.getElementById("productsList")
const productForm = document.getElementById("productForm")
const deleteForm = document.getElementById("deleteForm")
const cartSelect = document.getElementById("cartSelect")

socket.on("updateProducts", (products) => {
  productsList.innerHTML = "";
  products.forEach((p) => {
    const li = document.createElement("li");
    li.innerHTML = `${p._id} // ${p.code} - ${p.title} - $${p.price} 
    <button onclick="addToCart('${p._id}')">Agregar al carrito</button>
    <button onclick="deleteProduct('${p._id}')">Eliminar</button>`
    productsList.appendChild(li)
  })
})

async function loadCarts() {
  try {
    const res = await fetch("/api/carts")
    const carts = await res.json()

    cartSelect.innerHTML = `<option value="">Selecciona un carrito</option>`
    carts.forEach(c => {
      const option = document.createElement("option")
      option.value = c._id
      option.textContent = c._id
      cartSelect.appendChild(option)
    });
  } catch (error) {
    console.error("Error al cargar carritos:", error)
  }
}

loadCarts()

async function addToCart(pid) {
  const cartId = cartSelect.value
  if (!cartId) return alert("Selecciona un carrito válido")

  try {
    const res = await fetch(`/api/carts/${cartId}/product/${pid}`, { method: "POST" })
    const data = await res.json()
    if (res.ok) alert("Producto agregado al carrito")
    else alert(data.error)
  } catch (error) {
    alert("Error al agregar el producto al carrito")
    console.error(error)
  }
}

productForm.addEventListener("submit", (e) => {
  e.preventDefault()
  const title = document.getElementById("title").value
  const description = document.getElementById("description").value
  const code = document.getElementById("code").value
  const price = Number(document.getElementById("price").value)
  const stock = Number(document.getElementById("stock").value)
  const category = document.getElementById("category").value
  const thumbnails = document.getElementById("thumbnails").value

  socket.emit("newProduct", { title, description, code, price, stock, category, thumbnails })
  productForm.reset()
});

deleteForm.addEventListener("submit", (e) => {
  e.preventDefault()
  const id = document.getElementById("deleteId").value
  socket.emit("deleteProduct", id)
  deleteForm.reset()
});

function deleteProduct(id) {
  socket.emit("deleteProduct", id)
}