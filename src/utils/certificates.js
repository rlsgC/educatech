import { courses } from '../data/courses'
import { currentProfile } from '../data/profile'
import { categoryLabel, courseTone } from './learning'

const normalize = text => (text || '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().trim()

export function certificateCourse(certificate) {
  return courses.find(course => course.id === certificate.courseId)
    ?? courses.find(course => normalize(course.title) === normalize(certificate.course))
    ?? null
}

export function parseCertificateDate(value) {
  const [day, month, year] = String(value || '').split('/').map(Number)
  const date = new Date(year, (month || 1) - 1, day || 1)
  return Number.isNaN(date.getTime()) ? new Date(0) : date
}

export function certificateCode(certificate) {
  const year = parseCertificateDate(certificate.date).getFullYear() || new Date().getFullYear()
  const id = String(certificate.id)
  const number = /^\d+$/.test(id)
    ? Number(id)
    : [...id].reduce((hash, char) => (hash * 31 + char.charCodeAt(0)) % 9000, 7) + 1000
  return `ET-${year}-${String(number).padStart(4, '0')}`
}

export function describeCertificate(certificate) {
  const course = certificateCourse(certificate)
  return {
    ...certificate,
    courseData: course,
    category: course ? categoryLabel(course.category) : 'Formación docente',
    tone: course ? courseTone(course) : 'amber',
    hours: course?.duration ?? null,
    code: certificateCode(certificate),
  }
}

export function sortCertificates(certificates) {
  return [...certificates].sort((a, b) => parseCertificateDate(b.date) - parseCertificateDate(a.date))
}

const VIOLET = [91, 63, 163]
const VIOLET_SOFT = [238, 233, 248]
const DEEP = [42, 31, 77]
const AMBER = [245, 184, 61]
const AMBER_SOFT = [253, 241, 214]
const MUTED = [107, 101, 120]
const INK = [31, 26, 51]

function drawCertificate(doc, certificate) {
  const width = doc.internal.pageSize.getWidth()
  const height = doc.internal.pageSize.getHeight()
  const center = width / 2

  doc.setFillColor(253, 251, 255)
  doc.rect(0, 0, width, height, 'F')
  doc.setFillColor(...VIOLET_SOFT)
  doc.circle(18, 18, 46, 'F')
  doc.setFillColor(...AMBER_SOFT)
  doc.circle(width - 14, height - 10, 52, 'F')

  doc.setDrawColor(...VIOLET)
  doc.setLineWidth(1.2)
  doc.roundedRect(10, 10, width - 20, height - 20, 4, 4, 'S')
  doc.setDrawColor(...VIOLET_SOFT)
  doc.setLineWidth(3)
  doc.roundedRect(16, 16, width - 32, height - 32, 3, 3, 'S')

  doc.setFont('helvetica', 'bold')
  doc.setFontSize(11)
  doc.setTextColor(...VIOLET)
  doc.text('EDUCATECH  ·  FORMACIÓN DOCENTE', center, 42, { align: 'center', charSpace: 1 })

  doc.setFont('times', 'bold')
  doc.setFontSize(34)
  doc.setTextColor(...DEEP)
  doc.text(certificate.sample ? 'Certificado de muestra' : 'Certificado de aprobación', center, 62, { align: 'center' })

  doc.setFont('helvetica', 'normal')
  doc.setFontSize(13)
  doc.setTextColor(...MUTED)
  doc.text('Se certifica que', center, 80, { align: 'center' })

  doc.setFont('times', 'bold')
  doc.setFontSize(32)
  doc.setTextColor(...INK)
  doc.text(currentProfile.fullName, center, 98, { align: 'center' })
  doc.setDrawColor(231, 226, 240)
  doc.setLineWidth(0.6)
  doc.line(center - 70, 103, center + 70, 103)

  doc.setFont('helvetica', 'normal')
  doc.setFontSize(13)
  doc.setTextColor(...MUTED)
  doc.text('completó satisfactoriamente el curso', center, 116, { align: 'center' })

  doc.setFont('helvetica', 'bold')
  doc.setFontSize(20)
  doc.setTextColor(...VIOLET)
  const titleLines = doc.splitTextToSize(certificate.courseData?.title ?? certificate.course, width - 90)
  doc.text(titleLines, center, 130, { align: 'center' })

  const detailY = 130 + titleLines.length * 8
  if (certificate.hours) {
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(11)
    doc.setTextColor(...MUTED)
    doc.text(`${certificate.category} · ${certificate.hours}`, center, detailY, { align: 'center' })
  }

  const rowY = height - 42
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(9)
  doc.setTextColor(...MUTED)
  doc.text('FECHA', center - 55, rowY - 6, { align: 'center' })
  doc.text('CÓDIGO', center + 55, rowY - 6, { align: 'center' })
  doc.setFontSize(13)
  doc.setTextColor(...INK)
  doc.text(String(certificate.date), center - 55, rowY + 2, { align: 'center' })
  doc.text(certificate.code, center + 55, rowY + 2, { align: 'center' })

  doc.setFillColor(...AMBER_SOFT)
  doc.circle(center, rowY - 2, 17, 'F')
  doc.setFillColor(...AMBER)
  doc.circle(center, rowY - 2, 13, 'F')
  doc.setDrawColor(...DEEP)
  doc.setLineWidth(1)
  doc.circle(center, rowY - 5, 5, 'S')
  doc.line(center - 3, rowY - 1, center - 4.5, rowY + 6)
  doc.line(center + 3, rowY - 1, center + 4.5, rowY + 6)

  if (certificate.sample) {
    doc.setFont('helvetica', 'italic')
    doc.setFontSize(9)
    doc.setTextColor(...MUTED)
    doc.text('Demostración sin validez oficial', center, height - 20, { align: 'center' })
  }
}

const fileSlug = text => normalize(text).replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')

export async function downloadCertificatePdf(certificates, fileName) {
  const list = Array.isArray(certificates) ? certificates : [certificates]
  if (!list.length) return
  const { jsPDF } = await import('jspdf')
  const doc = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' })
  list.forEach((certificate, index) => {
    if (index > 0) doc.addPage('a4', 'landscape')
    drawCertificate(doc, certificate.code ? certificate : describeCertificate(certificate))
  })
  doc.setProperties({ title: list.length === 1 ? `Certificado - ${list[0].course}` : 'Certificados EducaTech', author: 'EducaTech' })
  doc.save(fileName ?? (list.length === 1 ? `certificado-${fileSlug(list[0].course)}.pdf` : 'certificados-educatech.pdf'))
}
