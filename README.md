# 🛒 Backend - Primera Entrega (Coderhouse)

Servidor desarrollado con Node.js y Express para la gestión de productos
y carritos de compra.

### Rutas para productos `/api/products`

-   `GET /` → Lista todos los productos.
-   `GET /:pid` → Muestra el producto con ID proporcionado.
-   `POST /` → Crea un nuevo producto.
-   `PUT /:pid` → Actualiza los campos de un producto.
-   `DELETE /:pid` → Elimina un producto.

### Rutas para carritos `/api/carts`

-   `POST /` → Crea un nuevo carrito.
-   `GET /:cid` → Muestra el carrito por ID.
-   `POST /:cid/product/:pid` → Agrega un producto al carrito.

## 💾 Persistencia

La información se guarda en archivos `.json` mediante el módulo
`fs.promises`: - `products.json` - `carts.json`

## ▶️ Instrucciones para correr el proyecto

1.  Instalar dependencias:

    ``` bash
    npm install
    ```

2.  Iniciar el servidor:

    ``` bash
    npm start
    ```

3.  Probar las rutas con Postman o cualquier cliente REST en:

    -   `http://localhost:8080/api/products`
    -   `http://localhost:8080/api/carts`

## 📌 Notas

-   El campo `id` se autogenera.
-   No se puede modificar ni eliminar el `id` en actualizaciones.
-   La información persiste en disco usando `fs.promises`.
-   No se incluye frontend, solo backend con Express.

------------------------------------------------------------------------

> Entrega realizada por Ezequiel Migliavacca para el curso de Backend de Coderhouse.
