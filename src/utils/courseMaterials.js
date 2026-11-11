import { courseCurricula, courses } from '../data/courses'
import { cleanLessonTitle, moduleName } from './session'

const lessonNumber = title => (String(title).match(/^(\d+(?:\.\d+)*)\.?\s/) ?? [])[1] ?? null
const formatOf = label => (String(label).match(/\.([a-z0-9]+)$/i)?.[1] ?? 'PDF').toUpperCase()

// Arma una carpeta por curso: sus módulos y, en cada lección, el video y las guías juntos.
export function getCourseFolders() {
  return courses.map(course => {
    const modules = (courseCurricula[course.id] ?? []).map((module, index) => ({
      id: `${course.id}:m${index + 1}`,
      number: index + 1,
      name: moduleName(module.title),
      lessons: (module.lessons ?? [])
        .filter(lesson => lesson.type !== 'review')
        .map(lesson => ({
          id: lesson.id,
          number: lessonNumber(lesson.title),
          title: cleanLessonTitle(lesson.title),
          video: lesson.video?.src ? lesson.video : null,
          files: (lesson.materials ?? []).filter(material => material?.href).map(material => ({
            href: material.href,
            fileName: material.label,
            format: formatOf(material.label),
            title: String(material.label).replace(/\.[a-z0-9]+$/i, ''),
          })),
        }))
        .filter(lesson => lesson.video || lesson.files.length),
    })).filter(module => module.lessons.length)
    const lessons = modules.flatMap(module => module.lessons)
    return {
      course,
      modules,
      videos: lessons.filter(lesson => lesson.video).length,
      files: lessons.reduce((total, lesson) => total + lesson.files.length, 0),
    }
  }).filter(folder => folder.modules.length)
}

// Reúne los videos y archivos que ya están cargados dentro de las lecciones de cada curso.
export function getCourseMaterials() {
  const items = []
  courses.forEach(course => {
    (courseCurricula[course.id] ?? []).forEach(module => {
      (module.lessons ?? []).forEach(lesson => {
        const number = lessonNumber(lesson.title)
        const where = `${course.title}${number ? ` · Lección ${number}` : ''}`
        if (lesson.video?.src) {
          items.push({
            id: `video:${course.id}:${lesson.id}`,
            kind: 'video',
            title: lesson.video.title || lesson.title,
            duration: lesson.video.duration ?? null,
            src: lesson.video.src,
            objective: lesson.video.objective ?? null,
            course,
            lessonTitle: lesson.title,
            where,
          })
        }
        ;(lesson.materials ?? []).forEach((material, index) => {
          if (!material?.href) return
          items.push({
            id: `file:${course.id}:${lesson.id}:${index}`,
            kind: 'file',
            title: String(material.label).replace(/\.[a-z0-9]+$/i, ''),
            format: (String(material.label).match(/\.([a-z0-9]+)$/i)?.[1] ?? 'PDF').toUpperCase(),
            href: material.href,
            fileName: material.label,
            course,
            lessonTitle: lesson.title,
            where,
          })
        })
      })
    })
  })
  return items
}
