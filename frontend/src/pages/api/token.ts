// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { Response } from "../../app/interfaces";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Response>
) {
  const { token } = JSON.parse(req.body);
  const data = await fetch(
    `${process.env.NEXT_PUBLIC_SERVER_URL}/api/auth/token`,
    {
      method: "POST",
      body: JSON.stringify({ token }),
      headers: new Headers({ "content-type": "application/json" }),
    }
  );
  const result = await data.json();
  res.status(200).json({ data: result });
}
