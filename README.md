# Plan de Proyecto: Sistema de Control de Ingresos y Egresos - Frontend con Vue 3 y Backend Node.js (TypeScript)

# LINKS DE AYUDA

## Mockups para inspirar

1 - https://www.behance.net/gallery/175495655/SpendWise-Expense-Tracker-Web-App-Design?tracking_source=search_projects|expense+tracker+web&l=101
2 - https://www.behance.net/gallery/204404995/Spendify-Expense-Tracking-App-UI-Design?tracking_source=search_projects|expense+tracker+web&l=142

## URL para los icons que se utilizan

- https://icones.js.org/collection/material-symbols

## URL del plugin para Data Table

- https://www.ag-grid.com/vue-data-grid/getting-started/

## URL del plugin para Charts

- https://vue-chartjs.org/

## Descripción General

Aplicación web para gestionar ingresos y egresos mensuales, con análisis y visualización dinámica de datos, filtros avanzados y gestión sencilla desde un dashboard intuitivo.

---

## Funcionalidades Principales

### 1. Reseteo mensual automático

- Al iniciar un nuevo mes, el sistema debe reiniciar el conteo y los registros mensuales.
- **Sugerencia:** Guardar registros con timestamps y filtrar por mes en backend; no borrar datos, solo filtrar para mostrar el mes actual.
- **Bonus:** Permitir histórico mensual para reportes anuales.

### 2. Estructura principal de datos

- **Clases/Entidades principales:**

```ts
class Transaction {
  id: string; // Identificador único de la transacción
  amount: number; // Monto de la transacción (positivo para ingreso o egreso)
  date: Date; // Fecha y hora en que ocurrió la transacción
  category: Category; // Categoría principal a la que pertenece esta transacción
  subcategory?: Subcategory; // Subcategoría específica dentro de la categoría (opcional)
  type: 'income' | 'expense'; // Tipo de transacción: ingreso ('income') o egreso ('expense')
  description?: string; // Nota o detalle adicional sobre la transacción (opcional)
  expenseType?: 'fixed' | 'variable'; // Clasificación de egresos: fijo o variable (solo aplica para egresos)
  isDeleted: boolean; // Marca si la transacción fue borrada “suavemente” (soft delete)
}

class Category {
  id: string; // Identificador único de la categoría
  name: string; // Nombre descriptivo de la categoría
  type: 'income' | 'expense'; // Tipo para diferenciar si la categoría es de ingresos o egresos
  subcategories: Subcategory[]; // Lista de subcategorías asociadas a esta categoría
}

class Subcategory {
  id: string; // Identificador único de la subcategoría
  name: string; // Nombre descriptivo de la subcategoría
}
```

- **Nombres sugeridos para las dos categorías principales:**
  - **Income** para ingresos
  - **Expense** para egresos

### 3. Subcategorías y detalles para egresos

- Permitir agregar subcategorías para `Expense`, por ejemplo: `Alimentos`, `Transporte`, `Servicios`, `Entretenimiento`.
- Poder crear nuevas subcategorías desde el frontend con validación.
- Mostrar listado de subcategorías existentes para selección.
- Agregar campo de **descripción** opcional para anotar detalles del gasto (ej.: "almuerzo con clientes").
- Clasificar los egresos como:
  - **Fijo**: gasto recurrente (alquiler, servicios).
  - **Variable**: gasto ocasional o cambiante (comida, ocio).

### 4. Dashboard y visualización

- Mostrar resumen con:
  - Total ingresos y egresos del mes seleccionado.
  - Comparativo anual (mes a mes).
  - Gráficos dinámicos (barras, pastel).
  - Indicadores clave (balance, porcentaje gastado).
  - Diferenciar gastos fijos vs. variables en los reportes.

### 5. Tabla dinámica por mes

- Mostrar listado paginado y filtrable de transacciones para el mes elegido.
- Columnas: Fecha, Categoría, Subcategoría, Monto, Descripción, Tipo de gasto (fijo/variable), Acciones (editar/eliminar).
- Capacidad de ordenar por columnas.

### 6. Filtros avanzados

- Filtrar por:
  - Tipo (`income` o `expense`)
  - Categoría/Subcategoría
  - Rango de fechas personalizado
  - Tipo de gasto: fijo o variable
- Búsqueda rápida por descripción.

### 7. Alertas y mensajes

- Últimos 2 días de cada mes mostrar mensaje visible:
  - Si gastos > ingresos → mensaje en rojo: "¡Cuidado! Gastaste más de lo ingresado este mes."
  - Si gastos ≤ ingresos → mensaje en verde: "Buen trabajo, estás dentro del presupuesto."
- Mensajes persistentes hasta que pase el mes.

### 8. Sidebar para detalles y edición

- Al hacer clic en un registro, abrir sidebar con detalles completos.
- Opciones para:
  - Editar datos (validar monto, fechas, categoría, descripción, tipo de gasto).
  - Eliminar (soft delete para mantener integridad).
  - Crear nuevo registro relacionado (transacción o subcategoría).
- Confirmaciones para borrar y guardar.

### 9. Gestión de subcategorías con popup

- Popup/modal para:
  - Listar subcategorías existentes (para selección rápida).
  - Formulario para crear nuevas subcategorías.
  - Validaciones y feedback en tiempo real.

---

## Funcionalidades adicionales sugeridas

### 10. Autenticación y autorización

- Login con JWT.
- Roles básicos (usuario/admin) para gestión avanzada.
- Persistencia de sesión segura (localStorage + refresh tokens).

### 11. Backend con Node.js y TypeScript

- API REST o GraphQL para:
  - CRUD de transacciones, categorías y subcategorías.
  - Autenticación.
  - Reportes y estadísticas.
- Validación de datos y manejo de errores robusto.
- Documentación con Swagger o similar.

### 12. Manejo de estado en frontend

- Usar Pinia o Vuex para manejo centralizado de datos y estado global.
- Guardar filtros, datos de usuario, token y configuraciones UI.

### 13. Internacionalización (Opcional)

- Soporte para múltiples idiomas para escalar la app.

### 14. Testing

- Tests unitarios y de integración con Jest y Vue Testing Library.
- Cobertura para componentes clave y lógica de negocio.

---

## Flujo general propuesto

1. Usuario inicia sesión.
2. Visualiza dashboard con resumen del mes actual.
3. Puede filtrar transacciones y navegar por meses anteriores.
4. Al agregar o editar, se abre sidebar o popup para entrada rápida.
5. Sistema revisa si estamos en últimos 2 días y muestra alerta si es necesario.
6. Backend almacena y devuelve datos con filtros y paginación.
7. La app se resetea automáticamente para mostrar datos del mes nuevo sin perder historial.

---

## Tech Stack recomendado

- **Frontend:** Vue 3 + Composition API + TypeScript + Pinia + Vue Router + Vite
- **Backend:** Node.js + Express + TypeScript + JWT + PostgreSQL/MongoDB (según preferencia)
- **Estilos:** TailwindCSS o Vuetify para UI rápida y responsiva
- **Testing:** Jest + Vue Testing Library + Supertest (backend)
- **Deploy:** Docker + CI/CD pipeline para automatizar despliegues

---
