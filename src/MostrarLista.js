function mostrarLista(lista) {
  if (lista.length === 0) {
    console.log("Lista vacía");
    return "Lista vacía";
  } else {
    lista.forEach((elemento, i) => {
      console.log(`Elemento ${i + 1}: ${elemento}`);
    });
    const mensaje = `La lista contiene ${lista.length} elementos.`;
    console.log(mensaje);
    return mensaje;
  }
}

// Casos de prueba
mostrarLista([]); // Caso de lista vacía
mostrarLista(["Manzana", "Banana", "Pera"]); // Caso con elementos
mostrarLista([1, 2, 3, 4, 5]); // Otro caso con números