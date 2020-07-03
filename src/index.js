import {
  OptimizerGradient,
  OptimizerNewton,
  OptimizerGaussNewton,
  OptimizerFourier
} from "./optimizers.js";
import {compile} from "./compiler/compiler.js";
import $ from "jquery";
import 'bootstrap';
import {FunctionExpression,LeastSquaresExpression} from "./functionExpression.js";
import {registerClickHandlers,getCurveFittingParameters,getExpressionPlottingParameters,
  getTableGenerationParameters,getTablePlotParameters,getFourierSeriesParameters,
  setStatus,setTableValues,setProgress,setLog,disableButtons,enableButtons} from "./ui.js";

let isRunning = false;
function start()
{
  isRunning = true;
  disableButtons();
  setStatus("Busy...");
  setProgress(0);
}
function finish()
{
  setProgress(1);
  setStatus("Done");
  enableButtons();
  isRunning = false;
}

registerClickHandlers(
  fitCurve,
  fitCurveDist,
  plotExpression,
  generateTable,
  plotTable,
  fitFourier);

function plotTable()
{
  if(isRunning)
    return;
  start();
  setLog("");
  try{
    let params = getTablePlotParameters();
    let result = ""; 
    var data = [{ x: params.table.x, y: params.table.y, mode: 'markers', name: `plot of table values`}];
    var layout = {
      title:'Result',
      width:0.95*$("#plot").width(),
      height:0.95*$("#plot").height()
    };
    Plotly.newPlot('plot', data, layout,{responsive:true});
  }catch(error)
  {
    setLog(error);
  }
  finish();
}
function plotExpression()
{
  if(isRunning)
    return;
  start();
  setLog("");
  try{
    let params = getExpressionPlottingParameters();
    let compiledExp = compile(params.expression,["x"],(errors)=>{
      let result = "";
      errors.forEach((item,index)=>
        {result+=`${index}: ${item.print()}\n`;}
      );
      setLog(result);
      finish();
    });
    if(compiledExp===null)
      return;
    let funcExpression = new FunctionExpression(compiledExp.expression,compiledExp.variableNames);
    if(compiledExp.variableNames.reduce((acc,cur)=>
    {     
      return (cur!="x") + acc;
    },0)!=0)
    {
      setLog("You have excess variables in expression");
      finish();
      return;
    }
    let xArray = [];
    let yArray = [];
    for(let i=0;i<params.resolution;i++)
    {
      let x = params.min+(params.max-params.min)*i/(params.resolution-1);
      let y = funcExpression.function.exec([x]);
      xArray.push(x);
      yArray.push(y);
    }
    var data = [{ x: xArray, y: yArray, mode: 'lines+markers', name: `plot of f(x)=${params.expression}`}];
    var layout = {
      title:'Result',
      width:0.95*$("#plot").width(),
      height:0.95*$("#plot").height()
    };
    Plotly.newPlot('plot', data, layout,{responsive:true});
  }catch(error)
  {
    setLog(error);
  }
  finish();
}
function generateTable()
{
  if(isRunning)
    return;
  start();
  try{
    let params = getTableGenerationParameters();
    let compiledExp = compile(params.expression,["x"],(errors)=>{
      let result = "";
      errors.forEach((item,index)=>
        {result+=`${index}: ${item.print()}\n`;}
      );
      setLog(result);
      finish();
    });
    if(compiledExp===null)
      return;
    let funcExpression = new FunctionExpression(compiledExp.expression,compiledExp.variableNames);
    if(compiledExp.variableNames.reduce((acc,cur)=>
    {     
      return (cur!="x") + acc;
    },0)!=0)
    {
      setLog("You have excess variables in expression");
      finish();
      return;
    }
    let values = "";
    let min = params.min;
    let max = params.max;
    let points = params.resolution;
    let noise = params.noise;
    for(let i=0;i<points;i++)
    {
      if(i!=0)
        values+=',\n';
      let x = min+(max-min)*i/(points-1);
      let y = funcExpression.function.exec([x]) + (Math.random()*2-1)*noise;
      values += `${x.toFixed(4)},${y.toFixed(4)}`;
    }
    setTableValues(values);
  }catch(error)
  {
    setLog(error);
  }
  finish();
}
function solutionToTrace(expression,s,min,max,points,name)
{
  var x = [];
  var y = [];
  for(let i=0;i<points;i++)
  {
    let _x = min+(max-min)*i/(points-1);
    let _y = expression.f(_x,s.solution);
    x.push(_x);
    y.push(_y);
  }
  return {x:x,y:y,mode:'lines+markers',name:name};
}
function fitCurveDist()
{
  if(isRunning)
    return;
  start();
  setLog("");
  try{
    let params = getCurveFittingParameters();
    let compiledExp = compile(params.curve,["x"],(errors)=>{
      let result = "";
      errors.forEach((item,index)=>
        {result+=`${index}: ${item.print()}\n`;}
      );
      setLog(result);
      finish();
    });
    if(compiledExp===null)
      return;
    let p0=[];
    compiledExp.variableNames.forEach((item)=>
      {     
        if(item!="x")
        {
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
    if(params.gradientDescent.use)
    {
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
      width:0.95*$("#plot").width(),
      height:0.95*$("#plot").height()
    };
  
    Plotly.newPlot('plot', data, layout,{responsive:true});
  }catch(error)
  {
    setLog(error);
  }
  finish();
}
function fitFourier()
{
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
    for(let i=0;i<params.harmonics;i++)
    {
      result+=`a${i+1} = ${solution.a[i]}\n`;
      result+=`b${i+1} = ${solution.b[i]}\n`;
    }
    setLog(result);
    let points = params.resolution;
    let xArray = [];
    let yArray = [];
    for(let i=0;i<points;i++)
    {
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
    for(let i=0;i<params.harmonics;i++)
    {
      let a = solution.a[i];
      let b = solution.b[i];
      amp.push(Math.sqrt(a*a+b*b));
      phase.push(Math.atan2(b,a));
      aArray.push(a);
      bArray.push(b);
      harmonicsArray.push(i+1);
    }
    var data = [
      { x: params.table.x, y: params.table.y, legendgroup:'values', mode: 'markers', name: 'plot of table values'},
      { x: xArray, y: yArray, legendgroup:'values', mode:'lines', name:'forier'},
      { x: harmonicsArray, y: amp, mode:'markers+lines',name:'amplitude',visible:"legendonly"},
      { x: harmonicsArray, y: phase, mode:'markers+lines',name:'phase',visible:"legendonly"},
      { x: harmonicsArray, y: aArray, mode:'markers+lines',name:'a',visible:"legendonly"},
      { x: harmonicsArray, y: bArray, mode:'markers+lines',name:'b',visible:"legendonly"}

    ];
    var layout = {
      title:'Result',
      width:0.95*$("#plot").width(),
      height:0.95*$("#plot").height()
    };
    Plotly.newPlot('plot', data, layout,{responsive:true});
  }catch(error)
  {
    setLog(error);
  }
  finish();
}

function solutionToString(s,parameters)
{
  let result = "";
  s.solution.forEach((item,index)=>{
    result+=`${parameters[index+1]} = ${item}\n`;
  });
  result+="Error value: "+s.error+"\n";
  return result;
}
function fitCurve()
{
  if(isRunning)
    return;
  start();
  setLog("");
  try{
    let params = getCurveFittingParameters();
    let compiledExp = compile(params.curve,["x"],(errors)=>{
      let result = "";
      errors.forEach((item,index)=>
        {result+=`${index}: ${item.print()}\n`;}
      );
      setLog(result);
      finish();
    });
    if(compiledExp===null)
      return;
    let p0=[];
    compiledExp.variableNames.forEach((item)=>
      {     
        if(item!="x")
        {
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
    if(params.gradientDescent.use)
    {
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
      width:0.95*$("#plot").width(),
      height:0.95*$("#plot").height()
    };
  
    Plotly.newPlot('plot', data, layout,{responsive:true});
  }catch(error)
  {
    setLog(error);
  }
  finish();
}

(function(){
  var data = [];
    var layout = {
      title:'Result',
      width:0.95*$("#plot").width(),
      height:0.95*$("#plot").height()
    };
  Plotly.newPlot('plot',data,layout,{responsive:true});
})();
window.onresize = function()
{
  Plotly.relayout('plot',{
    width:0.95*$("#plot").width(),
    height:0.95*$("#plot").height()
  })
}