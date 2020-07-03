export class vector {
    constructor(l) {
        this.l = l;
        this.data = new Array(l);
        this.data.fill(0);
    }
    clone()
    {
        let _res = new vector(this.l);
        for(let i=0;i<this.l;i++)
            _res.data[i] = this.data[i];
        return _res;
    }
    static fromArray(data)
    {
        let _res = new vector(0);
        _res.data = data;
        _res.l = data.length;
        return _res;
    }
    l2norm()
    {
        let norm = 0.0;
        for(let i=0;i<this.l;i++)
            norm += this.data[i]*this.data[i];
        return Math.sqrt(norm);
    }
    get(x) {
        return this.data[x];
    }
    set(x, value) {
        this.data[x] = value;
    }
    scale(a)
    {
        let _res = new Array(this.l);
        for (let i = 0; i < this.l; i++)
            _res[i] = this.data[i] * a;
        return vector.fromArray(_res);
    }
    scaleSelf(a) {
        for (let i = 0; i < this.l; i++)
            this.data[i] *= a;
        return this;
    }
    addSelf(v) {
        for (let i = 0; i < this.l; i++)
            this.data[i] += v.data[i];
        return this;
    }
    subSelf(v) {
        for (let i = 0; i < this.l; i++)
            this.data[i] -= v.data[i];
        return this;
    }
    sub(v){
        let _res = new Array(this.l);
        for (let i = 0; i < this.l; i++)
            _res[i] = this.data[i] - v.data[i];
        return vector.fromArray(_res);
    }
    add(v){
        let _res = new Array(this.l);
        for (let i = 0; i < this.l; i++)
            _res[i] = this.data[i] + v.data[i];
        return vector.fromArray(_res);
    }
}
