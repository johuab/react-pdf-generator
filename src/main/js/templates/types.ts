/*
 * Copyright (c) 2022, JOHU AB
 */

import React from "react";

export interface Template<P> {
  /* Name of the template */
  name: string;
  /* Component used to render the template, root node in the jsx MUST be a react-pdf Document */
  component: React.FunctionComponent<{data: P}>;
  /* Sample data, is used when rendering the template in browser */
  sampleData: P;
}