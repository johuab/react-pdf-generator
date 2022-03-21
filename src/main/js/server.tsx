/*
 * Copyright (c) 2022, JOHU AB
 */

import express, {
  Request,
  Response,
} from "express";

import { TEMPLATES } from "./templates/templates";
import { streamTemplate } from "./utils/stream-template";

const PORT = 8888;

const app = express();
app.use(express.json());


TEMPLATES.forEach((template) => {
  app.post(`/generate${template.name}`, (req: Request, res: Response) => {
    streamTemplate(template, req, res);
  });
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});