
import antlr4 from "antlr4/error/";
import path from "path";
import ErrorMessage from "./errorMessage";
import { Token, Recognizer } from "antlr4";

export default class ErrorListener extends antlr4.ErrorListener{
    errors:ErrorMessage[];
    constructor(errors:ErrorMessage[]){
      super();
      this.errors = errors;
    }
    syntaxError(recognizer: Recognizer, offendingSymbol: Token, line: number, column: number, msg: string, e: any): void {
      this.errors.push(new ErrorMessage(line, column, msg))
    }
    add(line:number,column:number,msg:string){
      this.errors.push(new ErrorMessage(line,column,msg));
    }
  }