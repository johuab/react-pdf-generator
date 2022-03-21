/*
 * Copyright (c) 2022, JOHU AB
 */
import React from "react";
import getopts from "getopts";
import ReactPDF from "@react-pdf/renderer";

import { TEMPLATES } from "./templates/templates";

const usage = () => {
  console.info("USAGE:");
  console.info("cli.js --template MY_TEMPLATE_NAME [-output TARGET_FILE_NAME] MY_TEMPLATE_DATA");
  process.exit(1);
};

const parseJson = (data: string) => {
  try {
    return JSON.parse(data);
  } catch (err) {
    console.log(data);
    console.error(err);
    usage();
  }
};

// Parse incoming options
const options = getopts(process.argv.slice(2), {
  alias: {
    output: "o",
    template: "t",
  },
});

const rawData = options._.join(" ");
if (!options.template || !rawData) {
  // Missing required options
  usage();
}

// Find selected template
const template = TEMPLATES.find((t) => t.name === options.template);
if (!template) {
  console.error(`Failed to find template [${options.template}]`);
  usage();
} else {
  // Render using ReactPDF
  const target = process.cwd() + "/" + (options.output || "result.pdf");
  const jsonData = parseJson(rawData);
  ReactPDF.render(<template.component data={jsonData}/>, target);
  console.log("Template succesfully rendered to " + target);
}