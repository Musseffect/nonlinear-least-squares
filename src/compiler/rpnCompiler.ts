import {
	NodeType,
	ExpressionNode,
	FunctionNode,
	ConstantNode,
	NegationNode,
	DivisionNode,
	MultiplicationNode,
	SubtractionNode,
	AdditionNode,
	VariableNode,
} from "./expressionNodes";
import {
	RPNElement,
    Negation,
    Addition,
    Subtraction,
    Multiplication,
    Division,
    Function,
    Variable,
	Operand} from "./stackElements";
import RPNExpression from "./rpnExpression";
import ErrorMessage from "./errorMessage";

export default class RPNCompiler{
	variableIndicies:Record<string,number>;
	rpnStack:RPNElement[];
	compile(root:ExpressionNode,variableIndicies:Record<string,number>){
		this.variableIndicies = variableIndicies;
		this.rpnStack = [];
		this.visit(root);
		return new RPNExpression(this.rpnStack);
	}
	visit(node:ExpressionNode){
		switch(node.type){
			case NodeType._Function:
				(node as FunctionNode).args.forEach(function(item){
					this.visit(item);
				},this);
				this.rpnStack.push(new Function((node as FunctionNode).function));
				break;
			case NodeType._Constant:
				this.rpnStack.push(new Operand((node as ConstantNode).value));
				break;
			case NodeType._Variable:
				if(this.variableIndicies[(node as VariableNode).name]===undefined)
					throw (`Не удалось найти переменную ${(node as VariableNode).name} в RPNCompiler.visit`);
				this.rpnStack.push(new Variable(this.variableIndicies[(node as VariableNode).name]));
				break;
			case NodeType._Addition:
				this.visit((node as AdditionNode).args[0]);
				this.visit((node as AdditionNode).args[1]);
				this.rpnStack.push(new Addition());
				break;
			case NodeType._Subtraction:
				this.visit((node as SubtractionNode).args[0]);
				this.visit((node as SubtractionNode).args[1]);
				this.rpnStack.push(new Subtraction());
				break;
			case NodeType._Multiplication:
				this.visit((node as MultiplicationNode).args[0]);
				this.visit((node as MultiplicationNode).args[1]);
				this.rpnStack.push(new Multiplication());
				break;
			case NodeType._Division:
				this.visit((node as DivisionNode).args[0]);
				this.visit((node as DivisionNode).args[1]);
				this.rpnStack.push(new Division());
				break;
			case NodeType._Negation:
				this.visit((node as NegationNode).args[0]);
				this.rpnStack.push(new Negation());
				break;
			default:
				throw "Unknown type";
		}
	}
}