import { NextApiRequest, NextApiResponse } from "next";

export const maxDuration = 30;
export const dynamic = "force-dynamic";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.headers.authorization !== `Bearer ${process.env.CRON_SECRET}`) {
    return res.status(401).end("Unauthorized");
  }

  res.status(200).end("알림 테스트");
}
