# Recuerdos de Navidad

Editor de fotografías para esferas navideñas. Funciona completamente en el navegador, en computadora y celular.

## Funciones

- Nueve fotos por hoja carta, en columnas escalonadas.
- Círculos de **75 mm de diámetro**, con una guía de recorte punteada de 0.15 mm.
- Carga individual, múltiple o arrastrando archivos sobre la página.
- Encuadre por arrastre, teclado y gestos táctiles; zoom de 1% a 2000% (deslizador hasta 400%). El 100% llena el círculo y empieza centrado. Se permite reducir la imagen y dejar fondo blanco.
- Editor ampliado con opción de restablecer o cambiar la foto.
- Vista previa de los nueve círculos y exportación directa a PDF, sin usar el diálogo de impresión del navegador.
- Descarga de hojas completas, incompletas o sin fotografías, con confirmación cuando faltan fotos. Los espacios vacíos incluyen el fondo tenue, número y guía de recorte de la vista previa. Confirmación antes de borrar todo.
- Guardado automático de imágenes y ajustes en `localStorage`. No hay backend, cuentas ni envío de fotografías a servidores.

## Tamaño de impresión

Carta: **215.9 × 279.4 mm**, equivalente a 612 × 792 puntos PDF. [Referencia de tamaños de HP](https://kaas.hpcloud.hp.com/pdf-public/pdf_380033_en-US-1.pdf).

La distribución usa tres columnas de tres círculos, con la columna central desplazada medio paso. Para un diámetro `d = 75 mm` y una separación mínima `g = 0.5 mm`:

- Paso vertical: `s = d + g = 75.5 mm`.
- Paso horizontal: `sqrt(3) / 2 × s = 65.3849 mm`.
- Ancho ocupado: `d + 2 × paso horizontal = 205.7698 mm`.
- Alto ocupado: `d + 2.5 × s = 263.75 mm`.
- Márgenes: 5.0651 mm a izquierda/derecha y 7.825 mm arriba/abajo.

Cada fotografía se rasteriza a 1000 × 1000 px y se coloca a 75 × 75 mm; la guía de recorte es vectorial. El PDF no incluye encabezados, instrucciones ni decoración.

**Imprime en papel carta con “Tamaño real” o “Escala 100%”. Desactiva “Ajustar a página”.** Los márgenes físicos de la impresora deben admitir al menos 5 mm. Comprueba con una regla el primer círculo impreso.

## Guardado y formatos

El proyecto permanece en el mismo navegador, dispositivo y dirección web. Limpiar los datos del sitio o usar navegación privada puede eliminarlo. Si el almacenamiento está bloqueado o lleno, la aplicación muestra el problema.

Las imágenes se normalizan a JPEG, con un lado máximo de 1800 px y un presupuesto de 210 000 caracteres por fotografía para alojar nueve fotos en la cuota habitual de almacenamiento. La resolución final depende de la compresión necesaria y de la imagen original. Los formatos admitidos dependen del navegador: JPG, PNG y WebP son las opciones recomendadas. Para HEIC no compatible se muestra una indicación para convertirlo.

## Desarrollo

Requiere Node.js 22 o posterior.

```sh
npm ci
npm run dev
npm test
npm run test:ui
npm run build
```

Las pruebas de interfaz usan Playwright con el canal `chrome`; requieren Google Chrome instalado. Las pruebas geométricas verifican diámetro, separación y márgenes. Las pruebas de interfaz verifican persistencia, zoom reducido, teclado, confirmación de descarga y ausencia de desbordamiento horizontal a 320, 375, 390, 768, 1024 y 1440 px.

Además se verificaron arrastre, gestos de pinza táctiles, carga de nueve imágenes complejas, generación del PDF completo/incompleto, tamaño MediaBox y renderizado visual del PDF.

## Publicación

El workflow `.github/workflows/pages.yml` instala dependencias, ejecuta las pruebas geométricas, construye la aplicación y despliega `dist/` en GitHub Pages mediante GitHub Actions. Las rutas generadas son relativas para funcionar bajo el nombre del repositorio.
