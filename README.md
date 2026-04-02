# futurebody

Cómo funciona la lógica de "Slots Automáticos"
Para que el cliente vea los turnos, tu backend (o una función helper) debería hacer lo siguiente:

Obtener la plantilla del Coach: (ej: Lunes 08:00 a 12:00).

Dividir en intervalos: Si cada sesión dura 1 hora, genera slots: 08:00, 09:00, 10:00, 11:00.

Cruzar con turnos existentes: Si Juan Pérez ya reservó a las 09:00, ese slot pasa a estado booked.

Permitir excepciones: El Coach, desde su Home, puede tocar el slot de las 10:00 y marcarlo como blocked (porque tiene un trámite médico, por ejemplo).


3. Lógica del Botón Central (QuickAction)
Para cumplir con la Épica de Nutrición y Progreso, al tocar el botón +, debería abrirse un menú minimalista con estas 3 opciones rápidas:

📸 Registrar Comida: Abre la cámara (IA opcional para detectar tipo de alimento).

⚖️ Cargar Peso: Input numérico rápido para la gráfica de evolución.

💧 Hidratación/Hábito: Marcar el cumplimiento del día.

Diferencial de UX para el Cliente
Feedback háptico: Al tocar el botón central, añade una pequeña vibración.

Visualización de progreso: En el tab de "Progreso", el icono podría ser un pequeño gráfico que se "llena" según el cumplimiento semanal del cliente.
