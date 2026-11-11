import { useActivities } from '../data/dashboardState'
import { getWeekActivity } from './learning'

export const WEEKLY_GOAL_DAYS = 5

export function useWeeklyGoal() {
  const week = getWeekActivity(useActivities())
  const done = week.filter(day => day.done).length
  return { week, done, goal: WEEKLY_GOAL_DAYS, percentage: Math.min(100, Math.round((done / WEEKLY_GOAL_DAYS) * 100)) }
}
