// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { Response } from "../../../app/interfaces";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Response>
) {
  if (req.headers["authorization"]) {
    const data = await fetch(
      `${process.env.NEXT_PUBLIC_SERVER_URL}/api/users/me`,
      {
        method: "GET",
        headers: new Headers({
          "content-type": "application/json",
          authorization: req.headers["authorization"],
        }),
      }
    );
    const result = await data.json();
    if (result.status === "TOKEN_INVALID") {
      res.status(401).json({ message: "Unauthorized" });
    } else res.status(200).json({ data: result.data });
  } else {
    res.status(400).json({ data: { message: "no token found" } });
  }
}
