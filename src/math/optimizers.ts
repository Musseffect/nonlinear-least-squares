import { vector } from "./vector";
import { matrix } from "./matrix";
import { LeastSquaresExpression } from "../functionExpression.js";

export class OptimizerFourier{
    static execSeries(a:number[],b:number[],a0:number,period:number,t:number){
        let value = a0;
        for(let i=0;i<a.length;i++){
            let angle = 2*Math.PI*(i+1)*t/period;
            value += a[i]*Math.cos(angle)+b[i]*Math.sin(angle);
        }
        return value;
    }
    static run(x:number[],y:number[],harmonics:number,period:number){
        let m = matrix.empty(harmonics*2+1,harmonics*2+1);
        let f = vector.empty(harmonics*2+1);
        for(let i=0;i<x.length;i++){
            f.set(f.get(0)+y[i],0);
            for(let j=0;j<harmonics;j++){
                let angle = 2*Math.PI*(j+1)*x[i]/period;
                let ca = Math.cos(angle);
                let sa = Math.sin(angle);
                let a = f.get(1+j) + ca*y[i];
                f.set(a,1+j);
                let b = f.get(1+j+harmonics) + sa*y[i];
                f.set(b,1+j+harmonics);
                m.set(x.length,0,0);
                m.set(m.get(j+1,0)+ca,j+1,0);//first column
                m.set(m.get(j+harmonics+1,0)+sa,j+harmonics+1,0);//first column
                m.set(m.get(0,j+1)+ca,0,j+1);//first row
                m.set(m.get(0,j+harmonics+1)+sa,0,j+harmonics+1);//first row
                for(let k=0;k<harmonics;k++){
                    let angle2 = 2*Math.PI*(k+1)*x[i]/period;
                    let ca2 = Math.cos(angle2);
                    let sa2 = Math.sin(angle2);
                    m.set(m.get(j+1,k+1)+ca2*ca,j+1,k+1);
                    m.set(m.get(j+1,k+harmonics+1)+sa2*ca,j+1,k+harmonics+1);
                    m.set(m.get(j+harmonics+1,k+1)+ca2*sa,j+harmonics+1,k+1);
                    m.set(m.get(j+harmonics+1,k+harmonics+1)+sa2*sa,j+harmonics+1,k+harmonics+1);
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

export class OptimizerGradient{
    static run(f:LeastSquaresExpression,p0:number[],x:number[],y:number[],iterations:number,errAbsTol:number,rate:number=1.0){
        let p = p0.slice();
        let size = p0.length;
        for (let i = 0; i < iterations; i++) {
            let error = 0.0;
            let dp = vector.empty(size);
            for (let j = 0; j < x.length; j++) {
                let r = f.f(x[j],p)-y[j];
                error+=r*r;
                dp.addSelf(f.dfdp(x[j],p).scaleSelf(r));
            }
            if(error<errAbsTol){
                break;
            }
            dp.scaleSelf(-rate/x.length*2.0);
            for(let k=0;k<size;k++)
                p[k]+=dp.get(k);
        }
        let error = 0.0;
        for(let i=0;i<x.length;i++){
            error+=Math.pow(f.f(x[i],p)-y[i],2.0);
        }
        return {solution:p,error:error};
    }
    static runNormalApprox(f:LeastSquaresExpression,dfdx:LeastSquaresExpression,p0:number[],x:number[],y:number[],iterations:number,errAbsTol:number,rate:number = 1.0){
        let p = p0.slice();
        let size = p0.length;
        for (let i = 0; i < iterations; i++) {
            let error = 0.0;
            let dp = vector.empty(size);
            for (let j = 0; j < x.length; j++) {
                let r = f.f(x[j],p)-y[j];
                let derivative = dfdx.f(x[j],p);
                let scale = Math.pow(derivative,2)+1;
                error+=r*r/scale;
                let value = f.dfdp(x[j],p).subSelf(dfdx.dfdp(x[j],p).scaleSelf(derivative*r/scale));
                dp.addSelf(value.scaleSelf(r/scale));
            }
            if(error<errAbsTol){
                break;
            }
            dp.scaleSelf(-rate/x.length*2.0);
            for(let k=0;k<size;k++)
                p[k]+=dp.get(k);
        }
        let error = 0.0;
        for(let i=0;i<x.length;i++){
            let r = f.f(x[i],p)-y[i];
            /*let derivative= dfdx.f(x[i],p);
            let scale = Math.pow(derivative,2)+1;
            error+=r*r/scale;*/
            error+=r*r;
        }
        return {solution:p,error:error};
    }
}
export class OptimizerGaussNewton{
    static run(f:LeastSquaresExpression,p0:number[],x:number[],y:number[],iterations:number,alpha:number,errAbsTol:number){
        let p = p0.slice();
        let size = p0.length;
        for(let i=0;i<iterations;i++){
           let _f = vector.empty(size);
           let m = matrix.empty(size,size);
           let error = 0.0;
           for(let j=0;j<x.length;j++){
               let r = f.f(x[j],p) - y[j];
               let drdp = f.dfdp(x[j],p);
               error+=r*r;
               _f.addSelf(vector.scale(drdp,-r*alpha));
               m.addSelf(vector.outer(drdp,drdp));
           }
           if(error<errAbsTol)
                break;
           let dp = matrix.solve(m,_f);
           for(let i=0;i<size;i++)
               p[i]+=dp.get(i);
        }
        let error = 0.0;
        for(let i=0;i<x.length;i++){
            error+=Math.pow(f.f(x[i],p)-y[i],2.0);
        }
        return {solution:p,error:error};
    }
    static runNormalApprox(f:LeastSquaresExpression,dfdx:LeastSquaresExpression,p0:number[],x:number[],y:number[],iterations:number,alpha:number,errAbsTol:number){
        let p = p0.slice();
        let size = p0.length;
        for(let i=0;i<iterations;i++){
           let _f = vector.empty(size);
           let m = matrix.empty(size,size);
           let error = 0.0;
           for(let j=0;j<x.length;j++){
               let r = f.f(x[j],p) - y[j];
               let derivative= dfdx.f(x[j],p);
               let scale = Math.pow(derivative,2)+1;
               error+=r*r/scale;
               let dfdxdp = dfdx.dfdp(x[j],p);
               let dfdp = f.dfdp(x[j],p);
               let dedp = vector.sub(dfdp,vector.scale(dfdxdp,derivative*r/scale)).scaleSelf(-r/scale*alpha);
               _f.addSelf(dedp);
               let scaleFactor = 1.0/Math.sqrt(scale);
               let drdp = vector.scale(dfdp,scaleFactor).subSelf(vector.scale(dfdxdp,r*Math.pow(scaleFactor,3)*derivative));
               m.addSelf(vector.outer(drdp,drdp));
               /*for(let k=0;k<size;k++){
                   for(let l=0;l<size;l++){ 
                        let val = m.get(k,l)+drdp.get(k)*drdp.get(l)
                        m.set(val,k,l);
                   }
               }*/
           }
           if(error<errAbsTol)
                break;
           let dp = matrix.solve(m,_f);
           for(let i=0;i<size;i++)
               p[i]+=dp.get(i);
        }
        let error = 0.0;
        for(let i=0;i<x.length;i++){
            let r = f.f(x[i],p)-y[i];
            /*let derivative= dfdx.f(x[i],p);
            let scale = Math.pow(derivative,2)+1;
            error+=r*r/scale;*/
            error+=r*r;
        }
        return {solution:p,error:error};
    }
}
export class OptimizerNewton{
    static run(f:LeastSquaresExpression,p0:number[],x:number[],y:number[],iterations:number,alpha:number,fAbsTol:number){
        //compute vector df/dp
        //compute hessian matrix df/dpdp
        let p = p0.slice();
        let size = p0.length;
        for(let i=0;i<iterations;i++){
            let hessian = matrix.empty(size,size);
            let dedp = vector.empty(size);
            for(let j=0;j<x.length;j++){
                let dfdp = f.dfdp(x[j],p);
                let dfdpdp = f.dfdpdp(x[j],p);
                let r = f.f(x[j],p)-y[j];
                hessian.addSelf(vector.outer(dfdp,dfdp).addSelf(dfdpdp.scaleSelf(r)));
                dedp.addSelf(dfdp.scaleSelf(r));
                /*for(let k=0;k<size;k++){
                    for(let l=0;l<size;l++){
                        let value = hessian.get(k,l);
                        value += dfdp.get(l)*dfdp.get(k)+r*dfdpdp.get(k,l);
                        hessian.set(value, k, l);
                    }
                    let value = dedp.get(k);
                    value+=r*dfdp.get(k);
                    dedp.set(value, k);
                }*/
            }
            dedp.scaleSelf(-alpha);
            let norm = dedp.norm2();
            let dp = matrix.solve(hessian,dedp);
            for(let i=0;i<size;i++)
                p[i]+=dp.get(i);
            if(norm<fAbsTol){
                let error = 0.0;
                for(let i=0;i<x.length;i++){
                    error+=Math.pow(f.f(x[i],p)-y[i],2.0);
                }
                return {solution:p,error:error};
            }
        }
        let error = 0.0;
        for(let i=0;i<x.length;i++){
            error+=Math.pow(f.f(x[i],p)-y[i],2.0);
        }
        return {solution:p,error:error};
    }
    static runNormalApprox(f:LeastSquaresExpression,dfdx:LeastSquaresExpression,p0:number[],x:number[],y:number[],iterations:number,alpha:number,fAbsTol:number){
        let p = p0.slice();
        let size = p0.length;
        for(let i=0;i<iterations;i++){
            let hessian = matrix.empty(size,size);
            let dedp = vector.empty(size);
            for(let j=0;j<x.length;j++){
                let dfdp = f.dfdp(x[j],p);
                let dfdpdp = f.dfdpdp(x[j],p);
                let dfdxdp = dfdx.dfdp(x[j],p);
                let dfdxdpdp = dfdx.dfdpdp(x[j],p);
                let dfdxf= dfdx.f(x[j],p);
                let scale = Math.pow(dfdxf,2)+1;
                let r = f.f(x[j],p)-y[j];
                for(let l=0;l<size;l++){
                    for(let k=0;k<size;k++){
                        let value = hessian.get(l,k);
                        value += dfdp.get(l)*dfdp.get(k)/scale+
                        r/scale*dfdpdp.get(l,k)-
                        2*dfdp.get(l)*dfdxf*dfdxdp.get(k)*r/(scale*scale)-
                        2*dfdp.get(k)*dfdxf*dfdxdp.get(l)*r/(scale*scale)-
                        dfdxdp.get(l)*dfdxdp.get(k)*r*r/(scale*scale)-
                        dfdxdpdp.get(l,k)*dfdxf*r*r/(scale*scale)+
                        4*dfdxdp.get(l)*dfdxdp.get(k)*r*r/(scale*scale*scale)*dfdxf*dfdxf;
                        hessian.set(value, l, k);
                    }
                    let value = dedp.get(l);
                    value+=r*dfdp.get(l)/scale - r*r*dfdxf*dfdxdp.get(l)/(scale*scale);
                    dedp.set(value, l);
                }
            }
            dedp.scaleSelf(-alpha);
            let norm = dedp.norm2();
            let dp = matrix.solve(hessian,dedp);
            for(let i=0;i<size;i++)
                p[i]+=dp.get(i);
            if(norm<fAbsTol){
                let error = 0.0;
                for(let i=0;i<x.length;i++){
                    error+=Math.pow(f.f(x[i],p)-y[i],2.0);
                }
                return {solution:p,error:error};
            }
        }
        let error = 0.0;
        for(let i=0;i<x.length;i++){
            let r = f.f(x[i],p)-y[i];
            /*let derivative= dfdx.f(x[i],p);
            let scale = Math.pow(derivative,2)+1;
            error+=r*r/scale;*/
            error+=r*r;
        }
        return {solution:p,error:error};
    }
}
export class OptimizerPiecewiseLinear{
    static run(x:number[],y:number[],intervals:number,isPeriodic:boolean){
        let A:matrix = matrix.empty(intervals+1,intervals+1);
        let B:vector = vector.empty(intervals+1);
        let bins:number[][] = [];
        for(let i=0;i<intervals;i++)
            bins.push([]);
        let max = x[0];
        let min = x[0];
        for(let i=0;i<x.length;i++){
            max = Math.max(max,x[i]);
            min = Math.min(min,x[i])
        }
        let dx = (max - min)/intervals;
        for(let i=0;i<x.length;i++){
            let bin = Math.min(Math.floor((x[i]-min)/dx),intervals-1);
            bins[bin].push(i);
        }
        let a:number[] = [];
        for(let i=0;i<intervals+1;i++){
            let ai = min + dx * i;
            a.push(ai);
            if(i-1>=0){
                let aPrev = ai - dx;
                let bin = bins[i-1];
                for(let j=0;j<bin.length;j++){
                    let index = bin[j];
                    let _x = x[index];
                    let _y = y[index];
                    B.set(B.get(i)+_y*(_x - aPrev)/dx,i);
                    A.set(A.get(i,i-1)+(ai - _x)*(_x - aPrev)/(dx*dx),i,i-1);
                    A.set(A.get(i,i)+(_x - aPrev)*(_x - aPrev)/(dx*dx),i,i);
                }
            }
            if(i+1<=intervals){
                let aNext = ai + dx;
                let bin = bins[i];
                for(let j=0;j<bin.length;j++){
                    let index = bin[j];
                    let _x = x[index];
                    let _y = y[index];
                    B.set(B.get(i)+_y*(aNext - _x)/dx,i);
                    A.set(A.get(i,i)+(aNext - _x)*(aNext - _x)/(dx*dx),i,i);
                    A.set(A.get(i,i+1)+(_x - ai)*(aNext - _x)/(dx*dx),i,i+1);
                }
            }
        }
        if(isPeriodic){
            B.set(B.get(0) + B.get(intervals),0);
            A.set(A.get(0,0) + A.get(intervals,intervals),0,0);
            A.set(A.get(intervals,intervals-1)+A.get(0,intervals-1),0,intervals-1);
            A.set(A.get(intervals-1,0)+A.get(intervals-1,intervals),intervals-1,0);

            A.set(1,intervals,0);
            A.set(-1,intervals,intervals);
            A.set(0,0,intervals);
            for(let i = 1;i<intervals;i++)
            {
                A.set(0,intervals,i);
                A.set(0,i,intervals);
            }
            B.set(0,intervals);
        }
        let b = matrix.solve(A,B);
        let error = 0;
        for(let i=0;i<intervals;i++){
            let ai = min + dx * i;
            let aNext = ai + dx;
            let bin = bins[i];
            for(let j=0;j<bin.length;j++){
                let index = bin[j];
                let _x = x[index];
                let _y = y[index];
                error+=Math.pow((b.get(i+1) * (_x - ai) + b.get(i) * (aNext - _x))/dx - _y,2);
            }
        }
        return {a:a,b:b.data,error:error};
    }
}