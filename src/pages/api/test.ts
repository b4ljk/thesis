/* eslint-disable import/no-anonymous-default-export */
import { type NextApiRequest, type NextApiResponse } from "next";

export default (req: NextApiRequest, res: NextApiResponse) => {
  return res.status(200).json({ name: "John Doe" });
};
