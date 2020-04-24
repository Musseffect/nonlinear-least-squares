import RPNCompiler from "./compiler/rpnCompiler.js";
import { vector } from "./vector";
import { matrix } from "./matrix";


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
export class OptimizerGaussNewton
{
    static run(f,p0,x,y,iterations,errAbsTol)
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
               let jac = f.dfdp(x[j],p);
               let dy = y[j] - f.f(x[j],p);
               error+=dy*dy;
               _f.addSelf(jac.scale(dy));
               for(let k=0;k<size;k++)
               {
                   for(let l=0;l<size;l++)
                   { 
                    m.set(l,k,m.get(l,k)+jac.get(k)*jac.get(l));
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
                        value += dfdp.get(l)*dfdp.get(k)+fy*dfdpdp.get(l,k);//TODO check indexes
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
    static run(f,size,x,y,iterations,particleCount,w,phi_p,phi_g,max,min)
    {
        let bestSolution = 0;
        let bestIndividualSolutions=[];
        let bestValue=10e8;
        let particles = [];
        let  solutions = [];
        //init
        for(let j=0;j<particleCount;j++)
        {
            let pos=[];
            let vel=[];
            for (let i = 0; i < size; i++)
            {
                pos.push(Math.random()*(max-min)+min);
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

/*
//f(x,p)
//initial values for pi
//arrays of x and y 
function optimizeNumerical(f, p, x, y, iterations, gamma,epsilon)
{
    for (let i = 0; i < iterations; i++)
    {
        let fxip = [];
        pOld = p.slice();
        for (let j = 0; j < x.length() ; j++)
        {
            fxip.push(f(x[j], pOld));
        }
        for (let j = 0; j < p.length() ; j++)
        {
            dpj = 0.0;
            pOld[j] += epsilon;
            for (let k = 0; k < x.length() ; k++)
            {
                dpj += 2.*(fxip[k]-y[k])*(f(x[k],pOld)-fxip[k])/epsilon;
            }
            pOld[j] -= epsilon;
            p[j]-=gamma*dpj;
        }
    }
    return p;
}
function optimizeAnalytic(f, dfdp, p, x, y, iterations, gamma) {
    for (let i = 0; i < iterations; i++) {
        let fxip = [];
        pOld = p.slice();
        for (let j = 0; j < x.length() ; j++) {
            fxip.push(f(x[j], pOld));
        }
        for (let j = 0; j < p.length() ; j++) {
            dpj = 0.0;
            for (let k = 0; k < x.length() ; k++) {
                dpj += 2. * (fxip[k] - y[k]) * dfdp[j](x[k],pOld);
            }
            p[j] -= gamma * dpj;
        }
    }
    return p;
}
function errValue(f,p,x,y)
{
    let value=0.0;
    for(let i=0;i<x.length();i++)
    {
        value+=Math.pow(f(x[i],p)-y[i],2);
    }
    return value;
}
function optimizeSwarm(f, dfdp,x,y,iterations,particleCount,w,phi_p,phi_g,max,min) {
    let bestSolution = undefined;
    let bestIndividualSolutions=[];
    let bestValue=10e8;
    let v = [];
    let particles = [];
    //init
    for(let j=0;j<particleCount;j++)
    {
        let pos=[];
        let vel=[];
        for (let i = 0; i < p.length() ; i++)
        {
            pos.push(Math.random()*(max[i]-min[i])+min[i]);
            vel.push(Math.random() * 2. - 1.);
        }
        let err = errValue(f, pos, x, y);
        if (err < bestValue)
        {
            bestSolution = j;
            bestValue = err;
        }
        particles.push({p:pos,v:vel});
        bestIndividualSolutions.push({p:pos.splice(),value:err});
    }
    //while true
    for (let i = 0; i < iterations; i++)
    {
        for (let j = 0; j < particleCount; j++) {
            let rp = Math.random();
            let rg = Math.random();
            let particle = particles[j];
            let solution = bestIndividualSolutions[j];
            for (let k = 0; k < p.length() ; k++) {
                particle.v[k] = particle.v[k] * w +
                    phi_g * rg * (bestSolution[k] - particle.p[k]) +
                    phi_p * rp * (solution.p[k] - particle.p[k]);
                particle.p[k] += particle.v[k];
            }
            let err = errValue(f, particle.p[k], x, y);
            if (err < bestValue) {
                bestSolution = j;
                bestValue = err;
            }
            if (err < solution.value) {
                solution.p = particle.p.splice();
                solution.value = err;
            }
        }
    }
    return particles[bestSolution].p;
}*/