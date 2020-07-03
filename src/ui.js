//tabs init
$('*[data-role="tab"]').click(
    function(e)
    {
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


export function registerClickHandlers(curveFit,curveFitDist,plotExp,
    genExpTable,plotTable,fourierFit)
{
    $("#curve-fit").click(curveFit);
    $("#plot-exp").click(plotExp);
    $("#generate-values").click(genExpTable);
    $("#plot-table").click(plotTable);
    $("#fourier-fit").click(fourierFit);
    $("#curve-fit-dist").click(curveFitDist)
}

function getGradientDescentParameters()
{
    return {
        use:$("#gradient-descent-use").prop("checked"),
        iterations:parseInt($("#gradient-descent-iterations").val()),
        rate:parseFloat($("#gradient-descent-rate").val()),
        errAbsTol:parseFloat($("#gradient-descent-err-abs-tol").val())
    }
}
function getNewtonParameters()
{
    return {
        use:$("#newton-use").prop("checked"),
        iterations:parseInt($("#newton-iterations").val()),
        alpha:parseFloat($("#newton-alpha").val()),
        errAbsTol:parseFloat($("#newton-err-abs-tol").val())
    }
}
function getGaussNewtonParameters()
{
    return {
        use:$("#gauss-newton-use").prop("checked"),
        iterations:parseInt($("#gauss-newton-iterations").val()),
        alpha:parseFloat($("#gauss-newton-alpha").val()),
        errAbsTol:parseFloat($("#gauss-newton-err-abs-tol").val())
    }
}
function getParticleSwarmParameters()
{
    return {
        use:$("#particle-swarm-use").prop("checked"),
        iterations:parseInt($("#gradient-descent-iterations").val()),
        particles:parseInt($("#particle-swarm-particles").val()),
        w:parseFloat($("#particle-swarm-w").val()),
        p:parseFloat($("#particle-swarm-phi-p").val()),
        g:parseFloat($("#particle-swarm-phi-g").val()),
        max:parseFloat($("#particle-swarm-max").val()),
        min:parseFloat($("#particle-swarm-min").val())
    }
}
export function getCurveFittingParameters()
{
    return {
        gradientDescent:getGradientDescentParameters(),
        gaussNewton:getGaussNewtonParameters(),
        newton:getNewtonParameters(),
        particleSwarm:getParticleSwarmParameters(),
        curve:$("#curve-function-area").val(),
        resolution:$("#curve-plot-resolution").val(),
        table:getTableValues()
    }
}
export function getExpressionPlottingParameters()
{
    return {
        expression:$("#expression").val(),
        resolution:parseInt($("#resolution").val()),
        min:parseFloat($("#min").val()),
        max:parseFloat($("#max").val())
    }
}
export function getTableGenerationParameters()
{
    return {
        expression:$("#expression").val(),
        resolution:parseInt($("#resolution").val()),
        min:parseFloat($("#min").val()),
        max:parseFloat($("#max").val()),
        noise:parseFloat($("#noise-amp").val())
    };
}
export function getTablePlotParameters()
{
    return {
        table:getTableValues()
    }
}
export function getFourierSeriesParameters()
{
    return {
        harmonics:parseInt($("#fourier-harmonics").val()),
        resolution:parseInt($("#fourier-plot-resolution").val()),
        table:getTableValues()
    }
}
export function setTableValues(values)
{
    $("#table-area").val(values);
}
export function setStatus(status)
{
    $("#status").text(status);
}
export function setProgress(value)
{
    $("#progress-bar").val(value);
}
export function setLog(text)
{
    $("#log").val(text);
}
export function disableButtons()
{
    $("#curve-fit").attr("disabled",true);
    $("#plot-exp").attr("disabled",true);
    $("#generate-values").attr("disabled",true);
    $("#plot-table").attr("disabled",true);
    $("#fourier-fit").attr("disabled",true);
}
export function enableButtons()
{
    $("#curve-fit").attr("disabled",null);
    $("#plot-exp").attr("disabled",null);
    $("#generate-values").attr("disabled",null);
    $("#plot-table").attr("disabled",null);
    $("#fourier-fit").attr("disabled",null);
}
function getTableValues()
{
  let tableText = $("#table-area").val();
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
  return {min:min,max:max,x:x,y:y};
}