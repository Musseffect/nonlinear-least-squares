import { vector } from "./vector";
import { matrix } from "./matrix";




/**
 * N-dimensional continuous optimization 
 */
export abstract class ContOptND{
    min:vector;
    max:vector;
    initial:vector;
    getBounds():{min:vector,max:vector}{
        return {min:this.min, max:this.max};
    }
    getInitial():vector{
        return this.initial;
    }
    getDimensions():number{
        return this.initial.length();
    }
    abstract f(x:vector):number;
    abstract dfdx(x:vector):vector;
    abstract dfdxdx(x:vector):matrix;
}

/**
 * 1-dimensional continuous optimization
 */
export abstract class ContOpt1D{
    min:number;
    max:number;
    initial:number;
    getBounds():{min:number,max:number}{
        return {min:this.min, max:this.max};
    }
    getInitial():number{
        return this.initial;
    }
    abstract f(x:number):number;
    abstract dfdx(x:number):number;
    abstract dfdxdx(x:number):number;
}