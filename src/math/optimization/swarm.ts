/*

variables:
 x:[-5,5] = initialValueExpression;
 z:{1,2,12,154,23,4} = initialValueExpression;
 y:[-17,19,0.2] = initialValueExpression;
bounds: 
    (boolExp;)* 
cost:

v = z*z*z-sin(x);
if(x>3)
    cost = x*z;
else
    cost = v+5;




*/
abstract class Value{
    abstract set(value:number):void;
    abstract get():number;
    abstract initRandom():void;
}
class ContinuousValue extends Value{
    value:number;
    min:number;
    max:number;
    set(value:number):void{
        this.value = value;
    }
    get():number{
        return this.value;
    }
    initRandom():void{
        this.value = Math.random()*(this.max-this.min)+this.min;
    }
}
class DiscreteValue extends Value{
    value:number;
    min:number;
    max:number;
    step:number;
    constructor(){
        super();
    }
    set(value:number):void{
        this.value = Math.max(Math.min(value,this.max),this.min);
        this.value = Math.round((this.value-this.min)/this.step)*this.step;
    }
    get():number{
        return this.value;
    }
    initRandom():void{
        this.value = Math.random()*(this.max-this.min)+this.min;
        this.value = Math.round((this.value-this.min)/this.step)*this.step;
    }
}
class SetValue extends Value{
    index:number;
    _set:number[];
    constructor(_set:number[],value:number){
        super();
        this._set = _set.sort();
        this.index = this.findClosest(value);
    }
    findClosest(value:number):number{
        let min = 0;
        let max = this._set.length;
        while(true){
            let current = Math.floor((max+min)/2);
            if(max==current||min==current){
                let a = this._set[min];
                let b = this._set[max];
                if(Math.abs(a-value)<Math.abs(b-value)){
                    return min;
                }
                return max;
            }
            if(this._set[current]>value){
                max = current;
            }else{
                min = current;
            }
        }
    }
    initRandom():void{
        this.index = Math.floor(Math.random()*this._set.length);
    }
    set(value:number):void{
        this.index = this.findClosest(value);
    }
    get():number{
        return this._set[this.index];
    }
}
abstract class GeneralOptimizationProblem{

    abstract costFunction(x:Value[]):number;
    abstract boundPredicate(x:Value[]):boolean;
}
/*

variables:
 x:[-5,5] = initialValueExpression;
 z:[-13,3] = initialValueExpression;
 y:[-17,19] = initialValueExpression;
bounds: 
    (boolExp;)* 
cost:
v = z*z*z-sin(x);
if(x>3)
    cost = x*z;
else
    cost = v+5;
*/