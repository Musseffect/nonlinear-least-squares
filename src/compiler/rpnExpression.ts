import {
    Negation,
    Addition,
    Subtraction,
    Multiplication,
    Division,
    Function,
    Variable,
    Operand,
    StackElementType,
	RPNElement,
	RPNBinary} from "./stackElements";

export default class RPNExpression{
	rpn:RPNElement[];
	constructor(rpn:RPNElement[]){
		this.rpn = rpn;
	}
	print(variableNames:string[]){//array of strings{
		let operands:{type:number,string:string}[] = [];
		for (let i = 0; i < this.rpn.length; i++){
			let item = this.rpn[i];
			switch (true){
				case item instanceof Negation:{
						let operand = operands.pop();
						if (operand.type < StackElementType._Negation)
							operands.push({
								type:StackElementType._Negation,
								string:"-(" + operand.string + ")"
							});
						else
							operands.push({
								type: StackElementType._Negation,
								string: "-" + operand.string
							});
						break;
					}
				case item instanceof Addition:{
						let right = operands.pop();
						let left = operands.pop();
						if (left.type < StackElementType._Addition)
							left.string = "(" + left.string + ")";
						if (right.type < StackElementType._Addition)
							right.string = "(" + right.string + ")";
						operands.push({
							type: StackElementType._Addition,
							string: left.string + "+" + right.string
						});
						break;
					}
				case item instanceof Subtraction:{
						let right = operands.pop();
						let left = operands.pop();
						if (left.type < StackElementType._Addition)
							left.string = "(" + left.string + ")";
						if (right.type <= StackElementType._Addition)
							right.string = "(" + right.string + ")";
						operands.push({
							type: StackElementType._Addition,
							string: left.string + "-" + right.string
						});
						break;
					}
				case item instanceof Multiplication:{
						let right = operands.pop();
						let left = operands.pop();
						if (left.type < StackElementType._Multiplication)
							left.string = "(" + left.string + ")";
						if (right.type < StackElementType._Multiplication)
							right.string = "(" + right.string + ")";
						operands.push({
							type:StackElementType._Multiplication,
							string:left.string + "*" + right.string
						});
						break;
					}
				case item instanceof Division:{
						let right = operands.pop();
						let left = operands.pop();
						if (left.type < StackElementType._Multiplication)
							left.string = "(" + left.string + ")";
						if (right.type <= StackElementType._Multiplication)
							right.string = "(" + right.string + ")";
						operands.push({
							type:StackElementType._Multiplication,
							string:left.string + "/" + right.string
						});
						break;
					}
				case item instanceof Variable:{
						operands.push({
							type:StackElementType._Variable,
							string:variableNames[(item as Variable).index]
						});
						break;
					}
				case item instanceof Function:{
						let entry = (item as Function).func;
						let _string = "";
						for (let j = 0; j < entry.args; j++){
							let operand = operands.pop();
							if (j != 0)
								_string = ", " + _string;
							_string = operand.string + _string;
						}
						operands.push({
							type:StackElementType._Function,
							string:entry.name + "(" + _string + ")"
						});
						break;
					}
				case item instanceof Operand:{
						operands.push({
							type: StackElementType._Constant,
							string: (item as Operand).value.toString()
						});
						break;
					}
			}
		}
		return operands.pop().string;
	}
	exec(variables:number[]){
		let operands:Operand[] = [];
		for (let i = 0; i < this.rpn.length; i++){
			let item = this.rpn[i];
			if (item.type ==  StackElementType._Negation){
				operands.push((item as Negation).exec(operands.pop()));
			}
			else if ((item.type&StackElementType._Addition) == StackElementType._Addition){
				let right = operands.pop();
				let left = operands.pop();
				operands.push((item as RPNBinary).exec(left,right));
			}
			else if (item.type == StackElementType._Function){
				operands.push((item as Function).exec(operands));
			}
			else if (item.type == StackElementType._Variable){
				operands.push(new Operand(variables[(item as Variable).index]));
			}
			else{
				operands.push(item as Operand);
			}
		}
		return operands.pop().value;
	}
}