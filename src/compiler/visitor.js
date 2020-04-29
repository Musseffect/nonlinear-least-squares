import expressionGrammarVisitor from "../grammar/antlrOutput/expressionGrammarVisitor.js";
import expressionGrammarParser from "../grammar/antlrOutput/expressionGrammarParser.js";
import 
{
    FunctionNode,
    ConstantNode,
    VariableNode,
    AdditionNode,
    SubtractionNode,
    DivisionNode,
    MultiplicationNode,
    NegationNode
} from "./expressionNodes.js";


class Visitor extends expressionGrammarVisitor.expressionGrammarVisitor
{
    start(ctx,errorListener,predefinedVariables = [])
    {
        this.errorListener = errorListener;
        this.variables = {
        };
        this.variableNames = predefinedVariables.slice();
        this.parameters = {};
        predefinedVariables.forEach((item,index)=>{this.variables[item] = index},this);
        return this.visitExpressionSequence(ctx);
    }
    visitExpressionSequence(ctx)
    {
        return this.visit(ctx.expression());
    }
    visitNumber(ctx)
    {
        return new ConstantNode(parseFloat(ctx.getText()));
    }
    visitConstantExpression(ctx)
    {
        return this.visit(ctx.value);
    }
    visitFunctionArguments(ctx)
    {
        var args = [];
        ctx.expression().forEach(function(item)
        {
            args.push(this.visit(item));
        },this);
        return args;
    }
    visitFunctionExpression(ctx)
    {
        var args = this.visitFunctionArguments(ctx.functionArguments());
        return new FunctionNode(ctx.func.text,args);
    }
    visitParameterExpression(ctx)
    {
        let id = ctx.id.text;
        if(this.variables[id]===undefined)
        {
            this.variables[id] = this.variableNames.length;
            this.variableNames.push(id);
            this.parameters[id] = parseFloat(ctx.value.getText());
        }
        return new VariableNode(id);
    }
    visitUnaryOperatorExpression(ctx)
    {
        switch(ctx.op.type)
        {
            case expressionGrammarParser.expressionGrammarParser.PLUS:
                return this.visit(ctx.expression());
            case expressionGrammarParser.expressionGrammarParser.MINUS:
                return new NegationNode(this.visit(ctx.expression()));
        }
        errorListener.add(ctx.op.start.line,ctx.op.start.column,"Unknown unary operator");
        //throw "Unknown unary operator";
    }
    visitIdentifierExpression(ctx)
    {
        let id = ctx.getText();
        if(this.variables[id]===undefined)
        {
            this.variables[id] = this.variableNames.length;
            this.variableNames.push(id);
        }
        return new VariableNode(id);
    }
    visitBracketExpression(ctx)
    {
        return this.visit(ctx.expression());
    }
    visitBinaryOperatorExpression(ctx)
    {
        switch(ctx.op.type)
        {
            case expressionGrammarParser.expressionGrammarParser.DIVISION:
                return new DivisionNode(
                    this.visit(ctx.left),
                    this.visit(ctx.right));
            case expressionGrammarParser.expressionGrammarParser.ASTERISK:
                return new MultiplicationNode(
                    this.visit(ctx.left),
                    this.visit(ctx.right));
            case expressionGrammarParser.expressionGrammarParser.PLUS:
                    return new AdditionNode(
                        this.visit(ctx.left),
                        this.visit(ctx.right));
            case expressionGrammarParser.expressionGrammarParser.MINUS:
                return new SubtractionNode(
                    this.visit(ctx.left),
                    this.visit(ctx.right));
        }
        errorListener.add(ctx.op.start.line,ctx.op.start.column,"Unknown binary operator");
    }

}

export default Visitor;