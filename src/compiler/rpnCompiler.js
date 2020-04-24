import {
    NodeType,
} from "./expressionNodes.js";
import {
    Negation,
    Addition,
    Subtraction,
    Multiplication,
    Division,
    Function,
    Variable,
	Operand} from "./stackElements.js";
import RPNExpression from "./rpnExpression.js";

export default class RPNCompiler
{
	compile(root,variableIndicies)
	{
		this.variableIndicies = variableIndicies;
		this.rpnStack = [];
		this.visit(root);
		return new RPNExpression(this.rpnStack);
	}
	visit(node)
	{
		switch(node.type)
		{
			case NodeType._Function:
				node.args.forEach(function(item)
				{
					this.visit(item);
				},this);
				this.rpnStack.push(new Function(node.function));
				break;
			case NodeType._Constant:
				this.rpnStack.push(new Operand(node.value));
				break;
			case NodeType._Variable:
				if(this.variableIndicies[node.name]===undefined)
					throw new `Не удалось найти переменную ${node.name} в RPNCompiler.visit`;
				this.rpnStack.push(new Variable(this.variableIndicies[node.name]));
				break;
			case NodeType._Addition:
				this.visit(node.left);
				this.visit(node.right);
				this.rpnStack.push(new Addition());
				break;
			case NodeType._Subtraction:
				this.visit(node.left);
				this.visit(node.right);
				this.rpnStack.push(new Subtraction());
				break;
			case NodeType._Multiplication:
				this.visit(node.left);
				this.visit(node.right);
				this.rpnStack.push(new Multiplication());
				break;
			case NodeType._Division:
				this.visit(node.left);
				this.visit(node.right);
				this.rpnStack.push(new Division());
				break;
			case NodeType._Negation:
				this.visit(node.inner);
				this.rpnStack.push(new Negation());
				break;
			default:
				throw "Unknown type";
		}
	}
}