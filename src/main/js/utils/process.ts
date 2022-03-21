/*
 * Copyright (c) 2022, JOHU AB
 */

/**
 * Set proccess object to window/global scope
 * Needed since dependancies expect to run in a node environment and assmes proccess to be defined
 */
window.process = require("process");