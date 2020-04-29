import { functionDictionary } from "./functions.js";


export const NodeType = {
	_Function : 0,
	_Constant : 1,
	_Variable : 2,
	_Addition : 3,
	_Subtraction : 4,
	_Multiplication : 5,
	_Division : 6,
	_Negation : 7,
}

export class FunctionNode
{
	constructor(functionName,args)
	{
		this.functionName = functionName;
		this.type = NodeType._Function;
		this.function = functionDictionary[functionName];
		this.args = args;
		if(this.function ===undefined)
			throw "unknown function "+functionName;
		if(this.function.args!=args.length)
			throw "Incorrect number of arguments in function "+functionName;
	}
	clone()
	{
		return new FunctionNode(this.functionName,this.args.map((item)=>{return item.clone()}));
	}
	execute(variableValues)
	{
		let args = this.args.map((item)=>
			{return item.execute(variableValues).value;}
		);
		return new ConstantNode(this.function.exec(args));
	}
	getDerivative(index, epsilon)
	{
		if(this.function.derivatives===undefined)//use backward difference
		{
			let argumentsBackward = this.args.slice();
			argumentsBackward[index] = new SubtractionNode(argumentsBackward[index],new ConstantNode(epsilon));
			return new DivisionNode(new SubtractionNode(
				new FunctionNode(this.functionName, this.args),
				new FunctionNode(this.functionName, argumentsBackward),
				),new ConstantNode(epsilon));
		}
		return this.function.derivatives[index](this.args);
	}
	differentiate(variable, epsilon)
	{
		if(this.args.length==0)
			return new ConstantNode(0.0);
		if (this.args.length == 1)
		{
			return new MultiplicationNode(
					this.args[0].differentiate(variable, epsilon),
					this.getDerivative(0,epsilon)
			);
		}
		let root = new AdditionNode();
		let current = root;
		for (let i = 0; i < this.args.length - 1; i++)
		{
			current.left = new MultiplicationNode
			(
				this.args[i].differentiate(variable,epsilon),
				this.getDerivative(i,epsilon)
			);
			if (i < this.args.length - 2)
			{
				current.right = new AdditionNode();
				current = current.right;
			}
		}
		current.right = new MultiplicationNode
		(
			this.args[this.args.length - 1].differentiate(variable,epsilon),
			this.getDerivative(this.args.length - 1,epsilon)
		);
		return root;
	}
	simplify()
	{
		let constantArgs = true;
		let args = this.args.map((item)=>
			{
				let _item = item.simplify();
				constantArgs = constantArgs && (item instanceof ConstantNode);
				return _item;
			}
		);
		if(constantArgs)
		{
			let constArgs = args.map((item)=>{return item.value;});
			return new ConstantNode(this.function.exec(constArgs));
		}
		this.args = args;
		return this;
	}
}
export class ConstantNode
{
	constructor(value)
	{
		this.type = NodeType._Constant
		this.value = value;
	}
	clone()
	{
		return new ConstantNode(this.value);
	}
	differentiate(variable, epsilon)
	{
		return new ConstantNode(0.0);
	}
	execute(variableValues)
	{
		return this;
	}
	simplify()
	{
		return new ConstantNode(this.value);	
	}
}
export class VariableNode
{
	constructor(name)
	{
		this.type = NodeType._Variable;
		this.name = name;
	}
	clone()
	{
		return new VariableNode(this.name);
	}
	differentiate(variable, epsilon)
	{
		if(variable == this.name)
			return new ConstantNode(1.0);
		return new ConstantNode(0.0);
	}
	execute(variableValues)
	{
		return new ConstantNode(variableValues[this.name]);
	}
	simplify()
	{
		return new VariableNode(this.name);
	}
}
export class NegationNode{
	constructor(inner)
	{
		this.inner = inner;
		this.type = NodeType._Negation;
	}
	clone()
	{
		return new NegationNode(this.inner.clone());
	}
	differentiate(variable, epsilon)
	{
		return new NegationNode(this.inner.differentiate(variable,epsilon));
	}
	execute(variableValues)
	{
		return new ConstantNode(-this.inner.execute(variableValues).value);
	}
	simplify()
	{
		let node = this.inner.simplify();
		if(node instanceof ConstantNode)
			return new ConstantNode(-node.value);
		if(node instanceof NegationNode)
		{
			return node.inner;
		}
		return new NegationNode(node);
	}
}
export class AdditionNode
{
	constructor(left,right)
	{
		this.left = left;
		this.right = right;
		this.type = NodeType._Addition;
	}
	clone()
	{
		return new AdditionNode(this.left.clone(),this.right.clone());
	}
	differentiate(variable, epsilon)
	{
		return new AdditionNode(
			this.left.differentiate(variable,epsilon),
			this.right.differentiate(variable,epsilon)
			);
	}
	execute(variableValues)
	{
		return new ConstantNode(this.left.execute(variableValues).value+this.right.execute(variableValues).value);
	}
	simplify()
	{
		let l = this.left.simplify();
		let r = this.right.simplify();
		if(l instanceof ConstantNode)
		{
			if(r instanceof ConstantNode)
			{
				return new ConstantNode(l.value + r.value);
			}
			if(Math.abs(l.value)==0)
				return r;
		}else if(r instanceof ConstantNode)
		{
			if(Math.abs(r.value)==0.0)
				return l;
		}
		return new AdditionNode(l,r);
	}
}
export class SubtractionNode{
	constructor(left,right)
	{
		this.left = left;
		this.right = right;
		this.type = NodeType._Subtraction;
	}
	clone()
	{
		return new SubtractionNode(this.left.clone(),this.right.clone());
	}
	differentiate(variable, epsilon)
	{
		return new SubtractionNode(
			this.left.differentiate(variable,epsilon),
			this.right.differentiate(variable,epsilon)
			);
	}
	execute(variableValues)
	{
		return new ConstantNode(this.left.execute(variableValues).value-this.right.execute(variableValues).value);
	}
	simplify()
	{
		let l = this.left.simplify();
		let r = this.right.simplify();
		if(l instanceof ConstantNode)
		{
			if(r instanceof ConstantNode)
			{
				return new ConstantNode(l.value - r.value);
			}
			if(Math.abs(l.value)==0)
				return new NegationNode(r);
		}else if(r instanceof ConstantNode)
		{
			if(Math.abs(r.value)==0)
				return l;
		}
		return new SubtractionNode(l,r);
	}
}
export class MultiplicationNode{
	constructor(left,right)
	{
		this.left = left;
		this.right = right;
		this.type = NodeType._Multiplication;
	}
	clone()
	{
		return new MultiplicationNode(this.left.clone(),this.right.clone());
	}
	differentiate(variable, epsilon)
	{
		return new AdditionNode(
				new MultiplicationNode(
					this.left.differentiate(variable, epsilon),
					this.right.clone()
				),
				new MultiplicationNode(
					this.left.clone(),
					this.right.differentiate(variable, epsilon)
				)
			);
	}
	execute(variableValues)
	{
		return new ConstantNode(this.left.execute(variableValues).value*this.right.execute(variableValues).value);
	}
	simplify()
	{
		let l = this.left.simplify();
		let r = this.right.simplify();
		if(l instanceof ConstantNode)
		{
			if(r instanceof ConstantNode)
			{
				return new ConstantNode(l.value * r.value);
			}
			if(Math.abs(l.value)==0.0)
				return l;
			if(l.value == 1)
				return r;
			if(l.value == -1)
				return new NegationNode(r);
		}else if(r instanceof ConstantNode)
		{
			if(Math.abs(r.value)==0.0)
				return r;
			if(r.value == 1)
				return l;
			if(l.value == -1)
				return new NegationNode(l);
		}
		return new MultiplicationNode(l,r);
	}
}
export class DivisionNode{
	constructor(left,right)
	{
		this.left = left;
		this.right = right;
		this.type = NodeType._Division;
	}
	clone()
	{
		return new DivisionNode(this.left.clone(),this.right.clone());
	}
	differentiate(variable, epsilon)
	{
		return new SubtractionNode(
			new DivisionNode(
				this.left.differentiate(variable,epsilon),
				this.right.clone(),
			),
			new MultiplicationNode(
				this.right.differentiate(variable,epsilon),
				new DivisionNode(
					this.left.clone(),
					new FunctionNode("pow",[
						this.right.clone(),new ConstantNode(2)]
					)
				)
			)
		);
		/*
		return new DivisionNode
		(
			new SubtractionNode
			(
				new MultiplicationNode
				(
					this.left.differentiate(variable, epsilon),
					this.right
				),
				new MultiplicationNode
				(
					this.left,
					this.right.differentiate(variable, epsilon)

				)
			),
			new MultiplicationNode
			(
				this.right,
				this.right
			),
		);*/
	}
	execute(variableValues)
	{
		return new ConstantNode(this.left.execute(variableValues).value/this.right.execute(variableValues).value);
	}
	simplify()
	{
		let l = this.left.simplify();
		let r = this.right.simplify();
		if(l instanceof ConstantNode)
		{
			if(Math.abs(l.value)==0.0)
				return l;
			if(r instanceof ConstantNode)
			{
				return new ConstantNode(l.value / r.value);
			}
		}else if(r instanceof ConstantNode)
		{
			if(r.value == 1)
				return l;
			if(r.value == -1)
				return new NegationNode(l);
		}
		return new DivisionNode(l,r);
	}
}