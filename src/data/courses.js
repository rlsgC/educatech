import classroomVideo from '../assets/videos/Las_TIC_y_el_cambio_educativo.mp4'
import { lessonMedia, questionLessons } from './lessonMedia'
import digitalCompetenceVideo from '../assets/videos/Competencia_Digital_Docente.mp4'
import digitalCompetencePdf from '../assets/pdfs/Competencias_Digitales_Docentes.pdf'
import activityCompletionVideo from '../assets/videos/Finalización_actividad.mp4'
import virtualClassroomDesignPdf from '../assets/pdfs/Diseno_de_Aulas_Virtuales.pdf'
import { additionalCourseCurricula } from './additionalCurricula'
import { curriculumSupplements } from './curriculumExpansion'
import { reviewActivities } from './reviewActivities'

const courseList = [
  {
    id: 'herramientas-digitales',
    title: 'Herramientas digitales en el aula',
    category: 'Tecnologia educativa',
    duration: '20 horas',
    modality: 'Autogestionado',
    progress: 62,
    status: 'En progreso',
    imageTone: 'violet',
    coverTone: 'violet',
    description:
      'Un recorrido practico para integrar recursos digitales en clases presenciales, hibridas y virtuales.',
    provider: 'EducaTech Formacion Docente',
    priorityAxis: 'Innovacion pedagogica y cultura digital',
    teachingHours: '20 horas catedra',
    certificationType: 'Certificado digital de aprobacion',
    schedule: {
      enrollmentStatus: 'Inscripcion abierta',
      startDate: '01/10/2026',
      endDate: '30/10/2026',
      meetings: '5 encuentros asincronicos',
      place: 'Campus virtual EducaTech',
    },
    audience: {
      cargos: ['Docente', 'Profesional Universitario', 'Profesional No Universitario', 'Tecnico Ministerial'],
      modalidades: ['Presencial', 'Virtual', 'Autogestionado'],
      niveles: ['Inicial', 'Primario', 'Secundario'],
      areas: ['Todas'],
    },
  },
  {
    id: 'ia-educacion',
    title: 'Inteligencia artificial en educacion',
    category: 'Tecnologia educativa',
    duration: '30 horas',
    modality: 'Autogestionado',
    progress: 28,
    status: 'En progreso',
    imageTone: 'blue',
    description:
      'Conceptos, criterios y casos de uso para incorporar IA en propuestas educativas con mirada pedagogica.',
  },
  {
    id: 'evaluacion-formativa',
    title: 'Evaluacion formativa',
    category: 'Evaluacion',
    duration: '15 horas',
    modality: 'Autogestionado',
    progress: 100,
    status: 'Finalizado',
    imageTone: 'green',
    description:
      'Estrategias para acompanar aprendizajes, retroalimentar procesos y disenar evidencias significativas.',
  },
  {
    id: 'experiencias-aprendizaje',
    title: 'Diseno de experiencias de aprendizaje',
    category: 'Metodologias',
    duration: '25 horas',
    modality: 'Autogestionado',
    progress: 0,
    status: 'Disponible',
    imageTone: 'amber',
    description:
      'Herramientas para planificar secuencias activas, claras y centradas en el estudiante.',
  },
  {
    id: 'educacion-inclusiva',
    title: 'Educacion inclusiva y diversidad',
    category: 'Inclusion',
    duration: '20 horas',
    modality: 'Autogestionado',
    progress: 100,
    status: 'Certificado',
    imageTone: 'rose',
    description:
      'Criterios para construir aulas accesibles, participativas y respetuosas de la diversidad.',
  },
  {
    id: 'gestion-aula',
    title: 'Gestion del aula y convivencia',
    category: 'Gestion',
    duration: '15 horas',
    modality: 'Autogestionado',
    progress: 0,
    status: 'Disponible',
    imageTone: 'teal',
    description:
      'Practicas para sostener acuerdos, participacion y vinculos saludables dentro del aula.',
  },
  {
    id: 'aprendizaje-proyectos',
    title: 'Aprendizaje basado en proyectos',
    category: 'Metodologias',
    duration: '24 horas',
    modality: 'Autogestionado',
    status: 'Disponible',
    imageTone: 'amber',
    description: 'Diseño de proyectos auténticos que articulan investigación, producción, colaboración y evaluación.',
  },
  {
    id: 'aula-invertida',
    title: 'Aula invertida',
    category: 'Metodologias',
    duration: '18 horas',
    modality: 'Autogestionado',
    status: 'Disponible',
    imageTone: 'blue',
    description: 'Claves para preparar materiales previos y aprovechar el encuentro en actividades de aplicación.',
  },
  {
    id: 'diseno-rubricas',
    title: 'Diseño de rúbricas',
    category: 'Evaluacion',
    duration: '18 horas',
    modality: 'Autogestionado',
    status: 'Disponible',
    imageTone: 'green',
    description: 'Criterios y descriptores claros para evaluar producciones y orientar revisiones formativas.',
  },
  {
    id: 'recursos-accesibles',
    title: 'Recursos digitales accesibles',
    category: 'Inclusion',
    duration: '20 horas',
    modality: 'Autogestionado',
    status: 'Disponible',
    imageTone: 'rose',
    description: 'Pautas prácticas para crear documentos, imágenes, videos y actividades con menos barreras.',
  },
]

const courseProfiles = {
  'herramientas-digitales': { objectives: ['Seleccionar herramientas según propósitos pedagógicos.', 'Diseñar contenidos y actividades digitales claras.', 'Evaluar una implementación con criterios de privacidad y acceso.'], levels: ['Inicial', 'Primario', 'Secundario'], areas: ['Todas'] },
  'ia-educacion': { objectives: ['Comprender posibilidades y límites de la IA.', 'Diseñar actividades que sostengan el pensamiento crítico.', 'Aplicar criterios de privacidad, verificación y transparencia.'], levels: ['Primario', 'Secundario', 'Superior'], areas: ['Todas'] },
  'evaluacion-formativa': { objectives: ['Recoger evidencias durante el aprendizaje.', 'Construir retroalimentaciones accionables.', 'Usar instrumentos digitales para ajustar la enseñanza.'], levels: ['Inicial', 'Primario', 'Secundario'], areas: ['Todas'] },
  'experiencias-aprendizaje': { objectives: ['Formular objetivos y evidencias coherentes.', 'Diseñar secuencias activas y viables.', 'Ajustar la planificación a partir de evidencias.'], levels: ['Inicial', 'Primario', 'Secundario'], areas: ['Todas'] },
  'educacion-inclusiva': { objectives: ['Reconocer barreras para el aprendizaje.', 'Planificar apoyos sin reducir expectativas.', 'Aplicar principios del Diseño Universal para el Aprendizaje.'], levels: ['Inicial', 'Primario', 'Secundario'], areas: ['Todas'] },
  'gestion-aula': { objectives: ['Construir rutinas que favorezcan autonomía.', 'Abordar conflictos desde el diálogo.', 'Revisar acuerdos de convivencia con el grupo.'], levels: ['Inicial', 'Primario', 'Secundario'], areas: ['Todas'] },
  'aprendizaje-proyectos': { objectives: ['Formular preguntas guía auténticas.', 'Organizar investigación y producción colaborativa.', 'Evaluar producto y proceso con criterios claros.'], levels: ['Primario', 'Secundario'], areas: ['Ciencias', 'Ciencias sociales', 'Lengua', 'Tecnologia'] },
  'aula-invertida': { objectives: ['Diseñar un trabajo previo breve y accesible.', 'Planificar encuentros centrados en aplicación.', 'Mejorar la propuesta mediante evidencias de acceso y aprendizaje.'], levels: ['Primario', 'Secundario', 'Superior'], areas: ['Todas'] },
  'diseno-rubricas': { objectives: ['Derivar criterios desde los objetivos.', 'Redactar descriptores progresivos y observables.', 'Usar rúbricas para autoevaluar y revisar.'], levels: ['Primario', 'Secundario', 'Superior'], areas: ['Todas'] },
  'recursos-accesibles': { objectives: ['Identificar barreras en recursos digitales.', 'Crear alternativas para texto, imagen y audiovisual.', 'Comprobar estructura y navegación antes de publicar.'], levels: ['Inicial', 'Primario', 'Secundario'], areas: ['Todas'] },
}

export const courses = courseList.map(course => ({
  provider: course.provider || 'EducaTech Formacion Docente',
  priorityAxis: course.priorityAxis || 'Formacion docente demostrativa',
  teachingHours: course.teachingHours || course.duration,
  certificationType: course.certificationType || 'Constancia de recorrido demostrativo',
  ...course,
  objectives: courseProfiles[course.id].objectives,
  audience: course.audience || { cargos: ['Docente'], modalidades: ['Autogestionado'], niveles: courseProfiles[course.id].levels, areas: courseProfiles[course.id].areas },
}))

const courseModulesData = [
  {
    title: 'Modulo 1 - Introduccion',
    lessons: [
      {
        id: '1-1',
        video: {
          src: classroomVideo,
          title: 'Las TIC y el cambio educativo',
          duration: '7 min 47 s',
          objective: 'Comprender cómo integrar las tecnologías digitales con una finalidad pedagógica y reconocer oportunidades para aplicarlas en el aula',
          reflection: '¿Qué práctica de tu aula podrías mejorar con una herramienta digital?',
        },
        title: '1.1. La transformacion digital en la educacion',
        intro:
          'La transformacion digital no consiste solo en incorporar herramientas: implica revisar practicas, tiempos, vinculos y decisiones pedagogicas para ampliar las oportunidades de aprendizaje.',
        objectives: [
          'Comprender el concepto de transformacion digital.',
          'Identificar oportunidades en el contexto educativo.',
          'Reflexionar sobre el rol del docente en la era digital.',
        ],
        materials: ['Presentacion: Transformacion digital.pdf'],
        media: ['Video: Educacion en la era digital'],
      },
      {
        id: '1-2',
        video: {
          src: digitalCompetenceVideo,
          title: 'Competencia digital docente',
          objective: 'Reconocer las competencias digitales que permiten integrar la tecnología con sentido pedagógico en la práctica docente.',
          reflection: '¿Qué competencia digital te gustaría fortalecer para mejorar tus propuestas de enseñanza?',
        },
        title: '1.2. Competencias digitales docentes',
        intro:
          'En esta leccion vas a reconocer habilidades digitales clave para seleccionar, adaptar y evaluar recursos con intencion educativa.',
        objectives: [
          'Reconocer competencias digitales docentes.',
          'Relacionar habilidades tecnicas con decisiones pedagogicas.',
          'Detectar necesidades de mejora profesional.',
        ],
        materials: [{
          label: 'Competencias Digitales Docentes.pdf',
          href: digitalCompetencePdf,
        }],
      },
      {
        id: '1-3',
        video: {
          src: activityCompletionVideo,
          title: 'Finalización de actividades',
          objective: 'Reconocer cómo organizar el cierre y la finalización de actividades dentro de un entorno virtual de aprendizaje.',
          reflection: '¿Qué indicaciones y evidencias ayudarían a tus estudiantes a reconocer que completaron una actividad virtual?',
        },
        title: '1.3. Entornos virtuales de aprendizaje',
        intro:
          'Los entornos virtuales organizan contenidos, interacciones y seguimiento. Su valor aparece cuando responden a una experiencia de aprendizaje clara.',
        objectives: [
          'Distinguir funciones de un entorno virtual.',
          'Organizar recursos y actividades en una secuencia.',
          'Definir criterios de seguimiento para cursantes.',
        ],
        materials: [{
          label: 'Diseño de Aulas Virtuales.pdf',
          href: virtualClassroomDesignPdf,
        }],
      },
      reviewActivities[1],
    ],
  },
  { title: 'Modulo 2 - Herramientas colaborativas', lessons: [reviewActivities[2]] },
  { title: 'Modulo 3 - Creacion de contenidos', lessons: [reviewActivities[3]] },
  { title: 'Modulo 4 - Evaluacion con tecnologia', lessons: [reviewActivities[4]] },
  { title: 'Modulo 5 - Buenas practicas en el aula', lessons: [reviewActivities[5]] },
]

const numberReviewActivities = modules => modules.map((module, moduleIndex) => ({
  ...module,
  lessons: module.lessons.map((lesson, lessonIndex) => lesson.type === 'review'
    ? { ...lesson, title: `${moduleIndex + 1}.${lessonIndex + 1}. Actividad de repaso` }
    : lesson),
}))

export const courseModules = numberReviewActivities(courseModulesData)

const mergeCurriculum = (courseId, baseModules = []) => {
  const supplements = curriculumSupplements[courseId] || []
  if (courseId !== 'herramientas-digitales') return numberReviewActivities([...baseModules, ...supplements])
  const completedModules = baseModules.map((baseModule, index) => {
    if (index === 0) return baseModule
    const supplement = supplements[index - 1]
    return supplement ? { ...baseModule, lessons: [...supplement.lessons.filter(item => item.type !== 'review'), ...baseModule.lessons] } : baseModule
  })
  return numberReviewActivities(completedModules)
}

// Suma a cada lección su video, su guía PDF y su lectura (lessonMedia.js), sin pisar lo que ya tenía.
const withMedia = modules => modules.map(module => ({
  ...module,
  lessons: module.lessons.map(lesson => {
    if (lesson.type === 'review') {
      return { ...lesson, questions: lesson.questions?.map(question => (question.lessonId || !questionLessons[question.id] ? question : { ...question, lessonId: questionLessons[question.id] })) }
    }
    const media = lessonMedia[lesson.id]
    if (!media) return lesson
    const files = (lesson.materials ?? []).filter(material => typeof material !== 'string')
    return {
      ...lesson,
      video: lesson.video ?? media.video,
      reading: lesson.reading ?? media.reading,
      materials: files.some(material => material.href === media.guide.href) ? files : [...files, media.guide],
    }
  }),
}))

export const courseCurricula = Object.fromEntries(courses.map(course => [
  course.id,
  withMedia(mergeCurriculum(course.id, course.id === 'herramientas-digitales' ? courseModulesData : additionalCourseCurricula[course.id])),
]))
