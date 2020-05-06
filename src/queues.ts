import Queue from 'bull'
export const crawlQueue = Queue('crawl', process.env.REDIS_URL)
