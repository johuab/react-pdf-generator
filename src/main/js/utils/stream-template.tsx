/*
 * Copyright (c) 2022, JOHU AB
 */

import React from "react";
import {
  Request,
  Response,
} from "express";
import { Template } from "../templates/types";
import ReactPDF from "@react-pdf/renderer";


export function streamTemplate<T>(template: Template<T>, req: Request, res: Response) {
  const { method, body } = req;

  if (method !== "POST") {
    res.status(405).send("Method Not Allowed ");
    return;
  }
  if (req.get("content-type") !== "application/json") {
    res.status(415).send("Unsupported Media Type");
    return;
  }

  if (!body) {
    res.status(400).send("missing body");
  } else {
    // TODO VALIDATE JSON!

    ReactPDF.renderToStream(<template.component data={body} />)
      .then((stream) => {
        res.setHeader("Content-Type", "application/pdf");
        res.setHeader("Content-Disposition", "attachment; filename=quote.pdf");
        res.status(200);
        stream.pipe(res);
      });
  }
}