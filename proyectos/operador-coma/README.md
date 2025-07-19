# 🛑 El Operador Coma en JavaScript

## Descripción
Este proyecto explora los errores comunes causados por el uso incorrecto del operador coma (`,`) en JavaScript, especialmente cuando se confunde con la notación de miles en números.

## Conceptos Clave

- **Precedencia de operadores**: El orden en que JavaScript evalúa las operaciones.
- **Asociatividad**: Determina cómo se agrupan operadores del mismo nivel (por ejemplo, la multiplicación es left-associative).
- **Operador coma**: Evalúa múltiples expresiones y retorna el valor de la última.

## Ejemplo de Error Común

```js
// Esperado: sesenta mil dividido entre (12 + dos mil)
final_amount = 60,000 / (12 + 2,000);
```
**¿Qué interpreta JavaScript?**
- `60,000` se evalúa como `(60, 000)` → resultado: `0`
- `2,000` se evalúa como `(2, 000)` → resultado: `0`
- La expresión real es: `0 / (12 + 0)` → resultado: `0`

## Precedencia y Asociatividad

```js
final_amount = 1000 * 1.05 * 1.05 * 1.05 * 1.05 * 1.05;
```
**JavaScript lo evalúa como:**
```js
((((1000 * 1.05) * 1.05) * 1.05) * 1.05) * 1.05
```
La multiplicación es left-associative.

## Expresiones Complejas

```js
// ¿Cómo evalúa JavaScript esto?
final_amount = principal * 1 + rate / 100 - commission * 12 / inflation_rate;
```
**Orden de evaluación:**
1. Multiplicaciones y divisiones (`*`, `/`)
2. Sumas y restas (`+`, `-`)
3. De izquierda a derecha (asociatividad)

## Lecciones Aprendidas

- Repetir operaciones manualmente es inmanejable: ¡necesitamos abstracción!
- Los errores de precedencia pueden causar resultados inesperados y costosos.
- Siempre usa paréntesis para dejar claro el orden de evaluación.
- No uses comas para separar miles en código JavaScript.

## Ejemplo de Precedencia

```js
1000 + 500 * 0.05 // Da 1025, no 75
```
**Porque:**  
`500 * 0.05` se evalúa primero, luego se suma a `1000`.

---

**Recomendación:**  
Utiliza guiones bajos para separar miles en JavaScript moderno (ES2021+):

```js
const monto = 60_000; // Válido y claro
```

[Ver demostración interactiva](./index.html)