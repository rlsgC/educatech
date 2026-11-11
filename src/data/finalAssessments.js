import { extraFinalAssessments } from './lessonMedia'

export const finalAssessments = {
  ...extraFinalAssessments,
  'herramientas-digitales': {
    id: 'hd-final',
    title: 'Evaluación final: herramientas digitales en el aula',
    requiredCorrect: 4,
    questions: [
      { id: 'hdf-1', prompt: '¿Cuál es el primer criterio para elegir una herramienta?', options: ['El objetivo de aprendizaje', 'La cantidad de funciones', 'Su popularidad'], correctOption: 0, feedback: 'La herramienta se selecciona por su aporte al objetivo y al contexto.' },
      { id: 'hdf-2', prompt: '¿Qué estructura favorece una colaboración auténtica?', options: ['Roles y criterios compartidos', 'Edición simultánea sin acuerdos', 'Una tarea individual reunida al final'], correctOption: 0, feedback: 'Los roles, el producto común y los criterios sostienen la colaboración.' },
      { id: 'hdf-3', prompt: '¿Qué caracteriza una devolución accionable?', options: ['Indica un logro y un próximo paso', 'Incluye únicamente una nota', 'Describe la capacidad personal'], correctOption: 0, feedback: 'Una devolución útil permite comprender cómo mejorar.' },
      { id: 'hdf-4', prompt: '¿Qué conviene revisar antes de usar una plataforma?', options: ['Privacidad, acceso y condiciones de uso', 'Solo colores y animaciones', 'La cantidad de usuarios registrados'], correctOption: 0, feedback: 'La integración responsable incluye privacidad y accesibilidad.' },
      { id: 'hdf-5', prompt: '¿Cómo se mejora una implementación digital?', options: ['Observando evidencias y ajustando', 'Cambiando siempre de aplicación', 'Repitiéndola sin revisión'], correctOption: 0, feedback: 'La observación de resultados permite decidir mejoras fundamentadas.' },
    ],
  },
  'ia-educacion': {
    id: 'ia-final',
    title: 'Evaluación final: inteligencia artificial en educación',
    requiredCorrect: 4,
    questions: [
      { id: 'iaf-1', prompt: '¿Qué afirmación describe mejor una IA generativa?', options: ['Produce resultados a partir de patrones y puede equivocarse', 'Comprende como una persona', 'Garantiza información verdadera'], correctOption: 0, feedback: 'Los resultados deben interpretarse y verificarse críticamente.' },
      { id: 'iaf-2', prompt: '¿Qué dato no debe ingresarse en una herramienta pública?', options: ['Información personal sensible', 'Una consigna ficticia', 'Una pregunta conceptual'], correctOption: 0, feedback: 'La protección de datos es una condición básica de uso responsable.' },
      { id: 'iaf-3', prompt: '¿Qué consigna promueve pensamiento crítico?', options: ['Comparar la respuesta con fuentes y justificar correcciones', 'Copiar el primer resultado', 'Pedir más extensión sin revisar'], correctOption: 0, feedback: 'Contrastar y justificar mantiene el protagonismo cognitivo del estudiante.' },
      { id: 'iaf-4', prompt: '¿Qué debe transparentarse en una producción asistida?', options: ['Cómo se usó la IA y qué decisiones se tomaron', 'Solo el nombre de la aplicación', 'Nada, porque el resultado es suficiente'], correctOption: 0, feedback: 'La transparencia permite reconocer autoría y evaluar el proceso.' },
      { id: 'iaf-5', prompt: '¿Qué conviene evaluar además del producto?', options: ['Fuentes, verificaciones y revisiones', 'La velocidad de generación', 'La cantidad de instrucciones escritas'], correctOption: 0, feedback: 'El proceso muestra las decisiones y el uso responsable de la herramienta.' },
    ],
  },
}
