// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { Response } from "../../../app/interfaces";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Response>
) {
  if (req.headers["authorization"]) {
    let data, result;
    switch (req.method) {
      case "GET":
        data = await fetch(
          `${process.env.NEXT_PUBLIC_SERVER_URL}/api/videos/me`,
          {
            method: "GET",
            headers: new Headers({
              "content-type": "application/json",
              authorization: req.headers["authorization"],
            }),
          }
        );
        result = await data.json();
        if (result.status === "TOKEN_INVALID") {
          res.status(401).json({ message: "Unauthorized" });
        }
        res.status(200).json({ data: result.data.videos });
        break;
    }
  } else {
    res.status(400).json({ data: { message: "no token found" } });
  }
}
