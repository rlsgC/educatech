import { recordActivity } from '../data/dashboardState'

export function recordResourceDownload(resource) {
  recordActivity({
    id: `resource:${resource.id}`,
    type: 'resource',
    title: 'Descargaste un recurso',
    detail: resource.title.replace(/\.[a-z]+$/i, ''),
    courseId: resource.courseId,
  })
}
