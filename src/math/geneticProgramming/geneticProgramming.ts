import { NegationNode, VariableNode,ConstantNode, FunctionNode, MultiplicationNode, NodeType, SubtractionNode, DivisionNode, AdditionNode, ExpressionNode } from "../../compiler/expressionNodes";
import { functionDictionary } from "../../compiler/functions";


class NodeInfo{
    id:number;
    parent:ExpressionNode;
    depth:number;

}

export class GeneticProgrammingFitting{
    variables:string[];
    functions:string[];
    constantRange:{min:number,max:number};
    maxDepth:number;
    private pickNode(depth:number):ExpressionNode{
        let type = Math.floor(8*Math.random());
        if(depth>=this.maxDepth)
            type = Math.floor(Math.random()*2)+1;
        switch(type){
            case NodeType._Constant:
                return new ConstantNode(this.constantRange.min+Math.random()*(this.constantRange.max-this.constantRange.min));
            case NodeType._Variable:{
                let index = Math.floor(Math.random())*this.variables.length;
                return new VariableNode(this.variables[index],index);
            }
            case NodeType._Function:{
                if(this.functions.length!=0){
                    let index = Math.floor(this.functions.length*Math.random());
                    let functionName:string = this.functions[index];
                    let functionEntry = functionDictionary[functionName];
                    let args = [];
                    for(let i = 0;i<functionEntry.args;i++){
                        args.push(this.pickNode(depth+1));
                    }
                    return new FunctionNode(functionName,args);
                }
            }
            case NodeType._Negation:
                return new NegationNode(this.pickNode(depth+1));
            case NodeType._Multiplication:
                return new MultiplicationNode(this.pickNode(depth+1),this.pickNode(depth+1));
            case NodeType._Division:
                return new DivisionNode(this.pickNode(depth+1),this.pickNode(depth+1));
            case NodeType._Subtraction:
                return new SubtractionNode(this.pickNode(depth+1),this.pickNode(depth+1));
            case NodeType._Addition:
                return new AdditionNode(this.pickNode(depth+1),this.pickNode(depth+1));
        }
        throw new Error("WHAT?");
    }
    static fitnessValue(x:number[],y:number[],formula:ExpressionNode){
        let result = 0;
        for(let i=0;i<x.length;i++){
            result+=Math.pow(formula.eval([x[i]])-y[i],2);
        }
        return result;
    }
    private gatherNodes(node:ExpressionNode,
        parent:ExpressionNode|null,
        depth:number,
        id:number,
        outArray:NodeInfo[]){
        outArray.push({depth:depth,parent,id});
        node.args.forEach((item,i)=>this.gatherNodes(item,node,depth+1,i,outArray));
    }
    /*compute df/d(node)

          a:f
          / \
        b:g c:x
       / \
    d:3  e:x

      df/d(e) = d(a)/d(b) * d(b)/d(e) = d(f)/d(g) * d(g)/d(x)
    */
    private gatherDerivatives(node:ExpressionNode,index:number,x:number,derValue:number,outArray:number[]):number{
        outArray[index]+=derValue;
        let childs = node.args;
        node.childDerivatives([x]).forEach((item,childId)=>index = this.gatherDerivatives(childs[childId],index+1,x,derValue*item,outArray));
        return index;
    }
    private exchangeNode(formula:ExpressionNode,nodeInfo:NodeInfo):ExpressionNode{
        if(nodeInfo.parent==null)
            return this.pickNode(0);
        nodeInfo.parent.args[nodeInfo.id] = this.pickNode(nodeInfo.depth);
        return formula;
    }
    //use derivative dErr/dNode as priority
    private mutateWithPriority(formula:ExpressionNode,x:number[],y:number[]):ExpressionNode{
        let nodes:NodeInfo[] = [];
        this.gatherNodes(formula.clone(),null,0,0,nodes);
        let derivatives = nodes.map(()=>0);
        for(let i=0;i<x.length;i++){
            let derivative = (formula.eval([x[i]])-y[i]);
            this.gatherDerivatives(formula,0,x[i],derivative,derivatives);
        }
        let derivativesTotal = derivatives.reduce((prev,curVal)=>prev+curVal,0);
        let random = Math.random()*derivativesTotal;
        let accum = 0;
        for(let i=0;i<derivatives.length;i++){
            accum+=Math.abs(derivatives[i]);
            if(random<=accum)
            {
                return this.exchangeNode(nodes[i].parent,nodes[i]);
            }
        }
        return this.pickNode(0);
    }
    private mutate(formula:ExpressionNode):ExpressionNode{
        let nodes:NodeInfo[] = [];
        this.gatherNodes(formula.clone(),null,0,0,nodes);
        let nodeIndex = Math.floor(Math.random()*nodes.length);
        return this.exchangeNode(formula, nodes[nodeIndex]);
    }
    public solve(x:number[],y:number[],includeFunctions:string[],iterations:number,maxDepth:number,useMutationPriority:boolean){
        this.functions = Object.keys(functionDictionary).filter(key=>{return includeFunctions.includes(key)});
        this.maxDepth = maxDepth;
        this.variables = ["x"];
        this.constantRange = {min:-100,max:100};
        //create first formula
        let formula = this.pickNode(0);
        let fitnessValue = GeneticProgrammingFitting.fitnessValue(x,y,formula);
        for(let i=0;i<iterations;i++){
            let newFormula = (useMutationPriority?this.mutateWithPriority(formula,x,y):this.mutate(formula));
            let newFitnessValue = GeneticProgrammingFitting.fitnessValue(x,y,newFormula);
            if((fitnessValue>newFitnessValue||isNaN(fitnessValue))&&!isNaN(newFitnessValue)){
                formula = newFormula;
                fitnessValue = newFitnessValue;
            }
        }
        return {error:fitnessValue,formula:formula};
    }
}