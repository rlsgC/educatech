import { classroomIdeas } from '../data/classroomIdeas'
import { courses } from '../data/courses'
import { recordResourceDownload } from './activityLog'

// Ordena las ideas: primero las del curso que el docente está haciendo,
// después las que coinciden con su nivel y su área.
export function rankClassroomIdeas({ courseId, activeCourseIds = [], preferences }) {
  const levels = preferences?.levels ?? []
  const areas = preferences?.areas ?? []
  const score = idea => {
    let value = 0
    if (courseId && idea.courseIds.includes(courseId)) value += 6
    if (idea.courseIds.some(id => activeCourseIds.includes(id))) value += 2
    if (levels.some(level => idea.levels.includes(level))) value += 3
    if (areas.some(area => idea.areas.includes(area))) value += 3
    else if (idea.areas.includes('Todas')) value += 1
    return value
  }
  return classroomIdeas
    .map((idea, index) => ({ idea, index, value: score(idea) }))
    .sort((a, b) => b.value - a.value || a.index - b.index)
    .map(item => item.idea)
}

export function ideaAudience(idea, preferences) {
  const level = preferences?.levels?.find(item => idea.levels.includes(item)) ?? idea.levels.join(' / ')
  const area = preferences?.areas?.find(item => idea.areas.includes(item))
    ?? (idea.areas.includes('Todas') ? 'Todas las áreas' : idea.areas[0])
  return { level, area }
}

const VIOLET = [91, 63, 163]
const DEEP = [42, 31, 77]
const INK = [31, 26, 51]
const MUTED = [107, 101, 120]
const AMBER = [245, 184, 61]
const LAVENDER = [239, 231, 248]

const slug = text => text.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')

export async function downloadIdeaPdf(idea, preferences) {
  const { jsPDF } = await import('jspdf')
  const doc = new jsPDF({ unit: 'mm', format: 'a4' })
  const width = doc.internal.pageSize.getWidth()
  const height = doc.internal.pageSize.getHeight()
  const margin = 20
  const textWidth = width - margin * 2
  let y = 0

  const ensureSpace = needed => {
    if (y + needed <= height - 22) return
    doc.addPage()
    y = 24
  }

  doc.setFillColor(...DEEP)
  doc.rect(0, 0, width, 46, 'F')
  doc.setFillColor(...AMBER)
  doc.circle(width - 26, 14, 4, 'F')
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(10)
  doc.setTextColor(...AMBER)
  doc.text('LLEVALO AL AULA · FICHA DE ACTIVIDAD', margin, 16)
  doc.setFontSize(22)
  doc.setTextColor(255, 255, 255)
  const titleLines = doc.splitTextToSize(idea.title, textWidth - 20)
  doc.text(titleLines, margin, 29)
  y = 58

  const { level, area } = ideaAudience(idea, preferences)
  const meta = [
    ['Nivel', level],
    ['Área', area],
    ['Duración', `${idea.minutes} minutos`],
    ['Trabajo', idea.grouping],
    ['Conexión', idea.offline ? 'No necesita internet' : 'Necesita internet'],
  ]
  const cellWidth = textWidth / meta.length
  doc.setFillColor(...LAVENDER)
  doc.roundedRect(margin, y - 7, textWidth, 20, 3, 3, 'F')
  meta.forEach(([label, value], index) => {
    const x = margin + 4 + index * cellWidth
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(7.5)
    doc.setTextColor(...VIOLET)
    doc.text(label.toUpperCase(), x, y)
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(9)
    doc.setTextColor(...INK)
    doc.text(doc.splitTextToSize(value, cellWidth - 6).slice(0, 2), x, y + 5.5)
  })
  y += 24

  const paragraph = (text, size = 11, color = INK) => {
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(size)
    doc.setTextColor(...color)
    const lines = doc.splitTextToSize(text, textWidth)
    ensureSpace(lines.length * 5.6)
    doc.text(lines, margin, y)
    y += lines.length * 5.6
  }

  const heading = text => {
    ensureSpace(16)
    y += 4
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(12.5)
    doc.setTextColor(...VIOLET)
    doc.text(text, margin, y)
    y += 7
  }

  const list = (items, numbered) => {
    items.forEach((item, index) => {
      doc.setFont('helvetica', 'normal')
      doc.setFontSize(11)
      const lines = doc.splitTextToSize(item, textWidth - 10)
      ensureSpace(lines.length * 5.6 + 2)
      doc.setTextColor(...VIOLET)
      doc.setFont('helvetica', 'bold')
      doc.text(numbered ? `${index + 1}.` : '•', margin + 1, y)
      doc.setFont('helvetica', 'normal')
      doc.setTextColor(...INK)
      doc.text(lines, margin + 9, y)
      y += lines.length * 5.6 + 2
    })
  }

  paragraph(idea.summary, 12)
  heading('Propósito')
  paragraph(idea.purpose)
  heading('Materiales')
  list(idea.materials, false)
  heading('Paso a paso')
  list(idea.steps, true)
  heading('Cierre')
  paragraph(idea.closing)
  heading('Para adaptar')
  paragraph(idea.adapt, 11, MUTED)

  const related = idea.courseIds.map(id => courses.find(course => course.id === id)?.title).filter(Boolean)
  if (related.length) {
    ensureSpace(14)
    y += 6
    doc.setDrawColor(231, 226, 240)
    doc.line(margin, y - 4, width - margin, y - 4)
    paragraph(`Relacionada con: ${related.join(' · ')}`, 9.5, MUTED)
  }

  const pages = doc.getNumberOfPages()
  for (let page = 1; page <= pages; page += 1) {
    doc.setPage(page)
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(8.5)
    doc.setTextColor(...MUTED)
    doc.text('educatech · Formación docente', margin, height - 10)
    if (pages > 1) doc.text(`${page} / ${pages}`, width - margin, height - 10, { align: 'right' })
  }

  doc.setProperties({ title: `Ficha - ${idea.title}`, author: 'educatech' })
  doc.save(`ficha-${slug(idea.title)}.pdf`)
  recordResourceDownload({ id: `ficha-${idea.id}`, title: `Ficha: ${idea.title}`, courseId: idea.courseIds[0] })
}
