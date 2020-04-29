
import antlr4 from "antlr4/index";
import expressionGrammarLexer from "../grammar/antlrOutput/expressionGrammarLexer.js";
import expressionGrammarParser from "../grammar/antlrOutput/expressionGrammarParser.js";
import expressionGrammarVisitor from "../grammar/antlrOutput/expressionGrammarVisitor.js";
import Visitor from "./visitor.js";
import FunctionExpression from "../functionExpression.js";
import  ErrorListener  from "./errorListener.js";

export function compile(expressionText, predefinedVariables = [], onErrors=(errors)=>{})
{
    let errors = [];
    var chars = new antlr4.InputStream(expressionText);
    var lexer = new expressionGrammarLexer.expressionGrammarLexer(chars);
    lexer.removeErrorListeners();
    var listener = new ErrorListener(errors);
    lexer.addErrorListener(listener);
    lexer.strictMode = false;
    var tokens = new antlr4.CommonTokenStream(lexer);
    var parser = new expressionGrammarParser.expressionGrammarParser(tokens);
    
    parser.removeErrorListeners();
    parser.addErrorListener(listener);
    var visitor = new Visitor();
    parser.buildParseTrees = true;
    var tree = parser.expressionSequence();
    if(errors.length>0)
    {
        onErrors(errors);
        return null;
    }
    //console.log(tree.toStringTree(parser.ruleNames));
    
    let expression = visitor.start(tree,listener,predefinedVariables);
    if(errors.length>0)
    {
        onErrors(errors);
        return null;
    }
    return {expression:expression,variableNames:visitor.variableNames,parameters:visitor.parameters};
}