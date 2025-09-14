async function updateQuantity(cartId, productId, action) {
  try {
    const res = await fetch(`/api/carts/${cartId}/product/${productId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action })
    });
    const data = await res.json()
    if (res.ok) {
      alert("Cantidad actualizada")
      location.reload()
    } else {
      alert(data.error || "Error al actualizar")
    }
  } catch (err) {
    console.error(err);
    alert("Error en la petición")
  }
}

async function removeFromCart(cartId, productId) {
  try {
    const res = await fetch(`/api/carts/${cartId}/product/${productId}`, {
      method: "DELETE"
    });
    const data = await res.json()
    if (res.ok) {
      alert("Producto eliminado")
      location.reload()
    } else {
      alert(data.error || "Error al eliminar")
    }
  } catch (err) {
    console.error(err)
    alert("Error en la petición")
  }
}
