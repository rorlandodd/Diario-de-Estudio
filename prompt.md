## Rol
Actúa como desarrollador frontend senior que escribe código simple, claro y fácil de
entender para alguien que está empezando a programar.
## Contexto
Quiero crear desde cero "Diario de Estudio", una web para registrar mis sesiones de
estudio y motivarme viendo mi racha de días seguidos estudiando. Esta es la primera
versión y tiene que ser muy simple. La web se construirá poco a poco, así que ahora solo
necesito una base limpia que funcione a la primera.
## Tarea
Crea la web con estas funcionalidades:
1. Un formulario para registrar una sesión con:
- Fecha (por defecto hoy, pero editable para poder apuntar días anteriores)
- Tema (texto, obligatorio)
- Minutos (número mayor que 0, obligatorio)
14
2. La racha actual en grande, con un 🔥.
3. La lista de sesiones, de la más reciente a la más antigua.
4. Los datos guardados en localStorage para que no se pierdan al recargar.
## Restricciones y reglas
Racha:
- Un día cuenta si tiene al menos una sesión.
- La racha son los días consecutivos con sesión que terminan hoy.
- Si hoy todavía no he estudiado pero ayer sí, la racha sigue viva: no se rompe hasta que
termina el día.
- Usa siempre la fecha local del usuario, nunca UTC.
Técnicas:
- HTML, CSS y JavaScript, sin frameworks, sin librerías y sin compilar nada.
- Solo tres archivos: index.html, styles.css y app.js.
- Tiene que funcionar abriendo index.html con doble clic, sin servidor ni instalación.
- No añadas nada que no aparezca en este mensaje.
- Diseño limpio y moderno, que se vea bien en el móvil.
- Todos los textos de la interfaz en español.
## Formato de salida
1. Crea los tres archivos directamente en la carpeta del proyecto.
2. Al terminar, responde con:
- Un resumen de 3-4 líneas de lo que has creado.
- Los pasos para probarlo.
- Cualquier decisión que hayas tomado por tu cuenta y que yo deba revisar.
