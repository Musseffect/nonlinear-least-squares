import { ContOpt1D, ContOptND } from "./optimizationProblem";
import { vector } from "./vector";
import { matrix } from "./matrix";

function swap(a:number,b:number){
    return [b,a];
}

function intersectHyperCube(origin:vector,direction:vector,min:vector,max:vector,dimensions:number):number{
    let tmin:number, tmax:number;
    tmin = (min.get(0) - origin.get(0)) / direction.get(0);
    tmax = (max.get(0) - origin.get(0)) / direction.get(0);
    if (tmin > tmax)
        [tmin,tmax] = swap(tmin, tmax);
    for (let i = 1; i < dimensions; i++)
    {
        let _tmin = (min.get(i) - origin.get(i)) / direction.get(i);
        let _tmax = (max.get(i) - origin.get(i)) / direction.get(i);
        if (_tmin > _tmax)
            [_tmin,_tmax] = swap(_tmin, _tmax);
        if (tmin > _tmax || _tmin > tmax)
            throw new Error("Impossible case. Ray is not pointing in hyperbox.");
        tmin = Math.max(tmin,_tmin);
        tmax = Math.min(tmax, _tmax);
    }
    return tmax;
}

interface Solver1D{
    solve(problem:ContOpt1D):number;
}
interface SolverND{
    solve(problem:ContOptND):vector;
}
class GoldenSearch1D implements Solver1D{
    epsilon:number;
    iterations:number;
    constructor(epsilon:number,iterations:number){
        this.epsilon = epsilon;
        this.iterations = iterations;
    }
    solve(problem:ContOpt1D):number{
        let {min,max} = problem.getBounds();
        let a = min,b = max;
        let  t = (1.0 + Math.sqrt(5.0))/2.0;

        let x2:number = a + (b - a) / t;
        let x1:number = a + b - x2;
        let fx1:number = problem.f(x2);
        let fx2:number = problem.f(x1);
        let i = 0;
        while (i<this.iterations)
        {
            if (fx1 < fx2)
            {
                b = x2;
                x2 = x1;
                fx2 = fx1;
                x1 = a + b - x2;
                fx1 = problem.f(x1);
            }
            else {
                a = x1;
                x1 = x2;
                fx1 = fx2;
                x2 = a + (b - a) / t;
                fx2 = problem.f(x2);
            }
            if (Math.abs(a - b) < this.epsilon)
            {
                break;
            }
            i++;
        }
        let x = (a + b) * 0.5;
        return  x;
    }
}
class GradientDescent1D implements Solver1D{
    gamma:number;
    iterations:number;
    epsilon:number;
    cosntructor(gamma:number,iterations:number,epsilon:number){
        this.gamma = gamma;
        this.iterations = iterations;
        this.epsilon = epsilon;
    }
    solve(problem:ContOpt1D):number{
        let {min,max} = problem.getBounds();
        let x = 0.5*(min + max);
        for(let i=0;this.iterations;i++){
            let dfdx = problem.dfdx(x);
            x-=this.gamma * dfdx;
            if(Math.abs(dfdx)<=this.epsilon)
                break;
        }
        return x;
    }

}
class Newton1D implements Solver1D{
    iterations:number;
    alpha:number;
    fAbsTol:number;
    epsilon:number;
    constructor(iterations:number,alpha:number,fAbsTol:number,epsilon:number){
        this.iterations = iterations;
        this.alpha = alpha;
        this.fAbsTol = fAbsTol;
        this.epsilon = epsilon;
    }
    solve(problem:ContOpt1D):number{
        let {min,max} = problem.getBounds();
        let x = 0.5*(min + max);
        for(let i=0;this.iterations;i++){
            let dfdx = problem.dfdx(x);
            let dfdxdx = problem.dfdxdx(x);
            let dx = -dfdx/dfdxdx;
            x-=this.alpha * dx;
            if(Math.abs(dx)<this.epsilon||Math.abs(dfdx)<this.fAbsTol)
                break;
            x = Math.max(Math.min(x,max),min);
        }
        return x;
    }
}
class LineSearchND extends ContOpt1D{
    problem:ContOptND;
    ro:vector;
    rd:vector;
    constructor(initial:number,min:number,max:number,ro:vector,rd:vector,problem:ContOptND){
        super();
        this.initial = initial;
        this.min = min;
        this.max = max;
        this.ro = ro;
        this.rd = rd;
        this.problem = problem;
    }
    f(x: number): number {
        let point:vector = vector.scale(this.rd,x).addSelf(this.ro);
        return this.problem.f(point);
    }
    dfdx(x: number): number {
        let point:vector = vector.scale(this.rd,x).addSelf(this.ro);
        return vector.dot(this.rd,this.problem.dfdx(point));
    }
    dfdxdx(x: number): number {
        let point:vector = vector.scale(this.rd,x).addSelf(this.ro);
        let dfddx = this.problem.dfdxdx(point);
        return vector.dot(dfddx.multVec(this.rd),this.rd);
    }

}
class GradientDescent implements SolverND{
    iterations:number;
    maxStep:number;
    fixedStep:boolean;
    step:number;
    epsilon:number;
    stepOpt:Solver1D;
    solve(problem:ContOptND):vector{
        let s = problem.getInitial().clone();
        let bounds = problem.getBounds();
        for(let i=0;i<this.iterations;i++){
            let der = problem.dfdx(s).scaleSelf(-1);
            let norm = der.norm2();
            if(this.fixedStep){
                s.addSelf(der.scaleSelf(Math.min(this.maxStep,norm*this.step)/norm));
                s.clamp(bounds.min,bounds.max);
            }else{
                let step = intersectHyperCube(s,der,bounds.min,bounds.max,problem.getDimensions());
                step = Math.min(step,this.maxStep/norm);
                step = this.stepOpt.solve(new LineSearchND(0,0,step,s,der,problem));
                s.addSelf(der.scaleSelf(step));
            }
            let error = problem.f(s);
            if(error<this.epsilon)
                break;
        }
        return s;
    }
}
class Newton implements SolverND{
    iterations:number;
    gamma:number;
    epsilon:number;
    fixedStep:boolean;
    stepOpt:Solver1D;
    solve(problem:ContOptND):vector{
        let s = problem.getInitial().clone();
        let bounds = problem.getBounds();
        for(let i=0;i<this.iterations;i++){
            let der = problem.dfdx(s).scaleSelf(-1);
            let H = problem.dfdxdx(s);
            let norm = der.norm2();
            if(this.fixedStep){
                let shift = matrix.solve(H,der.scaleSelf(this.gamma));
                s.addSelf(shift);
                s.clamp(bounds.min,bounds.max);
            }else{
                let dir = matrix.solve(H,der);
                let step = intersectHyperCube(s,dir,bounds.min,bounds.max,problem.getDimensions());
                step = this.stepOpt.solve(new LineSearchND(0,0,step,s,der,problem));
                s.addSelf(der.scaleSelf(step));
            }
            let error = problem.f(s);
            if(error<this.epsilon)
                break;
        }
        return s;
    }
}
/**
 * Nonlinear conjugate gradients
 */
class ConjugateGradients implements SolverND{
    iterations:number;
    maxStep:number;
    epsilon:number;
    stepOpt:Solver1D;
    solve(problem:ContOptND):vector{
        let s = problem.getInitial().clone();
        let bounds = problem.getBounds();
        let prevDer = problem.dfdx(s).scaleSelf(-1);
        let prevDir = problem.dfdx(s).scaleSelf(-1);
        for(let i=0;i<this.iterations;i++){
            let der = problem.dfdx(s).scaleSelf(-1);
            //Polak Ribiere beta
            let beta = vector.dot(prevDer,vector.sub(der,prevDer))/vector.dot(prevDer,prevDer);
            let dir:vector = der.clone();
            if(beta>0)
                dir.addSelf(vector.scale(prevDir,beta));
            prevDer = der;
            prevDir = dir;
            let step = intersectHyperCube(s,dir,bounds.min,bounds.max,problem.getDimensions());
            step = this.stepOpt.solve(new LineSearchND(0,0,step,s,der,problem));
            s.addSelf(vector.scale(dir,step));
            s.clamp(bounds.min,bounds.max);
            let error = problem.f(s);
            if(error<this.epsilon)
                break;
        }
        return s;
    }
}
