import Queue from 'bull'
import { Identity } from './models'
export const crawlQueue = Queue('crawl', process.env.REDIS_URL)

export async function queueHasRunningJobsForSub (q: Queue.Queue, sub: Identity['sub']): Promise<boolean> {
  const running = await q.getJobs(['waiting', 'delayed', 'active'])
  return running.filter(job => job.data.sub === sub).length > 0
}
