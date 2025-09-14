const form = document.getElementById("productForm")

if (form) {
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const formData = new FormData(form)

    try {
      const res = await fetch("/products", {
        method: "POST",
        body: formData
      });

      if (res.ok) {
        alert("Producto agregado")
        form.reset()
        if (typeof socket !== "undefined") socket.emit("newProductAdded")
      } else {
        const data = await res.json()
        alert(data.error || "Error al agregar producto")
      }
    } catch (err) {
      console.error(err)
      alert("Error al enviar formulario")
    }
  });
}