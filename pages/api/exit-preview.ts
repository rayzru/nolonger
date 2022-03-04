import { NextApiResponse, NextApiRequest } from 'next';
import { exitPreview } from '@prismicio/next';

export default async function exit(req: NextApiRequest, res: NextApiResponse) {
  await exitPreview({ res, req });
}
