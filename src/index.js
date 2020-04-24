import {
  OptimizerGradient,
  OptimizerNewton,
  OptimizerSwarm,
  OptimizerGaussNewton} from "./optimizers.js";
import {compile} from "./compiler/compiler.js";
import $ from "jquery";
import 'bootstrap';
import {FunctionExpression,LeastSquaresExpression} from "./functionExpression.js";

$("#runPlot").click(plot);
$("#runFit").click(fit);
$("#runGenerate").click(generate);
//plotExpression("x*x*x*sin(x)+2*2.0",-2,2,20);
function plotExpression(text,min,max,points)
{
    let compiledExp = compile(text,["x"],(errors)=>{
      let result = "";
      errors.forEach((item,index)=>
        {result+=`${index}: ${item.print()}\n`;}
      );
      $("#resultArea").val(result);
      //console.log(errors);
    });
    if(compiledExp===null)
      return;
    let funcExpression = new FunctionExpression(compiledExp.expression,compiledExp.variableNames);
    if(compiledExp.variableNames.reduce((acc,cur)=>
    {     
      return (cur!="x") + acc;
    },0)!=0)
    {
      $("#resultArea").val("You have additional variables in expression");
      return;
    }
    let xArray = [];
    let yArray = [];
    //console.log(funcExpression.function.print(funcExpression.variableNames));
    for(let i=0;i<points;i++)
    {
      let x = min+(max-min)*i/(points-1);
      let y = funcExpression.function.exec([x]);
      xArray.push(x);
      yArray.push(y);
    }
    var data = [{ x: xArray, y: yArray, mode: 'lines+markers', name: `plot of f(x)=${text}`}];
    var layout = {title:'Result'};
    Plotly.newPlot('plotContainer', data, layout,{responsive:true});
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
function runN(exp,p0,x,y)
{
  let iterations = parseInt($("#newtonIterations").val());
  let alpha=parseFloat($("#newtonAlpha").val());
  let fAbsTol = parseFloat($("#newtonFAbsTol").val());
  return OptimizerNewton.run(exp,p0,x,y,iterations,alpha,fAbsTol);
}
function runGD(exp,p0,x,y)
{
  let iterations = parseInt($("#gradDescIterations").val());
  let errAbsTol = parseFloat($("#gradErrAbsTol").val());
  let rate = parseFloat($("#gradDescRate").val());
  return OptimizerGradient.run(exp,p0,x,y,iterations,errAbsTol,rate);
}
function runGN(exp,p0,x,y)
{
  let iterations = parseInt($("#gaussNewtonIterations").val());
  let errAbsTol = parseFloat($("#gaussNewtonErrAbsTol").val());
  return OptimizerGaussNewton.run(exp,p0,x,y,iterations,errAbsTol);
}
function runPS(exp,p0,x,y)
{
  let iterations = parseInt($("#swarmIterations").val());
  let particleCount = parseInt($("#swarParticles").val());
  let w = parseFloat($("#swarmW").val());
  let phi_p = parseFloat($("#swarmPhi_p").val());
  let phi_g = parseFloat($("#swarmPhi_g").val());
  let max = parseFloat($("#swarmMax").val());
  let min = parseFloat($("#swarmMin").val());
  return OptimizerSwarm.run(exp,p0.length,x,y,iterations,particleCount,w,phi_p,phi_g,max,min);
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
function fit()
{
  $("#runFit").prop("disabled");
  let text = $("#fitFunction").val();
  let compiledExp = compile(text,["x"],(errors)=>{
    let result = "";
    errors.forEach((item,index)=>
      {result+=`${index}: ${item.print()}\n`;}
    );
    $("#resultArea").val(result);
    $("#runFit").removeProp("disabled");
    //console.log(errors);
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
  let tableText = $("#valueTable").val();
  let min = 10e8;
  let max = -10e8;
  let x=[];
  let y=[];
  tableText.split(",").forEach((item,index)=>
  {
    if(index%2==0)
      x.push(parseFloat(item));
    else
      y.push(parseFloat(item));
  });
  x.forEach((item)=>{min = Math.min(min,item);max = Math.max(max,item);});
  let exp = new LeastSquaresExpression(compiledExp.expression,compiledExp.variableNames);

  let result = ""; 
  var traceXY = {
    x: x,
    y: y,
    mode: 'markers',
    name: 'initial points'
  };
  var data = [ traceXY ];
  let points = parseInt($("#functionValues").val());
  //gradient descent
  let useGD = $("#gradientDescent").prop("checked");
  if(useGD)
  {
    let solutionGD = runGD(exp,p0,x,y);
    result +="Gradient Descent:\n"+ solutionToString(solutionGD,compiledExp.variableNames);
    data.push(solutionToTrace(exp,solutionGD,min,max,points,"Gradient descent"));
  }
  //let s = OptimizerGradient.run(leastSquaresExpression,p0,x,y,100,0.9);
  //newton's method
  let useN = $("#newton").prop("checked");
  if(useN){
    let solutionN = runN(exp,p0,x,y);
    result +="Newton method:\n" + solutionToString(solutionN,compiledExp.variableNames);
    data.push(solutionToTrace(exp,solutionN,min,max,points,"Newton's method"));
  }
  //gauss-newton method
  let useGN = $("#gaussNewton").prop("checked");
  if(useGN){
    let solutionGN = runGN(exp,p0,x,y);
    result +="Gauss-newton method:\n" + solutionToString(solutionGN,compiledExp.variableNames);
    data.push(solutionToTrace(exp,solutionGN,min,max,points,"Gauss-newthon"));
  }
  //particle swarm method
  let usePS = $("#particleSwarm").prop("checked");
  if(usePS){
    let solutionPS = runPS(exp,p0,x,y);
    result +="Particle swarm method:\n" + solutionToString(solutionPS,compiledExp.variableNames);
    data.push(solutionToTrace(exp,solutionPS,min,max,points,"Particle swarm"));
  }

  $("#resultArea").val(result);

var layout = {
  title:'Result'
};

Plotly.newPlot('plotContainer', data, layout,{responsive:true});
$("#runFit").removeProp("disabled");
}

function plot()
{
  let _function = $("#originalFunction").val();
  let min = parseFloat($("#minRange").val());
  let max = parseFloat($("#maxRange").val());
  let points = parseInt($("#functionValues").val());

  plotExpression(_function,min,max,points);
}
function generate()
{
  let funcText = $("#originalFunction").val();
  let compiledExp = compile(funcText,["x"],(errors)=>{
    let result = "";
    errors.forEach((item,index)=>
      {result+=`${index}: ${item.print()}\n`;}
    );
    $("#resultArea").val(result);
    //console.log(errors);
  });
  if(compiledExp===null)
    return;
  let funcExpression = new FunctionExpression(compiledExp.expression,compiledExp.variableNames);
  if(compiledExp.variableNames.reduce((acc,cur)=>
  {     
    return (cur!="x") + acc;
  },0)!=0)
  {
    $("#resultArea").val("You have additional variables in expression");
    return;
  }
  let values = "";
  let min = parseFloat($("#minRange").val());
  let max = parseFloat($("#maxRange").val());
  let points = parseInt($("#functionValues").val());
  let noise = parseFloat($("#noise").val());
  for(let i=0;i<points;i++)
  {
    if(i!=0)
      values+=',\n';
    let x = min+(max-min)*i/(points-1);
    let y = funcExpression.function.exec([x]) + Math.random()*noise;
    values += `${x.toFixed(4)},${y.toFixed(4)}`;
  }
  $("#valueTable").val(values);
}