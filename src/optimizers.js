import RPNCompiler from "./compiler/rpnCompiler.js";
import { vector } from "./vector";
import { matrix } from "./matrix";

export class OptimizerFourier
{
    static execSeries(a,b,a0,period,t)
    {
        let value = a0;
        for(let i=0;i<a.length;i++)
        {
            let angle = 2*Math.PI*(i+1)*t/period;
            value += a[i]*Math.cos(angle)+b[i]*Math.sin(angle);
        }
        return value;
    }
    static run(x,y,harmonics,period)
    {
        let m = new matrix(harmonics*2+1,harmonics*2+1);
        let f = new vector(harmonics*2+1);
        for(let i=0;i<x.length;i++)
        {
            f.set(0,f.get(0)+y[i]);
            for(let j=0;j<harmonics;j++)
            {
                let angle = 2*Math.PI*(j+1)*x[i]/period;
                let ca = Math.cos(angle);
                let sa = Math.sin(angle);
                let a = f.get(1+j) + ca*y[i];
                f.set(1+j,a);
                let b = f.get(1+j+harmonics) + sa*y[i];
                f.set(1+j+harmonics,b);
                m.set(0,0,x.length);
                m.set(0,j+1,m.get(0,j+1)+ca);//first column
                m.set(0,j+harmonics+1,m.get(0,j+harmonics+1)+sa);//first column
                m.set(j+1,0,m.get(j+1,0)+ca);//first row
                m.set(j+harmonics+1,0,m.get(j+harmonics+1,0)+sa);//first row
                for(let k=0;k<harmonics;k++)
                {
                    let angle2 = 2*Math.PI*(k+1)*x[i]/period;
                    let ca2 = Math.cos(angle2);
                    let sa2 = Math.sin(angle2);
                    m.set(k+1,j+1,m.get(k+1,j+1)+ca2*ca);
                    m.set(k+harmonics+1,j+1,m.get(k+harmonics+1,j+1)+sa2*ca);
                    m.set(k+1,j+harmonics+1,m.get(k+1,j+harmonics+1)+ca2*sa);
                    m.set(k+harmonics+1,j+harmonics+1,m.get(k+harmonics+1,j+harmonics+1)+sa2*sa);
                }
            }
        }
        let ab = matrix.solve(m,f);
        return {
            a0:ab.data[0],
            a:ab.data.slice(1,1+harmonics),
            b:ab.data.slice(1+harmonics)
        };
    }
}

export class OptimizerGradient
{
    static run(f,p0,x,y,iterations,errAbsTol,rate=1.0)
    {
        let p = p0.slice();
        let size = p0.length;
        for (let i = 0; i < iterations; i++) {
            let error = 0.0;
            let dp = new vector(size);
            for (let j = 0; j < x.length; j++) {
                let r = f.f(x[j],p)-y[j];
                error+=r*r;
                dp.addSelf(f.dfdp(x[j],p).scaleSelf(r));
            }
            if(error<errAbsTol)
            {
                break;
            }
            dp.scaleSelf(-rate/x.length*2.0);
            for(let k=0;k<size;k++)
                p[k]+=dp.get(k);
        }
        let error = 0.0;
        for(let i=0;i<x.length;i++)
        {
            error+=Math.pow(f.f(x[i],p)-y[i],2.0);
        }
        return {solution:p,error:error};
    }
}
export class OptimizerGaussNewton
{
    static run(f,p0,x,y,iterations,alpha,errAbsTol)
    {
        let p = p0.slice();
        let size = p0.length;
        for(let i=0;i<iterations;i++)
        {
           let _f = new vector(size);
           let m = new matrix(size,size);
           let error = 0.0;
           for(let j=0;j<x.length;j++)
           {
               let r = f.f(x[j],p) - y[j];
               let drdp = f.dfdp(x[j],p);
               error+=r*r;
               _f.addSelf(drdp.scale(-r*alpha));
               for(let k=0;k<size;k++)
               {
                   for(let l=0;l<size;l++)
                   { 
                       let val = m.get(l,k)+drdp.get(k)*drdp.get(l)
                        m.set(l,k,val);
                   }
               }
           }
           if(error<errAbsTol)
                break;
           let dp = matrix.solve(m,_f);
           for(let i=0;i<size;i++)
               p[i]+=dp.get(i);
        }
        let error = 0.0;
        for(let i=0;i<x.length;i++)
        {
            error+=Math.pow(f.f(x[i],p)-y[i],2.0);
        }
        return {solution:p,error:error};
    }
}
export class OptimizerNewton
{
    static run(f,p0,x,y,iterations,alpha,fAbsTol)
    {
        //compute vector df/dp
        //compute hessian matrix df/dpdp
        let p = p0.slice();
        let size = p0.length;
        for(let i=0;i<iterations;i++)
        {
            let hessian = new matrix(size,size);
            let dedp = new vector(size);
            for(let j=0;j<x.length;j++)
            {
                let dfdp = f.dfdp(x[j],p);
                let dfdpdp = f.dfdpdp(x[j],p);
                let fy = f.f(x[j],p)-y[j];
                for(let k=0;k<size;k++)
                {
                    for(let l=0;l<size;l++)
                    {
                        let value = hessian.get(l,k);
                        value += dfdp.get(l)*dfdp.get(k)+fy*dfdpdp.get(l,k);//TODO check indicies
                        hessian.set(l, k, value);
                    }
                    let value = dedp.get(k);
                    value+=fy*dfdp.get(k);
                    dedp.set(k, value);
                }
            }
            dedp.scaleSelf(-alpha);
            let norm = dedp.l2norm();
            let dp = matrix.solve(hessian,dedp);
            for(let i=0;i<size;i++)
                p[i]+=dp.get(i);
            if(norm<fAbsTol)
            {
                let error = 0.0;
                for(let i=0;i<x.length;i++)
                {
                    error+=Math.pow(f.f(x[i],p)-y[i],2.0);
                }
                return {solution:p,error:error};
            }
        }
        let error = 0.0;
        for(let i=0;i<x.length;i++)
        {
            error+=Math.pow(f.f(x[i],p)-y[i],2.0);
        }
        return {solution:p,error:error};
    }
}
export class OptimizerSwarm
{
    static errValue(f,p,x,y)
    {
        let error = 0.0;
        for(let i=0;i<x.length;i++)
        {
            error+=Math.pow(f.f(x[i],p)-y[i],2.0);
        }
        return error;
    }
    static run(f,p0,x,y,iterations,particleCount,w,phi_p,phi_g,max,min)
    {
        let bestSolution = 0;
        let bestIndividualSolutions=[];
        let bestValue=10e8;
        let particles = [];
        let  solutions = [];
        let size = p0.length;
        //init
        for(let j=0;j<particleCount;j++)
        {
            let pos=[];
            let vel=[];
            for (let i = 0; i < size; i++)
            {
                pos.push(Math.random()*(max-min)+min + p0[i]);
                vel.push(Math.random() * 2. - 1.);
            }
            let err = OptimizerSwarm.errValue(f, pos, x, y);
            if (err < bestValue)
            {
                bestSolution = j;
                bestValue = err;
            }
            particles.push({p:pos,v:vel});
            bestIndividualSolutions.push({p:pos.slice(),value:err});
        }
        //while true
        for (let i = 0; i < iterations; i++)
        {
            for (let j = 0; j < particleCount; j++) {
                let rp = Math.random();
                let rg = Math.random();
                let particle = particles[j];
                for (let k = 0; k < size ; k++) {
                    particle.v[k] = particle.v[k] * w +
                        phi_g * rg * (bestIndividualSolutions[bestSolution].p[k] - particle.p[k]) +
                        phi_p * rp * (bestIndividualSolutions[j].p[k] - particle.p[k]);
                    particle.p[k] += particle.v[k];
                }
                let err = OptimizerSwarm.errValue(f, particle.p, x, y);
                if (err < bestValue) {
                    bestSolution = j;
                    bestValue = err;
                    bestIndividualSolutions[j].p = particle.p.slice();
                    bestIndividualSolutions[j].value = err;
                }else if(err<bestIndividualSolutions[j].value)
                {
                    bestIndividualSolutions[j].value = err;
                    bestIndividualSolutions[j].p = particle.p.slice();
                }
            }
        }
        return {solution:bestIndividualSolutions[bestSolution].p,error:bestValue};
    }
}