import { matrix } from "./matrix";

function lerp(a:number,b:number,t:number):number{
    return a*(1-t) + b*t;
}
function clamp(x:number,min:number,max:number):number{
    return Math.max(min,Math.min(x,max));
}
export class vector{
    static outer(a:vector,b:vector):matrix{
        let result:matrix = matrix.empty(a.length(),b.length());
        for(let j = 0;j<a.length();j++){
            for(let i=0;i<b.length();i++){
                result.set(a.get(j)*b.get(i),j,i);
            }
        }
        return result;
    }
    static concat(vectors: vector[]) {
        let data:number[] = [];
        vectors.forEach(function(item){
            data = data.concat(item.data)
        });
        return new vector(data);
    }
    static dot(a: vector, b: vector):number {
        let result = 0;
        for(let i = 0;i<a.length();i++){
            result+=a.data[i]*b.data[i];
        }
        return result;
    }
    /**
     * vector interpolation
     */
    static mix(a:vector, b:vector,t:number):vector{
        let result = a.clone();
        for(let i=0;i<a.length();i++){
            result.data[i] = lerp(result.data[i],b.data[i],t);
        }
        return result;
    }
    data:number[];
    constructor(data:number[]){
        this.data = data;
    }
    static empty(length:number){
        let data:number[];
        (data = []).length = length; 
        data.fill(0);
        return new vector(data);
    }
    static add(a:vector,b:vector):vector{
        let result = [];
        for(let i=0;i<a.data.length;i++)
            result.push(a.data[i] + b.data[i]);
        return new vector(result);
    }
    static sub(a:vector,b:vector):vector{
        let result = [];
        for(let i=0;i<a.data.length;i++)
            result.push(a.data[i] - b.data[i]);
        return new vector(result);
    }
    static scale(a:vector,b:number):vector{
        let result = [];
        for(let i=0;i<a.data.length;i++)
            result.push(a.data[i] * b);
        return new vector(result);
    }
    clone():vector{
        return new vector(this.data.slice());
    }
    addSelf(b:vector):vector{
        for(let i=0;i<this.data.length;i++)
            this.data[i]+=b.data[i];
        return this;
    }
    subSelf(b:vector):vector{
        for(let i=0;i<this.data.length;i++)
            this.data[i]-=b.data[i];
        return this;
    }
    scaleSelf(b:number):vector{
        for(let i=0;i<this.data.length;i++)
            this.data[i]*=b;
        return this;
    }
    get(i:number){
        return this.data[i];
    }
    set(value:number, i:number):void{
        this.data[i] = value;
    }
    length(){
        return this.data.length;
    }
    getSubVector(offset:number,length:number):vector{
        let resultData = new Array(length);
        for(let i=0;i<length;i++)
            resultData[i] = this.data[offset+i];
        return new vector(resultData);
    }
    addSubVector(b:vector, offset:number):vector{
        for(let i=0;i<b.length();i++)
            this.data[i+offset] += b.get(i);
        return this;
    }
    subSubVector(b:vector, offset:number):vector{
        for(let i=0;i<b.length();i++)
            this.data[i+offset] -= b.get(i);
        return this;
    }
    add(b:vector, dest?:vector):vector{
        if(dest==undefined){
            dest = this;
        }
        for(let i=0;i<this.data.length;i++)
            dest.data[i] = this.data[i] + b.data[i];
        return dest;
    }
    sub(b:vector, dest?:vector):vector{
        if(dest==undefined){
            dest = this;
        }
        for(let i=0;i<this.data.length;i++)
            dest.data[i] = this.data[i] - b.data[i];
        return dest;
    }
    scale(b:number, dest?:vector):vector{
        if(dest==undefined){
            dest = this;
        }
        for(let i=0;i<this.data.length;i++)
            dest.data[i] = this.data[i] * b;
        return dest;
    }
    norm2():number{
        let result = 0;
        for(let i=0;i<this.data.length;i++)
            result += this.data[i]*this.data[i];
        return Math.sqrt(result);
    }
    clamp(min:vector,max:vector):void{
        for(let i = 0;i<this.data.length;i++){
            this.data[i] = clamp(this.data[i],min.data[i],max.data[i]);
        }
    }
}
