import expressionGrammarVisitor from "../grammar/antlrOutput/expressionGrammarVisitor.js";
import expressionGrammarParser from "../grammar/antlrOutput/expressionGrammarParser.js";
import {
    FunctionNode,
    ConstantNode,
    VariableNode,
    AdditionNode,
    SubtractionNode,
    DivisionNode,
    MultiplicationNode,
    NegationNode,
    ExpressionNode
} from "./expressionNodes";
import ErrorListener from "./errorListener";
import { ParseTreeVisitor } from "antlr4/tree/Tree";

class Visitor extends expressionGrammarVisitor.expressionGrammarVisitor{
    variables:Record<string,number>;
    variableNames:string[];
    parameters:Record<string,number>;
    errorListener:ErrorListener;
    start(ctx:any,errorListener:ErrorListener,predefinedVariables:string[] = []){
        this.errorListener = errorListener;
        this.variables = {
        };
        this.variableNames = predefinedVariables.slice();
        this.parameters = {};
        predefinedVariables.forEach((item,index)=>{this.variables[item] = index},this);
        return this.visitExpressionSequence(ctx);
    }
    visitExpressionSequence(ctx:any){
        return (this as unknown as ParseTreeVisitor).visit(ctx.expression());
    }
    visitNumber(ctx:any){
        return new ConstantNode(parseFloat(ctx.getText()));
    }
    visitConstantExpression(ctx:any){
        return (this as unknown as ParseTreeVisitor).visit(ctx.value);
    }
    visitFunctionArguments(ctx:any){
        var args:ExpressionNode[] = [];
        ctx.expression().forEach(function(item:any){
            args.push(this.visit(item));
        },this);
        return args;
    }
    visitFunctionExpression(ctx:any){
        var args = this.visitFunctionArguments(ctx.functionArguments());
        return new FunctionNode(ctx.func.text,args);
    }
    visitParameterExpression(ctx:any){
        let id = ctx.id.text;
        if(this.variables[id]===undefined){
            this.variables[id] = this.variableNames.length;
            this.variableNames.push(id);
            this.parameters[id] = parseFloat(ctx.value.getText());
        }
        return new VariableNode(id,this.variables[id]);
    }
    visitUnaryOperatorExpression(ctx:any){
        switch(ctx.op.type){
            case expressionGrammarParser.expressionGrammarParser.PLUS:
                return (this as unknown as ParseTreeVisitor).visit(ctx.expression());
            case expressionGrammarParser.expressionGrammarParser.MINUS:
                return new NegationNode((this as unknown as ParseTreeVisitor).visit(ctx.expression()));
        }
        this.errorListener.add(ctx.op.start.line,ctx.op.start.column,"Unknown unary operator");
    }
    visitIdentifierExpression(ctx:any){
        let id = ctx.getText();
        if(this.variables[id]===undefined){
            this.variables[id] = this.variableNames.length;
            this.variableNames.push(id);
        }
        return new VariableNode(id,this.variables[id]);
    }
    visitBracketExpression(ctx:any){
        return (this as unknown as ParseTreeVisitor).visit(ctx.expression());
    }
    visitBinaryOperatorExpression(ctx:any){
        switch(ctx.op.type){
            case expressionGrammarParser.expressionGrammarParser.DIVISION:
                return new DivisionNode(
                    (this as unknown as ParseTreeVisitor).visit(ctx.left),
                    (this as unknown as ParseTreeVisitor).visit(ctx.right));
            case expressionGrammarParser.expressionGrammarParser.ASTERISK:
                return new MultiplicationNode(
                    (this as unknown as ParseTreeVisitor).visit(ctx.left),
                    (this as unknown as ParseTreeVisitor).visit(ctx.right));
            case expressionGrammarParser.expressionGrammarParser.PLUS:
                return new AdditionNode(
                    (this as unknown as ParseTreeVisitor).visit(ctx.left),
                    (this as unknown as ParseTreeVisitor).visit(ctx.right));
            case expressionGrammarParser.expressionGrammarParser.MINUS:
                return new SubtractionNode(
                    (this as unknown as ParseTreeVisitor).visit(ctx.left),
                    (this as unknown as ParseTreeVisitor).visit(ctx.right));
        }
        this.errorListener.add(ctx.op.start.line,ctx.op.start.column,"Unknown binary operator");
    }
}

export default Visitor;