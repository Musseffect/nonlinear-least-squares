import RPNCompiler from "./compiler/rpnCompiler";
import { vector } from "./math/vector";
import { matrix } from "./math/matrix";
import { ExpressionNode } from "./compiler/expressionNodes";
import RPNExpression from "./compiler/rpnExpression";


export class FunctionExpression{
    variableNames:string[];
    function:RPNExpression;
    constructor(expression:ExpressionNode,variableNames:string[]){
        this.variableNames = variableNames;
        let variables:Record<string,number> = {};
        variableNames.forEach((element,index)=> {
            variables[element] = index;
        },this);
        let compiler = new RPNCompiler();
        this.function = compiler.compile(expression,variables);
    }
    f(args:number[]){
        return this.function.exec(args);
    }
    print(){
        return this.function.print(this.variableNames);
    }
}
export class LeastSquaresExpression{
    hessian:RPNExpression[];
    derivatives:RPNExpression[];
    parameters:string[];
    variableNames:string[];
    function:RPNExpression;
    size:number;
    constructor(expression:ExpressionNode,variableNames:string[],epsilon=0.01){
        //compute derivatives and hessian
        //compile rpn
        this.parameters = [];
        this.variableNames = variableNames;
        let variables:Record<string,number> = {};
        variableNames.forEach((element:string,index)=> {
            variables[element] = index;
            if(element!="x")
                this.parameters.push(element);
        },this);
        let compiler = new RPNCompiler();
        this.function = compiler.compile(expression,variables);
        this.hessian = [];
        this.derivatives = this.parameters.map(element=>{
            let derivativeExpression = expression.differentiate(element,epsilon).simplify();
            this.parameters.forEach(parameter=>{
                    let der = derivativeExpression.differentiate(parameter,epsilon).simplify();
                    this.hessian.push(compiler.compile(der,variables));
                })
            return compiler.compile(derivativeExpression,variables);
        });
        this.size = this.parameters.length;
    }
    print(){
        let result = "function: \n";
        result+= this.function.print(this.variableNames);
        result+= "\nderivative: \n"
        this.derivatives.forEach((der,index)=>{
            result+= `df/d${this.parameters[index]}: ${der.print(this.variableNames)}\n`;
        });
        this.hessian.forEach((der,index)=>{
            let y = Math.floor(index/this.size);
            let x = index%this.size;
            result+= `df/d${this.parameters[y]}d${this.parameters[x]}: ${der.print(this.variableNames)}\n`;
        });
        return result;
    }
    f(x:number,p:number[]){//f(x,p)
        let args = [].concat(x,p);
        return this.function.exec(args);
    }
    dfdp(x:number,p:number[]):vector{//vector of df/dp_i(x,p)
        let args = [].concat(x,p);
        let result = vector.empty(this.size);
        this.derivatives.forEach((der,index)=>{
            result.set(der.exec(args),index);
        });
        return result;
    }
    dfdpdp(x:number,p:number[]){//matrix of df/(dp_i dp_j)(x,p)
        let args = [].concat(x,p);
        let result = matrix.empty(this.size,this.size);
        this.hessian.forEach((der,index)=>{
            result.set(der.exec(args),Math.floor(index/this.size),index%this.size);
        });
        return result;
    }
}