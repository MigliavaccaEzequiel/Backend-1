const socket = io();

const productsList = document.getElementById("productsList");
const productForm = document.getElementById("productForm");
const deleteForm = document.getElementById("deleteForm");

socket.on("updateProducts", (products) => {
  productsList.innerHTML = "";
  products.forEach((p) => {
    const li = document.createElement("li");
    li.textContent = `${p.id} // ${p.code} - ${p.title} - $${p.price}`;
    productsList.appendChild(li);
  });
});

productForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const title = document.getElementById("title").value;
  const description = document.getElementById("description").value;
  const code = document.getElementById("code").value;
  const price = Number(document.getElementById("price").value);
  const stock = Number(document.getElementById("stock").value);
  const category = document.getElementById("category").value;
  const thumbnails = document.getElementById("thumbnails").value;

  socket.emit("newProduct", {
    id: Date.now().toString(),
    title,
    description,
    code,
    price,
    stock,
    category,
    thumbnails,
  });

  productForm.reset();
});

deleteForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const id = document.getElementById("deleteId").value;
  socket.emit("deleteProduct", id);
  deleteForm.reset();
});