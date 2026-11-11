import iaVideo11 from '../assets/videos/IA_1_1_Que_es_la_inteligencia_artificial.mp4'
import iaVideo12 from '../assets/videos/IA_1_2_IA_generativa_y_educacion.mp4'
import iaVideo13 from '../assets/videos/IA_1_3_Consignas_con_proposito.mp4'
import iaPoster11 from '../assets/videos/IA_1_1_Que_es_la_inteligencia_artificial.jpg'
import iaPoster12 from '../assets/videos/IA_1_2_IA_generativa_y_educacion.jpg'
import iaPoster13 from '../assets/videos/IA_1_3_Consignas_con_proposito.jpg'
import iaGuide11 from '../assets/pdfs/IA_1_1_Guia_Que_es_la_inteligencia_artificial.pdf'
import iaGuide12 from '../assets/pdfs/IA_1_2_Guia_IA_generativa_en_la_escuela.pdf'
import iaGuide13 from '../assets/pdfs/IA_1_3_Guia_Consignas_con_proposito.pdf'

const lesson = (id, title, intro, objectives) => ({
  id,
  title,
  intro,
  objectives,
  materials: [`Guía: ${title}.pdf`],
  media: [`Video: ${title}`],
})

const review = (id, questions) => ({ id, type: 'review', questions })

const question = (id, prompt, options, correctOption, feedback) => ({ id, prompt, options, correctOption, feedback })

export const additionalCourseCurricula = {
  'ia-educacion': [
    {
      title: 'Módulo 1 - Fundamentos de inteligencia artificial',
      lessons: [
        {
          ...lesson('ia-1-1', '1.1. Qué es la inteligencia artificial', 'Una introducción a los sistemas que reconocen patrones, generan contenido y apoyan decisiones, diferenciándolos de otras herramientas digitales.', ['Comprender conceptos básicos de IA.', 'Reconocer usos cotidianos de sistemas de IA.', 'Distinguir automatización, predicción y generación.']),
          video: {
            src: iaVideo11,
            poster: iaPoster11,
            title: '¿Qué es la inteligencia artificial?',
            duration: '2 min 34 s',
            objective: 'Comprender qué es la inteligencia artificial, cómo aprende a partir de datos y qué puede y no puede hacer.',
            reflection: '¿En qué momentos de tu día usás inteligencia artificial sin darte cuenta?',
          },
          reading: {
            type: 'guide',
            keyIdea: 'La inteligencia artificial no piensa ni entiende como una persona: aprende patrones a partir de muchos datos y los usa para clasificar, predecir o generar. Por eso puede ser muy útil y, a la vez, equivocarse con total seguridad.',
            objectives: ['Explicar con tus palabras qué es la inteligencia artificial.', 'Distinguir entre programar con reglas y aprender a partir de datos.', 'Reconocer usos cotidianos y escolares de clasificar, predecir y generar.'],
            sections: [
              { title: 'Reglas o ejemplos', text: 'Durante años, los programas siguieron reglas escritas por personas. Hoy, la mayor parte de la inteligencia artificial aprende de ejemplos: ve miles de casos y encuentra por sí misma los patrones. A eso se lo llama aprendizaje automático.' },
              { title: 'Tres grandes tareas', items: ['Clasificar: decidir a qué grupo pertenece algo, como el filtro de correo no deseado.', 'Predecir: estimar qué es probable que pase, como el tiempo de viaje en un mapa.', 'Generar: producir algo nuevo, como un texto, una imagen o un audio.'] },
              { title: 'Todo depende de los datos', text: 'Con datos variados y de calidad, el sistema funciona mejor. Con datos incompletos o con prejuicios, repite esas fallas: a eso lo llamamos sesgo.' },
              { title: 'Lo que no hace', items: ['No sabe si algo es verdadero: calcula la respuesta más probable.', 'No tiene intenciones ni valores propios.', 'Puede equivocarse con mucha seguridad.'] },
            ],
            practice: 'Cazadores de inteligencia artificial: en grupos, tus estudiantes listan los aparatos y aplicaciones que usaron ayer, marcan cuáles usan inteligencia artificial, los clasifican en clasificar, predecir o generar, y discuten qué datos necesita cada uno. La consigna completa está en la guía.',
          },
          materials: [{ label: 'Guía: Qué es la inteligencia artificial.pdf', href: iaGuide11 }],
          media: ['Video: ¿Qué es la inteligencia artificial?'],
        },
        {
          ...lesson('ia-1-2', '1.2. IA generativa y educación', 'Exploramos cómo los modelos generativos producen textos e imágenes y qué oportunidades y límites presentan para enseñar y aprender.', ['Identificar posibilidades educativas de la IA generativa.', 'Reconocer que sus respuestas pueden contener errores.', 'Formular consignas con una finalidad pedagógica.']),
          video: {
            src: iaVideo12,
            poster: iaPoster12,
            title: 'IA generativa: oportunidades y cuidados',
            duration: '2 min 19 s',
            objective: 'Comprender cómo funciona la IA generativa y reconocer oportunidades y cuidados para usarla en la enseñanza.',
            reflection: '¿Qué tarea de tu planificación te gustaría probar con una IA generativa, y qué revisarías antes de usar el resultado?',
          },
          reading: {
            type: 'guide',
            keyIdea: 'La IA generativa arma sus respuestas eligiendo, palabra por palabra, lo que es más probable. Puede ser una gran ayuda para planificar y explorar, pero sus resultados siempre se revisan: pueden sonar convincentes y estar equivocados.',
            objectives: ['Explicar cómo una IA generativa arma sus respuestas.', 'Identificar oportunidades para planificar y para trabajar con estudiantes.', 'Aplicar cuidados de verificación, privacidad y transparencia.'],
            sections: [
              { title: '¿Cómo arma una respuesta?', text: 'Un modelo de lenguaje aprendió, a partir de enormes cantidades de texto, qué palabras suelen ir juntas. Cuando le escribimos, arma la respuesta palabra por palabra eligiendo las más probables, como un autocompletar gigante. Por eso prioriza que el texto suene bien, no que sea cierto: a veces inventa datos, citas o libros. A esos errores se los llama alucinaciones.' },
              { title: 'Un asistente para tu planificación', items: ['Ideas para empezar una secuencia o un proyecto.', 'Ejercicios con distintos niveles de dificultad (resolvelos antes de usarlos).', 'Un texto adaptado para que sea más accesible.', 'Preguntas abiertas para iniciar un debate.'] },
              { title: 'Cuidados que no se negocian', items: ['No cargar datos personales de estudiantes ni de familias.', 'Revisar la edad mínima de cada herramienta: en general piden 13 años o más y permiso de un adulto para los menores.', 'Acordar con el grupo cuándo se usa y cómo se cuenta que se usó.'] },
            ],
            practice: 'Detectives de errores: compartí con tus estudiantes un texto generado sobre un tema que ya trabajaron. En parejas, marcan lo dudoso, lo verifican en el libro o la carpeta y reescriben lo incorrecto explicando cómo se dieron cuenta. En la guía tenés dos actividades más, una lista de verificación y un modelo de acuerdo de uso.',
          },
          materials: [{ label: 'Guía: IA generativa en la escuela.pdf', href: iaGuide12 }],
          media: ['Video: IA generativa: oportunidades y cuidados'],
        },
        {
          ...lesson('ia-1-3', '1.3. Cómo pedirle bien a la IA: consignas con propósito', 'La misma herramienta puede dar una respuesta genérica o una propuesta útil. Aprendemos a formular consignas claras y a revisar el resultado antes de llevarlo al aula.', ['Reconocer los cinco ingredientes de una consigna clara.', 'Reescribir consignas para obtener borradores útiles.', 'Revisar el resultado antes de llevarlo al aula.']),
          video: {
            src: iaVideo13,
            poster: iaPoster13,
            title: 'Consignas con propósito',
            duration: '2 min 1 s',
            objective: 'Formular consignas claras para obtener de la IA borradores útiles y revisarlos antes de llevarlos al aula.',
            reflection: '¿Qué consigna que ya usaste podrías reescribir con los cinco ingredientes?',
          },
          reading: {
            type: 'guide',
            keyIdea: 'Una buena consigna para la IA se parece a una buena consigna para el aula: dice para quién es, qué se necesita, en qué formato y con qué límites. Cuanto más contexto das, más útil es el borrador; y siempre lo revisás antes de usarlo.',
            objectives: ['Reconocer los cinco ingredientes de una consigna clara.', 'Reescribir consignas para obtener borradores útiles.', 'Revisar el resultado antes de llevarlo al aula.'],
            sections: [
              { title: 'Los cinco ingredientes', items: ['Rol: desde qué lugar querés que responda.', 'Contexto: el grupo, el grado, lo que ya trabajaron.', 'Tarea: qué necesitás exactamente.', 'Formato: cómo querés recibirlo.', 'Límites: qué evitar, qué extensión, qué nivel de lenguaje.'] },
              { title: 'Antes y después', text: 'En lugar de “Haceme una actividad sobre fracciones”, probá: “Sos docente de 5.º grado. Mis alumnos ya representan fracciones con dibujos. Proponé una actividad de 40 minutos para comparar fracciones con material concreto, en grupos de cuatro. Presentala en pasos numerados, con una pregunta de cierre. Usá lenguaje simple y no incluyas fracciones impropias.”' },
              { title: 'Antes de llevarlo al aula', items: ['¿Es correcto? Verificá datos, conceptos y resultados.', '¿Es adecuado para tu grupo?', '¿Qué le falta o qué le sobra?', 'Nunca incluyas nombres ni datos de tus estudiantes en la consigna.'] },
            ],
            practice: 'Tomá una consigna que ya hayas usado y reescribila con los cinco ingredientes. En la guía tenés una plantilla para completar, ejemplos de Lengua, Matemática, Ciencias Naturales e Historia, y la actividad “Mejoremos la pregunta” para trabajar con tus estudiantes.',
          },
          materials: [{ label: 'Guía: Consignas con propósito.pdf', href: iaGuide13 }],
          media: ['Video: Consignas con propósito'],
        },
        review('ia-1-review', [
          { ...question('ia-1-q1', '¿Qué hace un sistema de IA?', ['Comprende como una persona', 'Procesa datos para reconocer patrones o generar resultados', 'Garantiza respuestas verdaderas'], 1, 'La IA procesa datos mediante modelos; no comprende ni garantiza exactitud como una persona.'), lessonId: 'ia-1-1' },
          { ...question('ia-1-q2', '¿Qué precaución requiere la IA generativa?', ['Verificar críticamente sus resultados', 'Aceptar siempre la primera respuesta', 'Evitar definir un objetivo'], 0, 'Los resultados pueden ser incompletos, sesgados o incorrectos y deben verificarse.'), lessonId: 'ia-1-2' },
          { ...question('ia-1-q3', '¿Cuándo aporta valor educativo?', ['Cuando reemplaza toda decisión docente', 'Cuando se usa por novedad', 'Cuando responde a un objetivo de aprendizaje'], 2, 'La herramienta debe estar subordinada a una intención pedagógica clara.'), lessonId: 'ia-1-2' },
          { ...question('ia-1-q4', '¿Qué consigna probablemente dé un resultado más útil?', ['“Haceme una actividad de fracciones.”', 'Una que indique rol, contexto, tarea, formato y límites', 'Una que incluya los nombres de tus alumnos para personalizarla'], 1, 'Cuanto más contexto y precisión tiene la consigna, más útil es el borrador; y nunca se incluyen datos de estudiantes.'), lessonId: 'ia-1-3' },
        ]),
      ],
    },
    {
      title: 'Módulo 2 - Uso responsable y diseño de propuestas',
      lessons: [
        lesson('ia-2-1', '2.1. Privacidad, sesgos y autoría', 'Analizamos el cuidado de datos personales, los sesgos algorítmicos y la necesidad de transparentar el uso de IA en producciones educativas.', ['Proteger información sensible.', 'Detectar posibles sesgos.', 'Definir acuerdos de autoría y transparencia.']),
        lesson('ia-2-2', '2.2. Actividades con IA en el aula', 'Diseñamos actividades donde la IA funciona como apoyo para explorar, comparar, revisar y crear, sin desplazar el pensamiento del estudiante.', ['Diseñar consignas que promuevan pensamiento crítico.', 'Incluir instancias de verificación.', 'Evaluar tanto el proceso como el producto.']),
        review('ia-2-review', [
          question('ia-2-q1', '¿Qué dato no debería ingresarse en una IA pública?', ['Una consigna ficticia', 'Información personal sensible', 'Una pregunta conceptual'], 1, 'Los datos sensibles requieren protección y no deben compartirse en servicios sin garantías adecuadas.'),
          question('ia-2-q2', '¿Cómo se aborda un posible sesgo?', ['Comparando fuentes y perspectivas', 'Ocultando el resultado', 'Asumiendo neutralidad'], 0, 'Contrastar perspectivas permite detectar omisiones y representaciones sesgadas.'),
          question('ia-2-q3', '¿Qué actividad promueve pensamiento crítico?', ['Copiar una respuesta generada', 'Comparar la respuesta de la IA con fuentes confiables', 'Evaluar solo la redacción final'], 1, 'Comparar, justificar y corregir convierte el uso de IA en una oportunidad de aprendizaje.'),
        ]),
      ],
    },
  ],
  'evaluacion-formativa': [
    {
      title: 'Módulo 1 - Evidencias y criterios de evaluación',
      lessons: [
        lesson('ef-1-1', '1.1. Evaluar para acompañar el aprendizaje', 'La evaluación formativa recoge información durante el proceso para orientar decisiones docentes y próximos pasos del estudiante.', ['Diferenciar evaluación formativa y acreditación.', 'Reconocer evidencias durante el proceso.', 'Usar la información para ajustar la enseñanza.']),
        lesson('ef-1-2', '1.2. Criterios e instrumentos', 'Trabajamos la relación entre objetivos, criterios transparentes e instrumentos adecuados para observar aprendizajes relevantes.', ['Redactar criterios observables.', 'Alinear instrumentos con objetivos.', 'Comunicar expectativas con claridad.']),
        review('ef-1-review', [
          question('ef-1-q1', '¿Para qué sirve la evaluación formativa?', ['Para clasificar estudiantes', 'Para orientar mejoras durante el aprendizaje', 'Solo para emitir una nota'], 1, 'Su propósito central es producir información que permita mejorar mientras se aprende.'),
          question('ef-1-q2', '¿Qué debe estar alineado con el objetivo?', ['El criterio y la evidencia solicitada', 'El color del instrumento', 'La cantidad de páginas'], 0, 'La evidencia debe permitir observar el aprendizaje definido en el objetivo.'),
          question('ef-1-q3', '¿Qué caracteriza un criterio claro?', ['Describe un desempeño observable', 'Depende de impresiones generales', 'Se comunica después de evaluar'], 0, 'Los criterios observables y anticipados ayudan a comprender qué se espera.'),
        ]),
      ],
    },
    {
      title: 'Módulo 2 - Retroalimentación y mejora',
      lessons: [
        lesson('ef-2-1', '2.1. Retroalimentación efectiva', 'Una devolución útil reconoce avances, señala aspectos concretos y propone un próximo paso alcanzable.', ['Construir devoluciones específicas.', 'Priorizar información accionable.', 'Promover revisión y autonomía.']),
        lesson('ef-2-2', '2.2. Autoevaluación y evaluación entre pares', 'Las instancias de autoevaluación y revisión entre pares ayudan a apropiarse de criterios y tomar decisiones sobre el propio trabajo.', ['Diseñar pautas de autoevaluación.', 'Organizar intercambios respetuosos.', 'Usar criterios compartidos para revisar.']),
        review('ef-2-review', [
          question('ef-2-q1', '¿Qué devolución resulta más útil?', ['“Está mal”', 'Una observación específica con un próximo paso', 'Una calificación sin comentario'], 1, 'La especificidad permite comprender qué mejorar y cómo hacerlo.'),
          question('ef-2-q2', '¿Qué necesita la evaluación entre pares?', ['Criterios compartidos y acuerdos de respeto', 'Comentarios anónimos sin pauta', 'Competencia entre estudiantes'], 0, 'Los criterios y acuerdos orientan devoluciones pertinentes y cuidadas.'),
          question('ef-2-q3', '¿Qué favorece la autoevaluación?', ['La dependencia del docente', 'La reflexión sobre el propio proceso', 'La eliminación de criterios'], 1, 'Autoevaluarse permite reconocer logros, dificultades y estrategias de mejora.'),
        ]),
      ],
    },
  ],
  'experiencias-aprendizaje': [
    {
      title: 'Módulo 1 - Diseño centrado en el aprendizaje',
      lessons: [
        lesson('da-1-1', '1.1. Objetivos y resultados esperados', 'Partimos de aprendizajes relevantes y formulamos resultados claros para orientar actividades y evidencias.', ['Formular objetivos comprensibles.', 'Priorizar aprendizajes significativos.', 'Relacionar objetivos y evidencias.']),
        lesson('da-1-2', '1.2. Secuencias con sentido', 'Organizamos inicio, desarrollo y cierre como momentos articulados que recuperan saberes, permiten practicar y favorecen la síntesis.', ['Diseñar una progresión coherente.', 'Activar conocimientos previos.', 'Incluir instancias de cierre y reflexión.']),
        review('da-1-review', [
          question('da-1-q1', '¿Qué orienta el diseño de una experiencia?', ['El objetivo de aprendizaje', 'La herramienta más novedosa', 'La cantidad de actividades'], 0, 'El objetivo permite tomar decisiones coherentes sobre actividades y evaluación.'),
          question('da-1-q2', '¿Qué función tiene el inicio?', ['Asignar una nota', 'Activar saberes y presentar el desafío', 'Cerrar conclusiones'], 1, 'El inicio conecta lo que el grupo sabe con el nuevo recorrido.'),
          question('da-1-q3', '¿Qué hace coherente una secuencia?', ['La relación entre objetivos, actividades y evidencias', 'Usar un único formato', 'Evitar ajustes'], 0, 'La alineación entre esos elementos sostiene el sentido del recorrido.'),
        ]),
      ],
    },
    {
      title: 'Módulo 2 - Metodologías activas',
      lessons: [
        lesson('da-2-1', '2.1. Aprendizaje basado en desafíos', 'Los desafíos auténticos invitan a investigar, tomar decisiones y producir respuestas relevantes para un contexto.', ['Definir desafíos significativos.', 'Organizar etapas de investigación y producción.', 'Acompañar decisiones del grupo.']),
        lesson('da-2-2', '2.2. Participación y reflexión', 'Diseñamos oportunidades para que todas las personas participen, expliquen sus decisiones y reflexionen sobre cómo aprendieron.', ['Diversificar formas de participación.', 'Incluir momentos metacognitivos.', 'Recoger evidencias del proceso.']),
        review('da-2-review', [
          question('da-2-q1', '¿Qué caracteriza un desafío auténtico?', ['Tiene una única forma de resolución', 'Se vincula con una situación significativa', 'No requiere decisiones'], 1, 'La conexión con situaciones relevantes da propósito a la investigación y la producción.'),
          question('da-2-q2', '¿Qué promueve la metacognición?', ['Reflexionar sobre estrategias y aprendizajes', 'Repetir sin revisar', 'Ocultar dificultades'], 0, 'Reconocer cómo se aprende ayuda a transferir y mejorar estrategias.'),
          question('da-2-q3', '¿Cómo se amplía la participación?', ['Ofreciendo diversas formas de aportar', 'Pidiendo una respuesta idéntica', 'Eliminando el intercambio'], 0, 'La diversidad de formatos y roles reduce barreras y enriquece la experiencia.'),
        ]),
      ],
    },
  ],
  'educacion-inclusiva': [
    {
      title: 'Módulo 1 - Diversidad y barreras para el aprendizaje',
      lessons: [
        lesson('ei-1-1', '1.1. Una mirada inclusiva de la diversidad', 'La diversidad es una condición de todo grupo. Una enseñanza inclusiva anticipa diferencias y evita convertirlas en desigualdades.', ['Reconocer la diversidad del aula.', 'Cuestionar supuestos y etiquetas.', 'Valorar múltiples formas de aprender.']),
        lesson('ei-1-2', '1.2. Identificación de barreras', 'Analizamos barreras físicas, comunicacionales, didácticas y actitudinales para intervenir sobre el contexto.', ['Distinguir tipos de barreras.', 'Observar el entorno y las propuestas.', 'Planificar apoyos pertinentes.']),
        review('ei-1-review', [
          question('ei-1-q1', '¿Cómo entiende la inclusión la diversidad?', ['Como una excepción', 'Como una característica de todos los grupos', 'Como un problema individual'], 1, 'Todas las aulas son diversas y requieren propuestas flexibles.'),
          question('ei-1-q2', '¿Dónde pueden encontrarse barreras?', ['Solo en el estudiante', 'En el entorno, la comunicación y la propuesta', 'Únicamente en el edificio'], 1, 'La mirada inclusiva analiza cómo el contexto habilita o restringe la participación.'),
          question('ei-1-q3', '¿Qué acción es inclusiva?', ['Anticipar apoyos y alternativas', 'Separar siempre a quien necesita apoyo', 'Usar una única forma de enseñar'], 0, 'Anticipar opciones permite que más estudiantes participen desde el comienzo.'),
        ]),
      ],
    },
    {
      title: 'Módulo 2 - Accesibilidad y participación',
      lessons: [
        lesson('ei-2-1', '2.1. Diseño universal para el aprendizaje', 'El DUA propone múltiples formas de presentar información, participar y demostrar lo aprendido.', ['Comprender los principios del DUA.', 'Diversificar representaciones y acciones.', 'Mantener altas expectativas con apoyos.']),
        lesson('ei-2-2', '2.2. Convivencia y sentido de pertenencia', 'La inclusión también se construye en los vínculos, la escucha y la participación efectiva en la vida del grupo.', ['Construir acuerdos respetuosos.', 'Promover voces diversas.', 'Intervenir ante prácticas discriminatorias.']),
        review('ei-2-review', [
          question('ei-2-q1', '¿Qué propone el DUA?', ['Una adaptación única al final', 'Múltiples formas de acceso, participación y expresión', 'Reducir objetivos para todo el grupo'], 1, 'El DUA anticipa variabilidad y ofrece opciones desde el diseño.'),
          question('ei-2-q2', '¿Qué sostiene el sentido de pertenencia?', ['La escucha y la participación real', 'La homogeneidad del grupo', 'Evitar conversaciones difíciles'], 0, 'Ser escuchado y poder incidir fortalece la pertenencia.'),
          question('ei-2-q3', '¿Apoyo significa bajar expectativas?', ['Sí, siempre', 'No, permite acceder a objetivos valiosos', 'Solo en actividades digitales'], 1, 'Los apoyos eliminan barreras sin renunciar a aprendizajes significativos.'),
        ]),
      ],
    },
  ],
  'gestion-aula': [
    {
      title: 'Módulo 1 - Clima y organización del aula',
      lessons: [
        lesson('ga-1-1', '1.1. Un clima que favorece el aprendizaje', 'La seguridad, la confianza y las expectativas claras crean condiciones para participar, preguntar y aprender.', ['Reconocer dimensiones del clima escolar.', 'Construir vínculos de confianza.', 'Sostener expectativas claras y cuidadosas.']),
        lesson('ga-1-2', '1.2. Acuerdos y rutinas', 'Los acuerdos construidos y las rutinas comprensibles organizan tiempos, espacios y modos de participación.', ['Elaborar acuerdos con el grupo.', 'Diseñar rutinas funcionales.', 'Revisar acuerdos según evidencias.']),
        review('ga-1-review', [
          question('ga-1-q1', '¿Qué favorece un buen clima de aula?', ['El temor a equivocarse', 'La confianza y expectativas claras', 'Reglas que nadie comprende'], 1, 'La confianza permite participar y las expectativas claras orientan la convivencia.'),
          question('ga-1-q2', '¿Para qué sirven las rutinas?', ['Para organizar acciones recurrentes', 'Para impedir todo cambio', 'Para reemplazar los acuerdos'], 0, 'Las rutinas reducen incertidumbre y liberan atención para aprender.'),
          question('ga-1-q3', '¿Cómo se sostienen los acuerdos?', ['Se imponen una vez', 'Se explicitan, practican y revisan', 'Se mantienen aunque no funcionen'], 1, 'Los acuerdos necesitan comprensión, práctica y revisión colectiva.'),
        ]),
      ],
    },
    {
      title: 'Módulo 2 - Convivencia y resolución de conflictos',
      lessons: [
        lesson('ga-2-1', '2.1. El conflicto como oportunidad', 'Abordar conflictos implica escuchar perspectivas, reconocer necesidades y construir reparaciones posibles.', ['Diferenciar conflicto y violencia.', 'Escuchar perspectivas diversas.', 'Promover responsabilidad y reparación.']),
        lesson('ga-2-2', '2.2. Participación y cuidado colectivo', 'La participación en decisiones cotidianas fortalece la responsabilidad, el cuidado mutuo y la pertenencia al grupo.', ['Crear espacios de participación.', 'Distribuir responsabilidades.', 'Evaluar el bienestar del grupo.']),
        review('ga-2-review', [
          question('ga-2-q1', '¿Conflicto y violencia son equivalentes?', ['Sí', 'No, el conflicto puede abordarse sin violencia', 'Solo fuera del aula'], 1, 'El conflicto es parte de los vínculos; la violencia es una forma dañina de afrontarlo.'),
          question('ga-2-q2', '¿Qué ayuda a resolver un conflicto?', ['Escuchar perspectivas y acordar reparaciones', 'Buscar rápidamente un culpable', 'Ignorar lo ocurrido'], 0, 'Comprender necesidades y reparar daños permite reconstruir los vínculos.'),
          question('ga-2-q3', '¿Qué produce la participación estudiantil?', ['Mayor responsabilidad y pertenencia', 'Pérdida automática de autoridad', 'Menos compromiso'], 0, 'Participar en decisiones significativas fortalece el compromiso con lo acordado.'),
        ]),
      ],
    },
  ],
}
