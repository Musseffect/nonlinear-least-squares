
export const StackElementType = {
	_Variable:6,
	_Constant:4,
	_Addition:1,
	_Negation:2,
	_Multiplication:3,
	_Function:8
};
export class Operand
{
	constructor(value)
	{
		this.value = value;
		this.type = StackElementType._Constant;
	}
}
export class Variable
{
	constructor(index)
	{
		this.index = index;
		this.type = StackElementType._Variable;
	}
}
export class Function
{
	constructor(func)
	{
		this.type = StackElementType._Function;
		this.func = func;
	}
	exec(operands)
	{
		let args = [];
		for (let i = 0; i < this.func.args; i++)
		{
			args.push(operands.pop().value);
		}
        return new Operand(this.func.exec(args.reverse()));
	}
}
export class Negation
{
	constructor()
	{
		this.type = StackElementType._Negation;
	}
	exec(a)
	{
		return new Operand(-a.value);
	}
}
export class Addition
{
	constructor()
	{
		this.type = StackElementType._Addition;
	}
	exec(a,b)
	{
		return new Operand(a.value + b.value);
	}
}
export class Subtraction
{
	constructor()
	{
		this.type = StackElementType._Addition;
	}
	exec(a,b)
	{
		return new Operand(a.value - b.value);
	}
}
export class Multiplication
{
	constructor()
	{
		this.type = StackElementType._Multiplication;
	}
	exec(a,b)
	{
		return new Operand(a.value * b.value);
	}
}
export class Division
{
	constructor()
	{
		this.type = StackElementType._Multiplication;
	}
	exec(a,b)
	{
		return new Operand(a.value / b.value);
	}
}