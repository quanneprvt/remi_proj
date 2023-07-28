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
      case "POST":
        {
          const { video } = JSON.parse(req.body);
          data = await fetch(
            `${process.env.NEXT_PUBLIC_SERVER_URL}/api/videos/`,
            {
              method: "POST",
              headers: new Headers({
                "content-type": "application/json",
                authorization: req.headers["authorization"],
              }),
              body: JSON.stringify({ link: video.link, name: video.name }),
            }
          );
          result = await data.json();
          if (result.status === "TOKEN_INVALID") {
            res.status(401).json({ message: "Unauthorized" });
          }
          res.status(200).json({ data: result.data.video });
        }
        break;

      case "GET":
        data = await fetch(
          `${process.env.NEXT_PUBLIC_SERVER_URL}/api/videos/all`,
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

      case "PUT":
        {
          const { video } = JSON.parse(req.body);
          const { name, link, id } = video;
          data = await fetch(
            `${process.env.NEXT_PUBLIC_SERVER_URL}/api/videos/`,
            {
              method: "PUT",
              headers: new Headers({
                "content-type": "application/json",
                authorization: req.headers["authorization"],
              }),
              body: JSON.stringify({ name, link, id }),
            }
          );
          result = await data.json();
          if (result.status === "TOKEN_INVALID") {
            res.status(401).json({ message: "Unauthorized" });
          } else res.status(200).json({ data: result.data.video });
        }
        break;
    }
  } else {
    res.status(400).json({ data: { message: "no token found" } });
  }
}
