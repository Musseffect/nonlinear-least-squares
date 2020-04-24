import { vector } from "./vector";

export class matrix {
    constructor(w, h) {
        this.w = w;
        this.h = h;
        this.data = new Array(w*h);
        this.data.fill(0);
    }
    get(x, y) {
        return this.data[x + y * this.w];
    }
    set(x, y, value) {
        this.data[x + y * this.w] = value;
    }
    static solve(a,b)
    {
        var rang=b.l;
        var x=new vector(rang);
        let epsilon=0.001
        function index(i,j)
        {
            return i*rang + j;
        };
        var indexes = new Array(rang);
        for (var i = 0; i < rang; i++)
        {
            indexes[i] = i;
        }
        for (var l = 0; l < rang; l++)
        {
            var max = l;
            for (var i = l + 1; i < rang; i++)
            {
                if (Math.abs(a.get(l, indexes[i]))>Math.abs(a.get(l, indexes[max])))
                    max = i;
            }
            if (max != l)
            {
                var temp = indexes[l];
                indexes[l] = indexes[max];
                indexes[max] = temp;
            }
            if (Math.abs(a.get(l, indexes[l])) < epsilon)
            {
                for(var i=0;i<rang;i++)
                    x.set(i,0.0);
                return x;
            }
            for (var i = l + 1; i < rang; i++)
                a.set(i, indexes[l], a.get(i, indexes[l]) / a.get(l, indexes[l]));
            b.set(indexes[l], b.get(indexes[l]) / a.get(l, indexes[l]));
            a.set(l,indexes[l], 1);
    
            for (var i = l + 1; i < rang; i++)
            {
                for (var k = l + 1; k < rang; k++)
                    a.set(k,indexes[i], a.get(k,indexes[i]) - a.get(l,indexes[i]) * a.get(k,indexes[l]));
                b.set(indexes[i], b.get(indexes[i]) - a.get(l, indexes[i]) * b.get(indexes[l]));
                a.set(l,indexes[i],0);
            }
        }
        x.set(rang - 1, b.get(indexes[rang - 1]));
        for (var i = rang - 2; i > -1; i--)
        {
            var k = 0.;
            for (var j = i + 1; j < rang; j++)
            {
                k = k + a.get(j,indexes[i]) * x.get(j);
            }
            x.set(i,b.get(indexes[i]) - k);
        }
        return x;
    }
}
