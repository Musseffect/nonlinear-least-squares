
import antlr4 from "antlr4/index";
import path from "path";
import Error from "./error.js";

export default class ErrorListener extends antlr4.error.ErrorListener {
    
    constructor(errors)
    {
      super();
      this.errors = errors;
    }
    syntaxError(recognizer, symbol, line, column, message, payload) {
      this.errors.push(new Error(line,column,message))
      //throw new Error(line, column, message);
    }
    add(line,column,message)
    {
      this.errors.push(new Error(line,column,message));
    }
  }