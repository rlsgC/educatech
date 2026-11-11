export const reviewActivities = {
  1: {
    id: '1-review',
    type: 'review',
    questions: [
      {
        id: '1-pedagogy',
        prompt: '¿Qué caracteriza un uso pedagógico de la tecnología?',
        options: [
          'Usar la mayor cantidad posible de aplicaciones',
          'Elegir herramientas según los objetivos de aprendizaje',
          'Reemplazar todas las actividades presenciales por pantallas',
        ],
        correctOption: 1,
        feedback: 'La tecnología aporta valor cuando responde a una intención pedagógica y amplía oportunidades de aprendizaje.',
      },
      {
        id: '1-competencies',
        prompt: '¿Cuál de estas decisiones refleja una competencia digital docente?',
        options: [
          'Seleccionar, adaptar y evaluar recursos según el contexto educativo',
          'Usar siempre la herramienta más nueva',
          'Delegar todas las decisiones tecnológicas en el estudiantado',
        ],
        correctOption: 0,
        feedback: 'La competencia digital combina habilidades técnicas con criterios pedagógicos, evaluación y adaptación al contexto.',
      },
      {
        id: '1-virtual-environments',
        prompt: '¿Qué hace que un entorno virtual favorezca el aprendizaje?',
        options: [
          'Tener muchos archivos disponibles sin un orden particular',
          'Usarse solamente como depósito de materiales',
          'Organizar contenidos, interacciones y seguimiento en una secuencia clara',
        ],
        correctOption: 2,
        feedback: 'Un entorno virtual es valioso cuando articula recursos, actividades, interacción y seguimiento en un recorrido comprensible.',
      },
    ],
  },
  2: {
    id: '2-review', type: 'review',
    questions: [
      { id: '2-purpose', prompt: '¿Qué criterio conviene priorizar al elegir una herramienta colaborativa?', options: ['Que sea la más popular', 'Que facilite la participación necesaria para la actividad', 'Que tenga la mayor cantidad de funciones'], correctOption: 1, feedback: 'La herramienta debe elegirse por su adecuación al propósito, al grupo y a la dinámica de colaboración.' },
      { id: '2-roles', prompt: '¿Qué ayuda a sostener un trabajo colaborativo en línea?', options: ['Definir roles, acuerdos y una meta compartida', 'Evitar toda instancia de revisión', 'Pedir que cada persona trabaje sin comunicarse'], correctOption: 0, feedback: 'Los roles y acuerdos hacen visible cómo aporta cada integrante a una meta común.' },
      { id: '2-feedback', prompt: '¿Qué práctica mejora la producción colaborativa?', options: ['Editar sin avisar al equipo', 'Esperar al final para compartir avances', 'Dar devoluciones claras y registrar los cambios'], correctOption: 2, feedback: 'La retroalimentación oportuna y la trazabilidad ayudan a revisar y mejorar el trabajo conjunto.' },
    ],
  },
  3: {
    id: '3-review', type: 'review',
    questions: [
      { id: '3-objective', prompt: '¿Cuál es el primer criterio para crear un contenido educativo digital?', options: ['El objetivo de aprendizaje', 'La cantidad de animaciones', 'La herramienta de moda'], correctOption: 0, feedback: 'El objetivo de aprendizaje orienta el formato, la información y las actividades del recurso.' },
      { id: '3-accessibility', prompt: '¿Qué decisión mejora la accesibilidad de un contenido?', options: ['Usar texto pequeño para incluir más información', 'Agregar subtítulos y texto alternativo', 'Comunicar todo únicamente mediante colores'], correctOption: 1, feedback: 'Los subtítulos y textos alternativos permiten acceder al contenido de distintas maneras.' },
      { id: '3-design', prompt: '¿Qué favorece la comprensión de un recurso digital?', options: ['Una jerarquía visual clara y contenido relevante', 'Muchos estilos tipográficos a la vez', 'Bloques extensos sin títulos'], correctOption: 0, feedback: 'Una estructura clara reduce la carga innecesaria y permite identificar las ideas principales.' },
    ],
  },
  4: {
    id: '4-review', type: 'review',
    questions: [
      { id: '4-evidence', prompt: '¿Qué debe orientar una evaluación con tecnología?', options: ['La evidencia de aprendizaje que se busca recoger', 'La novedad de la plataforma', 'La cantidad de preguntas'], correctOption: 0, feedback: 'Primero se define qué aprendizaje se quiere observar; después se elige la herramienta adecuada.' },
      { id: '4-feedback', prompt: '¿Qué devolución es más formativa?', options: ['“Incorrecto”', '“Revisá todo”', 'Una indicación específica que ayude a mejorar'], correctOption: 2, feedback: 'La devolución formativa señala logros, aspectos a revisar y un próximo paso posible.' },
      { id: '4-variety', prompt: '¿Por qué conviene combinar distintas evidencias?', options: ['Para dificultar la actividad', 'Para observar el aprendizaje desde más de una perspectiva', 'Para evitar definir criterios'], correctOption: 1, feedback: 'Diversificar evidencias permite reconocer distintos procesos y formas de demostrar lo aprendido.' },
    ],
  },
  5: {
    id: '5-review', type: 'review',
    questions: [
      { id: '5-purpose', prompt: '¿Qué distingue una buena práctica de integración tecnológica?', options: ['Su alineación con una necesidad pedagógica', 'El uso permanente de dispositivos', 'La eliminación del acompañamiento docente'], correctOption: 0, feedback: 'Una buena práctica parte de una necesidad educativa y usa la tecnología con un propósito claro.' },
      { id: '5-privacy', prompt: '¿Qué aspecto debe revisarse antes de usar una plataforma en el aula?', options: ['Solo su apariencia', 'La privacidad, accesibilidad y condiciones de uso', 'La cantidad de publicidad que muestra'], correctOption: 1, feedback: 'Cuidar datos, acceso y condiciones de uso forma parte de una implementación responsable.' },
      { id: '5-reflection', prompt: '¿Qué permite mejorar una propuesta con tecnología?', options: ['Aplicarla siempre de la misma manera', 'Evaluar resultados y ajustar las decisiones', 'Cambiar de herramienta en cada clase'], correctOption: 1, feedback: 'La revisión de evidencias y experiencias permite ajustar la propuesta de manera fundamentada.' },
    ],
  },
}
