import { FunctionEntry } from "./functions";

export const StackElementType = {
	_Variable:6,
	_Constant:4,
	_Addition:1,
	_Negation:2,
	_Multiplication:3,
	_Function:8
};
export abstract class RPNElement{
	type:number;
	constructor(type:number){
		this.type = type;
	}
}
export class Operand extends RPNElement{
	value:number;
	constructor(value:number){
		super(StackElementType._Constant);
		this.value = value;
	}
}
export class Variable extends RPNElement{
	index:number;
	constructor(index:number){
		super(StackElementType._Variable);
		this.index = index;
	}
}
export class Function extends RPNElement{
	func:FunctionEntry;
	constructor(func:FunctionEntry){
		super(StackElementType._Function);
		this.func = func;
	}
	exec(operands:Operand[]){
		let args = [];
		for (let i = 0; i < this.func.args; i++){
			args.push(operands.pop().value);
		}
        return new Operand(this.func.exec(args.reverse()));
	}
}
export class Negation extends RPNElement{
	constructor(){
		super(StackElementType._Negation);
	}
	exec(a:Operand){
		return new Operand(-a.value);
	}
}
export abstract class RPNBinary extends RPNElement{
	abstract exec(a:Operand, b:Operand):Operand;
}
export class Addition extends RPNBinary{
	constructor(){
		super(StackElementType._Addition);
	}
	exec(a:Operand, b:Operand){
		return new Operand(a.value + b.value);
	}
}
export class Subtraction extends RPNBinary{
	constructor(){
		super(StackElementType._Addition);
	}
	exec(a:Operand, b:Operand){
		return new Operand(a.value - b.value);
	}
}
export class Multiplication extends RPNBinary{
	constructor(){
		super(StackElementType._Multiplication);
	}
	exec(a:Operand, b:Operand){
		return new Operand(a.value * b.value);
	}
}
export class Division extends RPNBinary{
	constructor(){
		super(StackElementType._Multiplication);
	}
	exec(a:Operand, b:Operand){
		return new Operand(a.value / b.value);
	}
}