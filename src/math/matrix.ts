import { vector } from "./vector";

export class matrix {
    multVec(dx: vector):vector {
        let result:vector = vector.empty(this.height);
        for(let i=0;i<this.height;i++){
            let v = 0;
            for(let j=0;j<this.width;j++)
            {
                v+=this.get(j,i) * dx.get(j);
            }
            result.set(v,i);
        }
        return result;
    }
    width:number;
    height:number;
    data:number[];
    constructor(data:number[],columns:number,rows:number){
        this.data = data;
        this.width = columns;
        this.height = rows;
    }
    /**
    * creates empty identity matrix
    */
    static identity(size:number):matrix{
        let data:number[];
        (data = []).length = size*size; 
        data.fill(0);
        for(let i=0;i<size;i++){
            data[i+i*size] = 1;
        }
        return new matrix(data,size,size);
    }
    /**
    * creates empty square matrix
    */
    static emptySquare(size:number):matrix{
        let data:number[];
        (data = []).length = size*size; 
        data.fill(0);
        return new matrix(data,size,size);
    }
    /**
    * creates empty rectangular matrix
    */
    static empty(rows:number,columns:number):matrix{
        let data:number[];
        (data = []).length = rows*columns; 
        data.fill(0);
        return new matrix(data,columns,rows);
    }
    static add(a:matrix,b:matrix):matrix{
        let result = [];
        for(let i=0;i<a.data.length;i++)
            result.push(a.data[i] + b.data[i]);
        return new matrix(result,a.width,a.height);
    }
    static sub(a:matrix,b:matrix):matrix{
        let result = [];
        for(let i=0;i<a.data.length;i++)
            result.push(a.data[i] - b.data[i]);
        return new matrix(result,a.width,a.height);
    }
    static scale(a:matrix,b:number):matrix{
        let result = [];
        for(let i=0;i<a.data.length;i++)
            result.push(a.data[i] * b);
        return new matrix(result,a.width,a.height);
    }
    /**
     * matrix multiplication 
     * @param a matrix with (width = w_a, height = h_a)
     * @param b matrix with (width = w_b, height = w_a)
     * @returns matrix with (width = w_b, height = h_a)
     */
    static mult(a:matrix,b:matrix):matrix{
        let result = matrix.empty(a.height,b.width);
        //for each cell in the result
        for(let j=0;j<a.height;j++){
            for(let i=0;i<b.width;i++){
                let value = 0;
                for(let k = 0;k<a.width;k++){
                    value += a.get(j,k) * b.get(k,i);
                }
                result.set(value,j,i);
            }
        }
        return result;
    }
    /**
    * get value
    * @param row row
    * @param column column
    */
    get(row:number,column:number):number{
        return this.data[row*this.width+column];
    }
    /**
    * set value
    * @param value value
    * @param row row
    * @param column column
    */
    set(value:number,row:number,column:number){
        this.data[row*this.width+column] = value;
    }
    /**
    * multiply matrix by scalar and store result in dest
    * @param b scalar
    * @param dest destination matrix
    * @return result
    */
    scale(b:number, dest?:matrix):matrix{
        if(dest==undefined){
            dest = this;
        }
        for(let i=0;i<this.data.length;i++)
            dest.data[i] = this.data[i] * b;
        return this;
    }
    add(b:matrix, dest?:matrix):matrix{
        if(dest==undefined){
            dest = this;
        }
        for(let i=0;i<this.data.length;i++)
            dest.data[i] = this.data[i] + b.data[i];
        return this;
    }
    sub(b:matrix, dest?:matrix):matrix{
        if(dest==undefined){
            dest = this;
        }
        for(let i=0;i<this.data.length;i++)
            dest.data[i] = this.data[i] - b.data[i];
        return this;
    }
    scaleSelf(b:number):matrix{
        for(let i=0;i<this.data.length;i++)
            this.data[i]*=b;
        return this;
    }
    addSelf(b:matrix):matrix{
        for(let i=0;i<this.data.length;i++)
            this.data[i]+=b.data[i];
        return this;
    }
    subSelf(b:matrix):matrix{
        for(let i=0;i<this.data.length;i++)
            this.data[i]-=b.data[i];
        return this;
    }
    addSubMatrix(b:matrix,rowOffset:number,columnOffset:number):matrix{
        
        for(let j=0;j<b.height;j++)
        {
            for(let i=0;i<b.width;i++)
            {
                let value = this.get(j+rowOffset,i + columnOffset)+b.get(j,i);
                this.set(value,j+rowOffset,i+columnOffset);
            }
        }
        return this;
    }
    subSubMatrix(b:matrix,rowOffset:number,columnOffset:number):matrix{
        
        for(let j=0;j<b.height;j++)
        {
            for(let i=0;i<b.width;i++)
            {
                let value = this.get(j+rowOffset,i + columnOffset)-b.get(j,i);
                this.set(value,j+rowOffset,i+columnOffset);
            }
        }
        return this;
    }
    static solve(A:matrix,b:vector){
        var rang=b.length();
        var x:vector=vector.empty(rang);
        let epsilon=0.001
        var indexes = new Array(rang);
        for (var i = 0; i < rang; i++){
            indexes[i] = i;
        }
        for (var l = 0; l < rang; l++){
            var max = l;
            for (var i = l + 1; i < rang; i++){
                if (Math.abs(A.get(indexes[i],l))>Math.abs(A.get(indexes[max],l)))
                    max = i;
            }
            if (max != l){
                var temp = indexes[l];
                indexes[l] = indexes[max];
                indexes[max] = temp;
            }
            if (Math.abs(A.get(indexes[l],l)) < epsilon){
                for(var i=0;i<rang;i++)
                    x.set(0.0,i);
                return x;
            }
            for (var i = l + 1; i < rang; i++)
                A.set(A.get(indexes[l],i) / A.get(indexes[l],l),indexes[l],i);
            b.set(b.get(indexes[l]) / A.get(indexes[l],l), indexes[l]);
            A.set(1,indexes[l],l);
    
            for (var i = l + 1; i < rang; i++){
                for (var k = l + 1; k < rang; k++)
                    A.set(A.get(indexes[i],k) - A.get(indexes[i],l) * A.get(indexes[l],k),indexes[i],k);
                b.set(b.get(indexes[i]) - A.get(indexes[i],l) * b.get(indexes[l]), indexes[i]);
                A.set(0,indexes[i],l);
            }
        }
        x.set(b.get(indexes[rang - 1]),rang - 1);
        for (var i = rang - 2; i > -1; i--){
            var k = 0.;
            for (var j = i + 1; j < rang; j++){
                k = k + A.get(indexes[i],j) * x.get(j);
            }
            x.set(b.get(indexes[i]) - k,i);
        }
        return x;
    }
}
