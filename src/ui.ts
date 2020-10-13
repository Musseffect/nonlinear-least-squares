//tabs init
$('*[data-role="tab"]').click(
    function(e){
        let target = $(e.target);
        let parentId = target.data("parent");
        let parent=$('#'+parentId);
        let tabId = target.data("tab");
        $('[data-role="tab-item"][data-parent="'+parentId+'"').removeClass("show");
        $('[data-role="tab"][data-parent="'+parentId+'"').removeClass("active");
        target.addClass("active");
        $('#'+tabId).addClass("show");
    }
);


export function registerClickHandlers(curveFit:()=>void,curveFitDist:()=>void,plotExp:()=>void,
    genExpTable:()=>void,plotTable:()=>void,fourierFit:()=>void,piecewiseFit:()=>void,geneticFit:()=>void){
    $("#curve-fit").click(curveFit);
    $("#plot-exp").click(plotExp);
    $("#generate-values").click(genExpTable);
    $("#plot-table").click(plotTable);
    $("#fourier-fit").click(fourierFit);
    $("#curve-fit-dist").click(curveFitDist);
    $('#piecewise-fit').click(piecewiseFit);
    $('#genetic-fit').click(geneticFit);
}

function getGradientDescentParameters(){
    return {
        use:$("#gradient-descent-use").prop("checked"),
        iterations:parseInt($("#gradient-descent-iterations").val() as string),
        rate:parseFloat($("#gradient-descent-rate").val() as string),
        errAbsTol:parseFloat($("#gradient-descent-err-abs-tol").val() as string)
    }
}
function getNewtonParameters(){
    return {
        use:$("#newton-use").prop("checked"),
        iterations:parseInt($("#newton-iterations").val() as string),
        alpha:parseFloat($("#newton-alpha").val() as string),
        errAbsTol:parseFloat($("#newton-err-abs-tol").val() as string)
    }
}
function getGaussNewtonParameters(){
    return {
        use:$("#gauss-newton-use").prop("checked"),
        iterations:parseInt($("#gauss-newton-iterations").val() as string),
        alpha:parseFloat($("#gauss-newton-alpha").val() as string),
        errAbsTol:parseFloat($("#gauss-newton-err-abs-tol").val() as string)
    }
}
export function getCurveFittingParameters(){
    return {
        gradientDescent:getGradientDescentParameters(),
        gaussNewton:getGaussNewtonParameters(),
        newton:getNewtonParameters(),
        curve:$("#curve-function-area").val() as string,
        resolution:$("#curve-plot-resolution").val() as number,
        table:getTableValues()
    }
}
export function getGeneticCurveFittingParameters(){
    return {
        resolution:$("#genetic-plot-resolution").val() as number,
        iterations:$("#genetic-iterations").val() as number,
        depth:parseInt($('#genetic-depth').val() as string),
        mutation:$("#genetic-mutation").prop("checked") as boolean,
        table:getTableValues()
    };
}
export function getExpressionPlottingParameters(){
    return {
        expression:$("#expression").val() as string,
        resolution:parseInt($("#resolution").val() as string),
        min:parseFloat($("#min").val() as string),
        max:parseFloat($("#max").val() as string)
    }
}
export function getTableGenerationParameters(){
    return {
        expression:$("#expression").val() as string,
        resolution:parseInt($("#resolution").val() as string),
        min:parseFloat($("#min").val() as string),
        max:parseFloat($("#max").val() as string),
        noise:parseFloat($("#noise-amp").val() as string)
    };
}
export function getTablePlotParameters(){
    return {
        table:getTableValues()
    }
}
export function getFourierSeriesParameters(){
    return {
        harmonics:parseInt($("#fourier-harmonics").val() as string),
        resolution:parseInt($("#fourier-plot-resolution").val() as string),
        table:getTableValues()
    }
}
export function getPiecewiseParameters(){
    return {
        intervals:parseInt($("#piecewise-intervals").val() as string),
        table:getTableValues(),
        isPeriodic:$("#piecewise-periodic").prop("checked") as boolean
    }
}
export function setTableValues(values:string){
    $("#table-area").val(values);
}
export function setStatus(status:string){
    $("#status").text(status);
}
export function setProgress(value:number){
    $("#progress-bar").val(value);
}
export function setLog(text:string){
    $("#log").val(text);
}
export function disableButtons(){
    $("#curve-fit").attr("disabled","disabled");
    $("#plot-exp").attr("disabled","disabled");
    $("#generate-values").attr("disabled","disabled");
    $("#plot-table").attr("disabled","disabled");
    $("#fourier-fit").attr("disabled","disabled");
}
export function enableButtons(){
    $("#curve-fit").attr("disabled",null);
    $("#plot-exp").attr("disabled",null);
    $("#generate-values").attr("disabled",null);
    $("#plot-table").attr("disabled",null);
    $("#fourier-fit").attr("disabled",null);
}
function getTableValues(){
  let tableText = $("#table-area").val() as string;
  let min = 10e8;
  let max = -10e8;
  let x:number[]=[];
  let y:number[]=[];
  tableText.split(",").forEach((item,index)=>{
    if(index%2==0)
      x.push(parseFloat(item));
    else
      y.push(parseFloat(item));
  });
  x.forEach((item)=>{min = Math.min(min,item);max = Math.max(max,item);});
  return {min:min,max:max,x:x,y:y};
}