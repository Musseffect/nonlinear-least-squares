import { 
    FunctionNode,
    NegationNode,
    DivisionNode,
    ConstantNode,
    MultiplicationNode,
    SubtractionNode,
    AdditionNode, 
    VariableNode} from "./expressionNodes";
import { Division } from "./stackElements";

function step(x)
{
    return x<0?0:1;
}
function smoothstep(x)
{
    x = Math.max(Math.min(1,x),0);
    return x*x*(3-2*x);
}

function erf(x) {
	var sign = Math.sign(x);
	x = Math.abs(x);
	var a1 = 0.254829592;
	var a2 = -0.284496736;
	var a3 = 1.421413741;
	var a4 = -1.453152027;
	var a5 = 1.061405429;
	var p = 0.3275911;
	var t = 1.0 / (1.0 + p * x);
	var y = 1.0 - (((((a5 * t + a4) * t) + a3) * t + a2) * t + a1) * t * Math.exp(-x * x);
	return sign * y;
}
export const functionDictionary = {
    sinc:{
        exec:function(args){
            if(args[0]<0.001)
                return 1.0-args[0]*args[0]/6.0*(1.-args[0]*args[0]/20);//truncated maclaurin series 
            return Math.sin(args[0])/args[0];
        },
        args:1,
        name:'sinc',
        derivatives:[
            function(args){
                return new DivisionNode(
                    new SubtractionNode(new Function("cos",args),new Function("sinc",args)),
                    args[0]
                    );
            }
        ]
    },
	sin: {
		exec: function (args) {
			return Math.sin(args[0]);
		},
		args: 1,
		name: 'sin',
		derivatives: [
			function (args) {
				return new FunctionNode("cos", args);
			}
		]
	},
	cos: {
		exec: function (args) {
			return Math.cos(args[0]);
		},
		args: 1,
		name: 'cos',
		derivatives: [
			function (args) {
				return new NegationNode(new FunctionNode("sin", args));
			}
		]
	},
	tan: {
        exec:function(args)
        {
            return Math.tan(args[0]);
        },
        args:1,
        name:"tan",
        derivatives:[
            function(args)
            {
                new Function("pow",[
                    new FunctionNode("cos",args),
                    new ConstantNode(2)]);
            }]
    },
	cot: {
        exec:function(args)
        {
            return Math.cos(args[0])/Math.sin(args[0]);
        },
        args:1,
        name:"cot",
        derivatives:[
            function(args){
            return new NegationNode(
                new Function("pow",[
                    new FunctionNode("sin",args),
                    new ConstantNode(2)])
            );
        }]
    },
	asin: {
        exec:function(args)
        {
            return Math.asin(args[0]);
        },
        args:1,
        name:"asin",
        derivatives:[
            function(args){
                return new DivisionNode(new ConstantNode(1.0),
                new FunctionNode("sqrt",
                [
                    new SubtractionNode(
                        new ConstantNode(1),
                        new MultiplicationNode(args[0],args[0]))
                ]))
            }
        ]
    },
	acos: {
        exec:function(args)
        {
            return Math.acos(args[0]);
        },
        args:1,
        name:"acos",
        derivatives:[
            function(args){
                return new NegationNode(
                    new DivisionNode(new ConstantNode(1.0),
                new FunctionNode("sqrt",
                [
                    new SubtractionNode(
                        new ConstantNode(1),
                        new MultiplicationNode(args[0],args[0]))
                ])));
            }
        ]},
	atan: {
        exec:function(args)
        {
            return Math.atan(args[0]);
        },
        args:1,
        name:"atan",
        derivatives:[
            function(args){
                return new DivisionNode(new ConstantNode(1.0),
                    new AdditionNode(
                        new ConstantNode(1),
                        new MultiplicationNode(args[0],args[0])
                        )
                );
            }
        ]},
	acot: {
        exec:function(args)
        {
            return Math.PI/2-Math.atan(args[0]);
        },
        args:1,
        name:"acot",
        derivatives:[
            function(args){
                return new NegationNode(new DivisionNode(new ConstantNode(1.0),
                    new AdditionNode(
                        new ConstantNode(1),
                        new MultiplicationNode(args[0],args[0])
                        )
                ));
            }
        ]},
    sinh:{
        exec:function(args)
        {
            return Math.sinh(args[0]);
        },
        args:1,
        name:"sinh",
        derivatives:[
            function(args)
            {
                return new FunctionNode("cosh",args);
            }
        ]
    },
    cosh:{
        exec:function(args)
        {
            return Math.cosh(args[0]);
        },
        args:1,
        name:"cosh",
        derivatives:[
            function(args)
            {
                return new FunctionNode("sinh",args);
            }
        ]
    },
    tanh:{
        exec:function(args)
        {
            return Math.tanh(args[0]);
        },
        args:1,
        name:"tanh",
        derivatives:[
            function(args)
            {
                return new FunctionNode("pow",[
                    new FunctionNode("cosh",args)
                    ,new ConstantNode(-2)
                ]);
            }
        ]
    },
    coth:{
        
        exec:function(args)
        {
            return 1.0/Math.tanh(args[0]);
        },
        args:1,
        name:"coth",
        derivatives:[
            function(args)
            {
                return new NegationNode(new FunctionNode("pow",[
                    new FunctionNode("sinh",args)
                    ,new ConstantNode(-2)
                ]));
            }
        ]
    },
    asinh:{
        exec:function(args)
        {
            return Math.asinh(args[0]);
        },
        args:1,
        name:"asinh",
        derivatives:[
            function(args)
            {
                return new DivisionNode(new ConstantNode(1),
                    new FunctionNode("sqrt",[new AdditionNode(
                        new MultiplicationNode(args[0],args[0]),
                        new ConstantNode(1)
                    )])
                );
            }
        ]
    },
    acosh:{
        exec:function(args)
        {
            return Math.acosh(args[0]);
        },
        args:1,
        name:"acosh",
        derivatives:[
            function(args)
            {
                return new DivisionNode(new ConstantNode(1),
                    new FunctionNode("sqrt",[new SubtractionNode(
                        new MultiplicationNode(args[0],args[0]),
                        new ConstantNode(1)
                    )])
                );
            }
        ]
    },
    atanh:{
        exec:function(args)
        {
            return Math.atanh(args[0]);
        },
        args:1,
        name:"atanh",
        derivatives:[
            function(args)
            {
                return new DivisionNode(
                    new ConstantNode(1),
                    new SubtractionNode(
                        new ConstantNode(1),
                        new MultiplicationNode(args[0],args[0])
                    ),
                )
            }
        ]
    },
    acoth:{
        exec:function(args)
        {
            return 0.5*Math.log((1+args[0])/(args[0]-1));
        },
        args:1,
        name:"acoth",
        derivatives:[
            function(args)
            {
                return new DivisionNode(
                    new ConstantNode(1),
                    new SubtractionNode(
                        new ConstantNode(1),
                        new MultiplicationNode(args[0],args[0])
                    ),
                )
            }
        ]
    },
	erf: {
		exec: function (args) {
			return erf(args[0]);
		},
		args: 1,
		name: 'erf',
		derivatives: [
			function (args) {
				return new MultiplicationNode(new ConstantNode(2.0 / Math.sqrt(Math.PI)), new FunctionNode("exp", [new NegationNode(new MultiplicationNode(args[0], args[0]))]));
			}
		]
	},
	exp: {
		exec: function (args) {
			return Math.exp(args[0]);
		},
		args: 1,
		name: 'exp',
		derivatives: [
			function (args) {
				return new FunctionNode("exp", args);
			}
		]
    },	
    pow: {
		exec: function (args) {
			return Math.pow(args[0], args[1]);
		},
		args: 2,
		name: 'pow',
		derivatives: [
			function (args) {
				return new MultiplicationNode(args[1], new FunctionNode("pow", [
					args[0],new SubtractionNode(args[1], new ConstantNode(1))
				]));
			},
			function (args) {
				return new MultiplicationNode(new FunctionNode("ln", [args[0]]), new FunctionNode("pow", args));
			}
		]
	},
	ln: {
		exec: function (args) {
			return Math.log(args[0]);
		},
		args: 1,
		name: 'ln',
		derivatives: [
			function (args) {
				return new DivisionNode(new ConstantNode(1.0), args[0]);
			}
		]
	},
	log: {
        exec:function(args)
        {
            return Math.log(args[1])/Math.log(args[0]);
        },
        args:2,
        name:"log",
        derivatives:[
            function(args){
                return new DivisionNode(
                    new FunctionNode("ln",[args[1]]),
                    new MultiplicationNode(
                        new FunctionNode("pow",[
                            new FunctionNode("ln",[args[0]]),
                            new ConstantNode(2)]),
                            args[0])
                );
            },
            function(args)
            {
                return new DivisionNode(
                    new ConstantNode(1),
                new MultiplicationNode(args[1],new Function("ln",[args[0]]))
                );
            }
        ]
    },
	lg: {
        exec:function(args)
        {
            return Math.log10(args[0]);
        },
        args:1,
        name:"lg",
        derivatives:[
            function(args)
            {
                return new DivisionNode(
                    new ConstantNode(1.0/Math.log(10)),
                    args[0]);
            }
        ]
    },
	sqrt: {
        exec:function(args)
        {
            return Math.sqrt(args[0]);
        },
        args:1,
        name:"sqrt",
        derivatives:[
            function(args)
            {
                return new DivisionNode(new ConstantNode(0.5),new FunctionNode("sqrt",args));
            }
        ]
    },
	abs: {
		exec: function (args) {
			return Math.abs(args[0]);
		},
		args: 1,
		name: 'abs'
	},
	min: {
		exec: function (args) {
			return Math.min(args[0], args[1]);
		},
		args: 2,
		name: 'min'
	},
	max: {
		exec: function (args) {
			return Math.max(args[0], args[1]);
		},
		args: 2,
		name: 'max'
    },
    sign:{
        exec:function(args)
        {
            return Math.sign(args[0]);
        },
        args:1,
        name:"sign"
    },
    step:{
        exec:function(args)
        {
            return step(args[0]);
        },
        args:1,
        name:"step"
    },
    smoothstep:{
        exec:function(args)
        {
            return smoothstep(args[0]);
        },
        args:1,
        name:"smoothstep"
    },
    e:{
        exec:function(args)
        {
            return Math.E;
        },
        args:0,
        name:"e"
    },
    pi:{
        exec:function(args)
        {
            return Math.PI;
        },
        args:0,
        name:"pi"
    }
};