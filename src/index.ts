import {
  OptimizerGradient,
  OptimizerNewton,
  OptimizerGaussNewton,
  OptimizerFourier,
  OptimizerPiecewiseLinear
} from "./math/optimizers";
import {compile} from "./compiler/compiler";
import $ from "jquery";
import 'bootstrap';
import {FunctionExpression,LeastSquaresExpression} from "./functionExpression";
import {registerClickHandlers,getCurveFittingParameters,getExpressionPlottingParameters,
  getTableGenerationParameters,getTablePlotParameters,getFourierSeriesParameters,
  setStatus,setTableValues,setProgress,setLog,disableButtons,enableButtons, getPiecewiseParameters, getGeneticCurveFittingParameters} from "./ui";
import { GeneticProgrammingFitting } from "./math/geneticProgramming/geneticProgramming";

let isRunning = false;
function start(){
  isRunning = true;
  disableButtons();
  setStatus("Busy...");
  setProgress(0);
}
function finish(){//asd
  setProgress(1);
  setStatus("Done");
  enableButtons();
  isRunning = false;
}

$("table-area").val(`0, 0.021592459,
1, 0.020293111,
2, 0.021807906,
3, 0.023803297,
4, 0.025208132,
5, 0.025414957,
6, 0.024621282,
7, 0.020973705,
8, 0.015752802,
9, 0.01116804,
10, 0.008578277,
11, 0.006581877,
12, 0.005171723,
13, 0.004545205,
14, 0.00414512,
15, 0.004343112,
16, 0.005238155,
17, 0.007251939,
18, 0.012543656,
19, 0.028067132,
20, 0.091342277,
21, 0.484081092,
22, 0.870378324,
23, 0.939513128,
24, 0.960926994,
25, 0.968623763,
26, 0.971263883,
27, 0.972285819,
28, 0.971898742,
29, 0.972691859,
30, 0.971734812,
31, 0.97234454,
32, 0.97150339,
33, 0.970857997,
34, 0.970553866,
35, 0.969671404`);

registerClickHandlers(
  fitCurve,
  fitCurveDist,
  plotExpression,
  generateTable,
  plotTable,
  fitFourier,
  fitPiecewise,
  fitGenetic);

function plotTable(){
  if(isRunning)
    return;
  start();
  setLog("");
  try{
    let params = getTablePlotParameters();
    let result = ""; 
    var data = [{ x: params.table.x, y: params.table.y, type:"scattergl", mode: 'markers', name: `plot of table values`}];
    var layout = {
      title:'Result',
      width:$("#plot").width(),
      height:$("#plot").height(),
      automargin: true
    };
    //@ts-ignore
    Plotly.newPlot('plot', data, layout,{responsive:true});
  }catch(error){
    setLog(error);
  }
  finish();
}
function plotExpression(){
  if(isRunning)
    return;
  start();
  setLog("");
  try{
    let params = getExpressionPlottingParameters();
    let compiledExp = compile(params.expression,["x"],(errors)=>{
      let result = "";
      errors.forEach((item,index:number)=>{
        result+=`${index}: ${item.print()}\n`;
      });
      setLog(result);
      finish();
    });
    if(compiledExp===null)
      return;
    let funcExpression = new FunctionExpression(compiledExp.expression,compiledExp.variableNames);
    if(compiledExp.variableNames.reduce((acc,cur)=>{     
      return (cur!="x"?1:0)+ acc;
    },0)!=0){
      setLog("You have excess variables in expression");
      finish();
      return;
    }
    let xArray = [];
    let yArray = [];
    for(let i=0;i<params.resolution;i++){
      let x = params.min+(params.max-params.min)*i/(params.resolution-1);
      let y = funcExpression.function.exec([x]);
      xArray.push(x);
      yArray.push(y);
    }
    var data = [{ x: xArray, y: yArray, type:"scattergl", mode: 'lines+markers', name: `plot of f(x)=${params.expression}`}];
    var layout = {
      title:'Result',
      width:$("#plot").width(),
      height:$("#plot").height(),
      automargin: true
    };
    //@ts-ignore
    Plotly.newPlot('plot', data, layout,{responsive:true});
  }catch(error){
    setLog(error);
  }
  finish();
}
function generateTable(){
  if(isRunning)
    return;
  start();
  try{
    let params = getTableGenerationParameters();
    let compiledExp = compile(params.expression,["x"],(errors)=>{
      let result = "";
      errors.forEach((item,index)=>{result+=`${index}: ${item.print()}\n`;}
      );
      setLog(result);
      finish();
    });
    if(compiledExp===null)
      return;
    let funcExpression = new FunctionExpression(compiledExp.expression,compiledExp.variableNames);
    if(compiledExp.variableNames.reduce((acc,cur)=>{     
      return (cur!="x"?1:0) + acc;
    },0)!=0){
      setLog("You have excess variables in expression");
      finish();
      return;
    }
    let values = "";
    let min = params.min;
    let max = params.max;
    let points = params.resolution;
    let noise = params.noise;
    for(let i=0;i<points;i++){
      if(i!=0)
        values+=',\n';
      let x = min+(max-min)*i/(points-1);
      let y = funcExpression.function.exec([x]) + (Math.random()*2-1)*noise;
      values += `${x.toFixed(4)},${y.toFixed(4)}`;
    }
    setTableValues(values);
  }catch(error){
    setLog(error);
  }
  finish();
}
function solutionToTrace(expression:LeastSquaresExpression,s:{solution:number[],error:number},min:number,max:number,points:number,name:string){
  var x = [];
  var y = [];
  for(let i=0;i<points;i++){
    let _x = min+(max-min)*i/(points-1);
    let _y = expression.f(_x,s.solution);
    x.push(_x);
    y.push(_y);
  }
  return {x:x,y:y,mode:'lines+markers',name:name};
}
function fitCurveDist(){
  if(isRunning)
    return;
  start();
  setLog("");
  try{
    let params = getCurveFittingParameters();
    let compiledExp = compile(params.curve,["x"],(errors)=>{
      let result = "";
      errors.forEach((item,index)=>{result+=`${index}: ${item.print()}\n`;}
      );
      setLog(result);
      finish();
    });
    if(compiledExp===null)
      return;
    let p0:number[]=[];
    compiledExp.variableNames.forEach((item)=>{     
        if(item!="x"){
          if(compiledExp.parameters[item]!==undefined)
            p0.push(compiledExp.parameters[item]);
          else
            p0.push(0.0);
        }
      });
    let exp = new LeastSquaresExpression(compiledExp.expression,compiledExp.variableNames);
    let dfdx = new LeastSquaresExpression(compiledExp.expression.differentiate("x",0.001).simplify(),compiledExp.variableNames);
    let result = ""; 
    var traceXY = {
      x: params.table.x,
      y: params.table.y,
      mode: 'markers',
      name: 'initial points'
    };
    var data = [ traceXY ];
    //gradient descent
    if(params.gradientDescent.use){
      let solution =  OptimizerGradient.runNormalApprox(
        exp,
        dfdx,
        p0,
        params.table.x,
        params.table.y,
        params.gradientDescent.iterations,
        params.gradientDescent.errAbsTol,
        params.gradientDescent.rate);
      result +="Gradient Descent:\n"+ solutionToString(solution,compiledExp.variableNames);
      data.push(solutionToTrace(exp,solution,params.table.min,params.table.max,params.resolution,"Gradient descent"));
    }
    setProgress(0.33);
    //newton's method
    if(params.newton.use){
      let solution = OptimizerNewton.runNormalApprox(
        exp,
        dfdx,
        p0,
        params.table.x,
        params.table.y,
        params.newton.iterations,
        params.newton.alpha,
        params.newton.errAbsTol);
      result +="Newton method:\n" + solutionToString(solution,compiledExp.variableNames);
      data.push(solutionToTrace(exp,solution,params.table.min,params.table.max,params.resolution,"Newton's method"));
    }
    setProgress(0.67);
    //gauss-newton method
    if(params.gaussNewton.use){
      let solution = OptimizerGaussNewton.runNormalApprox(
        exp,
        dfdx,
        p0,
        params.table.x,
        params.table.y,
        params.gaussNewton.iterations,
        params.gaussNewton.alpha,
        params.gaussNewton.errAbsTol);
      result +="Gauss-newton method:\n" + solutionToString(solution,compiledExp.variableNames);
      data.push(solutionToTrace(exp,solution,params.table.min,params.table.max,params.resolution,"Gauss-newthon"));
    }
    setProgress(1);
  
    setLog(result);
  
    var layout = {
      title:'Result',
      width:$("#plot").width(),
      height:$("#plot").height(),
      automargin: true
    };
    //@ts-ignore
    Plotly.newPlot('plot', data, layout,{responsive:true});
  }catch(error){
    setLog(error);
  }
  finish();
}
function fitFourier(){
  if(isRunning)
    return;
  start();
  setLog("");
  try{
    let params = getFourierSeriesParameters();
    let solution = OptimizerFourier.run(params.table.x,params.table.y,params.harmonics,params.table.max-params.table.min);//{a:[],b:[],a0:const}
    
    let result = "";
    result+=`fundamental frequency: ${1/(params.table.max-params.table.min)} Hz\n`;
    result+=`a0 = ${solution.a0}\n`;
    for(let i=0;i<params.harmonics;i++){
      result+=`a${i+1} = ${solution.a[i]}\n`;
      result+=`b${i+1} = ${solution.b[i]}\n`;
    }
    setLog(result);
    let points = params.resolution;
    let xArray = [];
    let yArray = [];
    for(let i=0;i<points;i++){
      let _x = params.table.min+(params.table.max-params.table.min)*i/(points-1);
      let _y = OptimizerFourier.execSeries(solution.a,solution.b,solution.a0,params.table.max-params.table.min,_x);
      xArray.push(_x);
      yArray.push(_y);
    }
    let amp = [solution.a0];
    let phase = [0];
    let harmonicsArray = [0];
    let aArray=[solution.a0];
    let bArray = [0];
    for(let i=0;i<params.harmonics;i++){
      let a = solution.a[i];
      let b = solution.b[i];
      amp.push(Math.sqrt(a*a+b*b));
      phase.push(Math.atan2(b,a));
      aArray.push(a);
      bArray.push(b);
      harmonicsArray.push(i+1);
    }
    var data = [
      { x: params.table.x, y: params.table.y, type:"scattergl", legendgroup:'values', mode: 'markers', name: 'plot of table values'},
      { x: xArray, y: yArray, type:"scattergl", legendgroup:'values', mode:'lines', name:'forier'},
      { x: harmonicsArray, y: amp, type:"scattergl", mode:'markers+lines',name:'amplitude',visible:"legendonly"},
      { x: harmonicsArray, y: phase, type:"scattergl", mode:'markers+lines',name:'phase',visible:"legendonly"},
      { x: harmonicsArray, y: aArray, type:"scattergl", mode:'markers+lines',name:'a',visible:"legendonly"},
      { x: harmonicsArray, y: bArray, type:"scattergl", mode:'markers+lines',name:'b',visible:"legendonly"}
    ];
    var layout = {
      title:'Result',
      width:$("#plot").width(),
      height:$("#plot").height(),
      automargin: true
    };
    //@ts-ignore
    Plotly.newPlot('plot', data, layout,{responsive:true});
  }catch(error){
    setLog(error);
  }
  finish();
}
function fitPiecewise(){
  if(isRunning)
    return;
  start();
  setLog("");
  try{
    let params = getPiecewiseParameters();
    let solution = OptimizerPiecewiseLinear.run(params.table.x, params.table.y, params.intervals, params.isPeriodic);//{a:[],b:[],a0:const}
    
    let result = `Error: ${solution.error} \n`;
    for(let i=0;i<solution.a.length;i++){
      result+=`x${i} = ${solution.a[i]}, y${i} = ${solution.b[i]}\n`;
    }
    setLog(result);
    let xArray = [];
    let yArray = [];
    for(let i=0;i<solution.a.length;i++){
      let _x = solution.a[i];
      let _y = solution.b[i];
      xArray.push(_x);
      yArray.push(_y);
    }
    var data = [
      { x: params.table.x, y: params.table.y, type:"scattergl", mode: 'markers', name: 'plot of table values'},
      { x: xArray, y: yArray, type:"scattergl",  mode:'lines', name:'linear'},
    ];
    var layout = {
      title:'Result',
      width:$("#plot").width(),
      height:$("#plot").height(),
      automargin: true
    };
    //@ts-ignore
    Plotly.newPlot('plot', data, layout,{responsive:true});
  }catch(error){
    setLog(error);
  }
  finish();
}

function solutionToString(s:{solution:number[],error:number},parameters:string[]){
  let result = "";
  s.solution.forEach((item,index)=>{
    result+=`${parameters[index+1]} = ${item}\n`;
  });
  result+="Error value: "+s.error+"\n";
  return result;
}
function fitCurve(){
  if(isRunning)
    return;
  start();
  setLog("");
  try{
    let params = getCurveFittingParameters();
    let compiledExp = compile(params.curve,["x"],(errors)=>{
      let result = "";
      errors.forEach((item,index)=>{
        result+=`${index}: ${item.print()}\n`;}
      );
      setLog(result);
      finish();
    });
    if(compiledExp===null)
      return;
    let p0:number[]=[];
    compiledExp.variableNames.forEach((item)=>{     
        if(item!="x"){
          if(compiledExp.parameters[item]!==undefined)
            p0.push(compiledExp.parameters[item]);
          else
            p0.push(0.0);
        }
      });
    let exp = new LeastSquaresExpression(compiledExp.expression,compiledExp.variableNames);
    let result = ""; 
    var traceXY = {
      x: params.table.x,
      y: params.table.y,
      mode: 'markers',
      name: 'initial points'
    };
    var data = [ traceXY ];
    //gradient descent
    if(params.gradientDescent.use){
      let solution =  OptimizerGradient.run(
        exp,
        p0,
        params.table.x,
        params.table.y,
        params.gradientDescent.iterations,
        params.gradientDescent.errAbsTol,
        params.gradientDescent.rate);
      result +="Gradient Descent:\n"+ solutionToString(solution,compiledExp.variableNames);
      data.push(solutionToTrace(exp,solution,params.table.min,params.table.max,params.resolution,"Gradient descent"));
    }
    setProgress(0.33);
    //newton's method
    if(params.newton.use){
      let solution = OptimizerNewton.run(
        exp,
        p0,
        params.table.x,
        params.table.y,
        params.newton.iterations,
        params.newton.alpha,
        params.newton.errAbsTol);
      result +="Newton method:\n" + solutionToString(solution,compiledExp.variableNames);
      data.push(solutionToTrace(exp,solution,params.table.min,params.table.max,params.resolution,"Newton's method"));
    }
    setProgress(0.67);
    //gauss-newton method
    if(params.gaussNewton.use){
      let solution = OptimizerGaussNewton.run(
        exp,
        p0,
        params.table.x,
        params.table.y,
        params.gaussNewton.iterations,
        params.gaussNewton.alpha,
        params.gaussNewton.errAbsTol);
      result +="Gauss-newton method:\n" + solutionToString(solution,compiledExp.variableNames);
      data.push(solutionToTrace(exp,solution,params.table.min,params.table.max,params.resolution,"Gauss-newthon"));
    }
    setProgress(1.);
  
    setLog(result);
  
    var layout = {
      title:'Result',
      width:$("#plot").width(),
      height:$("#plot").height(),
      automargin: true
    };
    //@ts-ignore
    Plotly.newPlot('plot', data, layout,{responsive:true});
  }catch(error){
    setLog(error);
  }
  finish();
}
function fitGenetic(){
  if(isRunning)
    return;
  start();
  setLog("");
  let params = getGeneticCurveFittingParameters();
  let includeFunctions = params.includeFunctions.split(',');
  let gpf = new GeneticProgrammingFitting();
  let {error,formula} = gpf.solve(params.table.x,params.table.y,includeFunctions,params.iterations,params.depth,params.mutation);
  var traceXY = {
    x: params.table.x,
    y: params.table.y,
    mode: 'markers',
    name: 'initial points'
  };
  var traceGenetic = {
    x:new Array<number>(),
    y:new Array<number>(),
    mode:'markers+lines',
    name: 'genetic'
  };
  let min = params.table.min;
  let max = params.table.max;
  for(let i=0;i<params.resolution;i++){
    let _x = min+(max-min)*i/(params.resolution-1);
    let _y = formula.eval([_x]);
    traceGenetic.x.push(_x);
    traceGenetic.y.push(_y);
  }
  var data = [ traceXY,traceGenetic ];
  var layout = {
    title:'Result',
    width:$("#plot").width(),
    height:$("#plot").height(),
    automargin: true,
  };
  //@ts-ignore
  Plotly.newPlot('plot', data, layout,{responsive:true});
  setLog(`Genetic:\n\tFormula:${formula.print()},\n\tError:${error}`);
  setProgress(100);
  finish();
}
(function(){
  var data:number[] = [];
    var layout = {
      title:'Result',
      width:$("#plot").width(),
      height:$("#plot").height(),
      automargin: true
    };
  //@ts-ignore
  Plotly.newPlot('plot',data,layout,{responsive:true});
})();
window.onresize = function(){
  //@ts-ignore
  Plotly.relayout('plot',{
    width:$("#plot").width(),
    height:$("#plot").height(),
    automargin: true
  })
}