

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


export const functionDictionary = 
{
	sin:{
		exec:function(args)
		{
			return Math.sin(args[0]);
		},
		args:1,
		name:'sin',
		derivatives:[
			function(args)
			{
				return new FunctionNode("cos", args);
			}
		]
	},
	cos:{
		exec:function(args)
		{
			return Math.cos(args[0]);
		},
		args:1,
		name:'cos',
		derivatives:[
			function(args)
			{
				return new NegationNode(new FunctionNode("sin", args));
			}
		]
	},
	ln:{
		exec:function(args)
		{
			return Math.ln(args[0]);
		},
		args:1,
		name:'ln',
		derivatives:[
			function(args)
			{
				return new DivisionNode(new ConstantNode(1.0),args[0]);
			}

		]
	},
	pow:{
		exec:function(args){
			return Math.pow(args[0],args[1]);
		},
		args:2,
		name:'pow',
		derivatives:[
			function(args)
			{
				//TODO
			},
			function(args){
				//TODO
			}
		]
	},
	exp:{
		exec:function(args){
			return Math.exp(args[0]);
		},
		args:1,
		name:'exp',
		derivatives:[
			function(args)
			{
				return new FunctionNode("exp",args);
			}
		]
	}
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
			argumentsBackward[index] = new SubtractionNode(argumentsBackward[index],epsilon);
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
}
export class ConstantNode
{
	constructor(value)
	{
		this.type = NodeType._Constant
		this.value = value;
	}
	differentiate(variable, epsilon)
	{
		return new ConstantNode(0.0);
	}
	execute(variableValues)
	{
		return this;
	}
}
export class VariableNode
{
	constructor(name)
	{
		this.type = NodeType._Variable;
		this.name = name;
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
}
export class NegationNode{
	constructor(inner)
	{
		this.inner = inner;
		this.type = NodeType._Negation;
	}
	differentiate(variable, epsilon)
	{
		return new NegationNode(this.inner.differentiate(variable,epsilon));
	}
	execute(variableValues)
	{
		return new ConstantNode(-this.inner.execute(variableValues).value);
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
}
export class SubtractionNode{
	constructor(left,right)
	{
		this.left = left;
		this.right = right;
		this.type = NodeType._Subtraction;
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
}
export class MultiplicationNode{
	constructor(left,right)
	{
		this.left = left;
		this.right = right;
		this.type = NodeType._Multiplication;
	}
	differentiate(variable, epsilon)
	{
		return new AdditionNode(
				new MultiplicationNode(
					this.left.differentiate(variable, epsilon),
					this.right
				),
				new MultiplicationNode(
					this.left,
					this.right.differentiate(variable, epsilon)
				)
			);
	}
	execute(variableValues)
	{
		return new ConstantNode(this.left.execute(variableValues).value*this.right.execute(variableValues).value);
	}
}
export class DivisionNode{
	constructor(left,right)
	{
		this.left = left;
		this.right = right;
		this.type = NodeType._Division;
	}
	differentiate(variable, epsilon)
	{
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
		);
	}
	execute(variableValues)
	{
		return new ConstantNode(this.left.execute(variableValues).value/this.right.execute(variableValues).value);
	}
}

