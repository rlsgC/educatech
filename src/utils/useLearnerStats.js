import { useCertificates } from '../data/certificateState'
import { courses } from '../data/courses'
import { isCourseFinished, useEnrolledCourses } from '../data/courseState'
import { useActivities } from '../data/dashboardState'
import { appliedIdeas, useLearningState } from '../data/learningState'
import { computeLearnerStats } from './progress'

export function useLearnerStats() {
  const activities = useActivities()
  const certificates = useCertificates()
  const enrolled = useEnrolledCourses(courses)
  const finished = enrolled.filter(isCourseFinished)
  const learning = useLearningState()
  return computeLearnerStats({ activities, certificates, enrolled, finished, applied: appliedIdeas(learning).length })
}
