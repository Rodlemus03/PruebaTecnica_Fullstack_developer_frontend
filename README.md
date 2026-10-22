# Frontend · Gestión de tickets de compra

Aplicación React para gestionar los tickets de compra y revisar los pagos semanales a proveedores. Consume la API del repositorio [PruebaTecnica_Fullstack_developer_backend](https://github.com/Rodlemus03/PruebaTecnica_Fullstack_developer_backend).

## Requisitos

- Node.js 22.22 o superior (lo exige React Router 8)
- El backend en ejecución, con la base de datos migrada y el Excel importado (ver su README)

## Instalación

```bash
git clone https://github.com/Rodlemus03/PruebaTecnica_Fullstack_developer_frontend.git
cd PruebaTecnica_Fullstack_developer_frontend
npm install
```

## Configuración

La aplicación lee la URL de la API desde `VITE_API_URL`. Si no existe un archivo `.env`, usa `http://localhost:3000/api`, que es la dirección por defecto del backend. Para cambiarla, en Windows:

```bash
copy .env.example .env
```

En Linux o macOS usa `cp .env.example .env`.

| Variable | Descripción | Valor por defecto |
|---|---|---|
| `VITE_API_URL` | URL base de la API | `http://localhost:3000/api` |

La aplicación usa siempre el puerto 5173, el mismo que el backend permite por defecto en `CORS_ORIGIN`. Si ese puerto está ocupado, Vite se detiene con un aviso en lugar de cambiar a otro.

## Ejecución

```bash
npm run dev
```

Abre `http://localhost:5173`. Para la versión de producción:

```bash
npm run build
npm run preview
```

`npm run build` genera la carpeta `dist/` y `npm run preview` la sirve en el mismo puerto. `npm run lint` revisa el código con oxlint.

## Funcionalidades

- **Tickets:** listado con búsqueda por código o proveedor, filtros por proveedor, land, producto y fechas, orden y paginación. Los filtros quedan en la URL, así que se pueden compartir y el botón Atrás los conserva.
- **Detalle:** cada ticket se muestra como un comprobante con proveedor, land, líneas e importe total.
- **Crear y editar:** formulario con líneas que se agregan o quitan, importes calculados mientras se escribe y las mismas validaciones del backend. Los errores del servidor, como un código duplicado, se muestran en el campo correspondiente.
- **Eliminar:** con confirmación, indicando cuántas líneas y qué total se eliminan.
- **Pagos semanales:** elección por año y semana ISO (incluye semanas que cruzan de año y años de 53 semanas), gráfico con el total de cada semana, resumen del total a pagar y pagos por proveedor con su participación, desglose por producto y por ticket.
- **Estados:** carga, error con reintento, resultados vacíos e indicador de conexión con la API.

## Estructura

```
src/
  api/          cliente HTTP y funciones por recurso
  components/   layout, estados, diálogo y avisos; tickets/ y payments/ por sección
  context/      catálogos y avisos compartidos
  hooks/        useRequest para peticiones con carga, error y cancelación
  pages/        una página por ruta
  utils/        formato de fechas e importes, semanas ISO
```

## Decisiones

- Los importes llegan de la API como texto con 3 decimales y se muestran sin convertirlos a número decimal, para no alterar ninguna cifra. Los importes que se calculan en el formulario usan enteros en milésimas.
- Las fechas se tratan sin zona horaria para que un ticket no cambie de día ni de semana según el huso del navegador.
- No se usan librerías adicionales para peticiones ni estilos: `fetch` y CSS propio.
