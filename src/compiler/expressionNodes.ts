import { functionDictionary } from "./functions";


export enum NodeType{
	_Function = 0,
	_Constant = 1,
	_Variable = 2,
	_Division = 3,
	_Multiplication = 4,
	_Negation = 5,
	_Addition = 6,
	_Subtraction = 7,
}

export abstract class ExpressionNode{
	type:number;
	args:ExpressionNode[];
	constructor(type:number){
		this.type = type;
	}
	abstract clone():ExpressionNode;
	abstract eval(variableValues:Record<string,number>|number[]):number;
	abstract differentiate(variable:string,epsilon:number):ExpressionNode;
	abstract simplify():ExpressionNode;
	abstract childDerivatives(variableValues:Record<string,number>|number[],epsilon?:number):number[];
	abstract print():string;
}

export class FunctionNode extends ExpressionNode{
	functionName:string;
	function:any;
	constructor(functionName:string,args:ExpressionNode[]){
		super(NodeType._Function);
		this.functionName = functionName;
		this.function = functionDictionary[functionName];
		this.args = args;
		if(this.function ===undefined)
			throw "unknown function "+functionName;
		if(this.function.args!=args.length)
			throw "Incorrect number of arguments in function "+functionName;
	}
	clone():ExpressionNode{
		return new FunctionNode(this.functionName,this.args.map((item:ExpressionNode)=>{return item.clone()}));
	}
	eval(variableValues:Record<string,number>|number[]):number{
		let args:number[] = this.args.map((item)=>{return item.eval(variableValues);}
		);
		return this.function.exec(args);
	}
	getDerivative(index:number, epsilon:number = 0.001):ExpressionNode{
		if(this.function.derivatives===null){//use backward difference{
			let argumentsBackward = this.args.slice();
			argumentsBackward[index] = new SubtractionNode(argumentsBackward[index], new ConstantNode(epsilon));
			return new DivisionNode(new SubtractionNode(
				new FunctionNode(this.functionName, this.args),
				new FunctionNode(this.functionName, argumentsBackward),
				),new ConstantNode(epsilon));
		}
		return this.function.derivatives[index](this.args);
	}
	differentiate(variable:string,epsilon:number = 0.001):ExpressionNode{
		if(this.args.length==0)
			return new ConstantNode(0.0);
		if (this.args.length == 1){
			return new MultiplicationNode(
					this.args[0].differentiate(variable, epsilon),
					this.getDerivative(0,epsilon)
			);
		}
		let root = new AdditionNode(null,null);
		let current:AdditionNode = root;
		for (let i = 0; i < this.args.length - 1; i++){
			current.args[0] = new MultiplicationNode
			(
				this.args[i].differentiate(variable,epsilon),
				this.getDerivative(i,epsilon)
			);
			if (i < this.args.length - 2){
				current.args[1] = new AdditionNode(null,null);
				current = current.args[1] as AdditionNode;
			}
		}
		current.args[1] = new MultiplicationNode
		(
			this.args[this.args.length - 1].differentiate(variable,epsilon),
			this.getDerivative(this.args.length - 1,epsilon)
		);
		return root;
	}
	simplify():ExpressionNode{
		let constantArgs = true;
		let args = this.args.map((item)=>{
				let _item = item.simplify();
				constantArgs = constantArgs && (item instanceof ConstantNode);
				return _item;
			}
		);
		if(constantArgs){
			let constArgs = args.map((item:ConstantNode)=>{return item.value;});
			return new ConstantNode(this.function.exec(constArgs));
		}
		this.args = args;
		return this;
	}
	childs():ExpressionNode[]{
		return this.args;
	}
	childDerivatives(variableValues:Record<string,number>|number[],epsilon:number = 0.001):number[]{
		let self = this;
		return this.args.map(function(arg,index){
			return self.getDerivative(index,epsilon).eval(variableValues)
		});
	}
	print():string{
		let result:string = this.functionName+"(";
		this.args.forEach((item,i)=>result+=(i==0?"":",")+item.print());
		return result+")";
	}
}
export class ConstantNode extends ExpressionNode{
	value:number;
	constructor(value:number){
		super(NodeType._Constant)
		this.value = value;
		this.args = [];
	}
	clone(){
		return new ConstantNode(this.value);
	}
	differentiate(variable:string, epsilon:number){
		return new ConstantNode(0.0);
	}
	eval(variableValues:Record<string,number>|number[]):number{
		return this.value;
	}
	simplify(){
		return new ConstantNode(this.value);	
	}
	childs():ExpressionNode[]{
		return [];
	}
	childDerivatives(variableValues:Record<string,number>|number[],epsilon:number = 0.001):number[]{
		return [];
	}
	print():string{
		return this.value.toString();
	}
}
export class VariableNode  extends ExpressionNode{
	name:string;
	index:number;
	constructor(name:string,index:number){
		super(NodeType._Variable);
		this.name = name;
		this.index = index;
		this.args = [];
	}
	clone(){
		return new VariableNode(this.name,this.index);
	}
	differentiate(variable:string, epsilon:number){
		if(variable == this.name)
			return new ConstantNode(1.0);
		return new ConstantNode(0.0);
	}
	eval(variableValues:Record<string,number>|number[]):number{
		if(variableValues instanceof Array)
			return variableValues[this.index];
		return variableValues[this.name];
	}
	simplify(){
		return this.clone();
	}
	childs():ExpressionNode[]{
		return [];
	}
	childDerivatives(variableValues:Record<string,number>|number[],epsilon:number = 0.001):number[]{
		return [];
	}
	print():string{
		return this.name;
	}
}
export class NegationNode  extends ExpressionNode{
	constructor(node:ExpressionNode){
		super(NodeType._Negation);
		this.args = [node];
	}
	clone(){
		return new NegationNode(this.args[0].clone());
	}
	differentiate(variable:string, epsilon:number){
		return new NegationNode(this.args[0].differentiate(variable,epsilon));
	}
	eval(variableValues:Record<string,number>|number[]):number{
		return -this.args[0].eval(variableValues);
	}
	simplify(){
		let node = this.args[0].simplify();
		if(node instanceof ConstantNode)
			return new ConstantNode(-node.value);
		if(node instanceof NegationNode){
			return node.args[0];
		}
		return new NegationNode(node);
	}
	childDerivatives(variableValues:Record<string,number>|number[],epsilon:number = 0.001):number[]{
		return [-1];
	}
	print():string{
		let arg = this.args[0].print();
		return "-"+(this.args[0].type>=this.type?"("+arg+")":arg);
	}
}
abstract class BinaryExpressionNode extends ExpressionNode{
	left(){
		return this.args[0];
	}
	right(){
		return this.args[1];
	}
}
export class AdditionNode  extends BinaryExpressionNode{
	constructor(left:ExpressionNode,right:ExpressionNode){
		super(NodeType._Addition);
		this.args = [left,right];
	}
	clone(){
		return new AdditionNode(this.left().clone(),this.right().clone());
	}
	differentiate(variable:string, epsilon:number){
		return new AdditionNode(
			this.left().differentiate(variable,epsilon),
			this.right().differentiate(variable,epsilon)
			);
	}
	eval(variableValues:Record<string,number>|number[]){
		return this.left().eval(variableValues)+this.right().eval(variableValues);
	}
	simplify(){
		let l = this.left().simplify();
		let r = this.right().simplify();
		if(l instanceof ConstantNode){
			if(r instanceof ConstantNode){
				return new ConstantNode(l.value + r.value);
			}
			if(Math.abs(l.value)==0)
				return r;
		}else if(r instanceof ConstantNode){
			if(Math.abs(r.value)==0.0)
				return l;
		}
		return new AdditionNode(l,r);
	}
	childs():ExpressionNode[]{
		return [this.left(),this.right()];
	}
	childDerivatives(variableValues:Record<string,number>|number[],epsilon:number = 0.001):number[]{
		return [1,1];
	}
	print():string{
		let l = this.left().print();
		let r = this.right().print();
		return (this.left().type>this.type?"("+l+")":l)+"+"+(this.right().type>this.type?"("+r+")":r);
	}
}
export class SubtractionNode  extends BinaryExpressionNode{
	constructor(left:ExpressionNode,right:ExpressionNode){
		super(NodeType._Subtraction);
		this.args = [left,right];
	}
	clone(){
		return new SubtractionNode(this.left().clone(),this.right().clone());
	}
	differentiate(variable:string, epsilon:number){
		return new SubtractionNode(
			this.left().differentiate(variable,epsilon),
			this.right().differentiate(variable,epsilon)
			);
	}
	eval(variableValues:Record<string,number>|number[]){
		return this.left().eval(variableValues)-this.right().eval(variableValues);
	}
	simplify(){
		let l = this.left().simplify();
		let r = this.right().simplify();
		if(l instanceof ConstantNode){
			if(r instanceof ConstantNode){
				return new ConstantNode(l.value - r.value);
			}
			if(Math.abs(l.value)==0)
				return new NegationNode(r);
		}else if(r instanceof ConstantNode){
			if(Math.abs(r.value)==0)
				return l;
		}
		return new SubtractionNode(l,r);
	}
	childs():ExpressionNode[]{
		return [this.left(),this.right()];
	}
	childDerivatives(variableValues:Record<string,number>|number[],epsilon:number = 0.001):number[]{
		return [1,-1];
	}
	print():string{
		let l = this.left().print();
		let r = this.right().print();
		return (this.left().type>this.type?"("+l+")":l)+"-"+(this.right().type>=this.type?"("+r+")":r);
	}
}
export class MultiplicationNode  extends BinaryExpressionNode{
	constructor(left:ExpressionNode,right:ExpressionNode){
		super(NodeType._Multiplication);
		this.args = [left,right];
	}
	clone(){
		return new MultiplicationNode(this.left().clone(),this.right().clone());
	}
	differentiate(variable:string, epsilon:number){
		return new AdditionNode(
				new MultiplicationNode(
					this.left().differentiate(variable, epsilon),
					this.right().clone()
				),
				new MultiplicationNode(
					this.left().clone(),
					this.right().differentiate(variable, epsilon)
				)
			);
	}
	eval(variableValues:Record<string,number>|number[]){
		return this.left().eval(variableValues)*this.right().eval(variableValues);
	}
	simplify(){
		let l = this.left().simplify();
		let r = this.right().simplify();
		if(l instanceof ConstantNode){
			if(r instanceof ConstantNode){
				return new ConstantNode(l.value * r.value);
			}
			if(Math.abs(l.value)==0.0)
				return l;
			if(l.value == 1)
				return r;
			if(l.value == -1)
				return new NegationNode(r);
		}else if(r instanceof ConstantNode){
			if(Math.abs(r.value)==0.0)
				return r;
			if(r.value == 1)
				return l;
			if(r.value == -1)
				return new NegationNode(l);
		}
		return new MultiplicationNode(l,r);
	}
	childs():ExpressionNode[]{
		return [this.left(),this.right()];
	}
	childDerivatives(variableValues:Record<string,number>|number[],epsilon:number = 0.001):number[]{
		return [this.right().eval(variableValues),this.left().eval(variableValues)];
	}
	print():string{
		let l = this.left().print();
		let r = this.right().print();
		return (this.left().type>this.type?"("+l+")":l)+"*"+(this.right().type>this.type?"("+r+")":r);
	}
}
export class DivisionNode extends BinaryExpressionNode{
	constructor(left:ExpressionNode,right:ExpressionNode){
		super(NodeType._Division);
		this.args = [left,right];
	}
	clone(){
		return new DivisionNode(this.left().clone(),this.right().clone());
	}
	differentiate(variable:string, epsilon:number){
		return new SubtractionNode(
			new DivisionNode(
				this.left().differentiate(variable,epsilon),
				this.right().clone(),
			),
			new MultiplicationNode(
				this.right().differentiate(variable,epsilon),
				new DivisionNode(
					this.left().clone(),
					new FunctionNode("pow",[
						this.right().clone(),new ConstantNode(2)]
					)
				)
			)
		);
	}
	eval(variableValues:Record<string,number>|number[]){
		return this.left().eval(variableValues)/this.right().eval(variableValues);
	}
	simplify(){
		let l = this.left().simplify();
		let r = this.right().simplify();
		if(l instanceof ConstantNode){
			if(Math.abs(l.value)==0.0)
				return l;
			if(r instanceof ConstantNode){
				return new ConstantNode(l.value / r.value);
			}
		}else if(r instanceof ConstantNode){
			if(r.value == 1)
				return l;
			if(r.value == -1)
				return new NegationNode(l);
		}
		return new DivisionNode(l,r);
	}
	childs():ExpressionNode[]{
		return [this.left(),this.right()];
	}
	childDerivatives(variableValues:Record<string,number>|number[],epsilon:number = 0.001):number[]{
		let left = this.left().eval(variableValues);
		let right = this.right().eval(variableValues);
		return [1./right,-left/Math.pow(right,2)];
	}
	print():string{
		let l = this.left().print();
		let r = this.right().print();
		return (this.left().type>=this.type?"("+l+")":l)+"/"+(this.right().type>=this.type?"("+r+")":r);
	}
}