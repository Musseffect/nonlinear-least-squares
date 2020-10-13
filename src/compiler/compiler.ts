
import antlr4, { Lexer, Parser } from "antlr4/index";
import expressionGrammarLexer from "../grammar/antlrOutput/expressionGrammarLexer.js";
import expressionGrammarParser from "../grammar/antlrOutput/expressionGrammarParser.js";
import expressionGrammarVisitor from "../grammar/antlrOutput/expressionGrammarVisitor.js";
import Visitor from "./visitor";
import {FunctionExpression} from "../functionExpression";
import  ErrorListener  from "./errorListener";
import ErrorMessage from "./errorMessage";

export function compile(expressionText:string, predefinedVariables:string[] = [], onErrors=(errors:ErrorMessage[])=>{}){
    let errors:ErrorMessage[] = [];
    var chars = new antlr4.InputStream(expressionText);
    var lexer = new expressionGrammarLexer.expressionGrammarLexer(chars);
    (lexer as unknown as Lexer).removeErrorListeners();
    var listener = new ErrorListener(errors);
    (lexer as unknown as Lexer).addErrorListener(listener);
    //@ts-ignore
    lexer.strictMode = false;
    var tokens = new antlr4.CommonTokenStream(lexer as unknown as Lexer);
    var parser = new expressionGrammarParser.expressionGrammarParser(tokens);
    
    (parser as unknown as Parser).removeErrorListeners();
    (parser as unknown as Parser).addErrorListener(listener);
    var visitor = new Visitor();
    (parser as unknown as Parser).buildParseTrees = true;
    var tree = parser.expressionSequence();
    if(errors.length>0){
        onErrors(errors);
        return null;
    }
    //console.log(tree.toStringTree(parser.ruleNames));
    
    let expression = visitor.start(tree, listener, predefinedVariables);
    if(errors.length>0){
        onErrors(errors);
        return null;
    }
    return {expression:expression,variableNames:visitor.variableNames,parameters:visitor.parameters};
}