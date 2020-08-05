import { NextApiRequest, NextApiResponse } from 'next'

/**
 *
 * // temp
 * // clouds
 * // wind
 * // tide
 */
export default (req: NextApiRequest, res: NextApiResponse) => {
  res.status(200).json({ name: 'John Doe' })
}
