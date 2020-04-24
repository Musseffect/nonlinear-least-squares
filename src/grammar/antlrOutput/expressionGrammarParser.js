// Generated from e:\projects\functionFitting\src\grammar\expressionGrammar.g4 by ANTLR 4.7.1
// jshint ignore: start
var antlr4 = require('antlr4/index');
var expressionGrammarVisitor = require('./expressionGrammarVisitor').expressionGrammarVisitor;

var grammarFileName = "expressionGrammar.g4";

var serializedATN = ["\u0003\u608b\ua72a\u8133\ub9ed\u417c\u3be7\u7786\u5964",
    "\u0003\u0012;\u0004\u0002\t\u0002\u0004\u0003\t\u0003\u0004\u0004\t",
    "\u0004\u0004\u0005\t\u0005\u0003\u0002\u0003\u0002\u0003\u0002\u0003",
    "\u0003\u0003\u0003\u0003\u0003\u0003\u0003\u0003\u0003\u0003\u0003\u0003",
    "\u0003\u0003\u0003\u0003\u0003\u0003\u0003\u0003\u0003\u0003\u0003\u0003",
    "\u0003\u0003\u0003\u0003\u0003\u0003\u0003\u0003\u0003\u0003\u0003\u0003",
    "\u0003\u0005\u0003!\n\u0003\u0003\u0003\u0003\u0003\u0003\u0003\u0003",
    "\u0003\u0003\u0003\u0003\u0003\u0007\u0003)\n\u0003\f\u0003\u000e\u0003",
    ",\u000b\u0003\u0003\u0004\u0003\u0004\u0003\u0004\u0007\u00041\n\u0004",
    "\f\u0004\u000e\u00044\u000b\u0004\u0003\u0004\u0005\u00047\n\u0004\u0003",
    "\u0005\u0003\u0005\u0003\u0005\u0002\u0003\u0004\u0006\u0002\u0004\u0006",
    "\b\u0002\u0005\u0003\u0002\t\n\u0003\u0002\u000b\f\u0003\u0002\u0003",
    "\u0004\u0002?\u0002\n\u0003\u0002\u0002\u0002\u0004 \u0003\u0002\u0002",
    "\u0002\u00066\u0003\u0002\u0002\u0002\b8\u0003\u0002\u0002\u0002\n\u000b",
    "\u0005\u0004\u0003\u0002\u000b\f\u0007\u0002\u0002\u0003\f\u0003\u0003",
    "\u0002\u0002\u0002\r\u000e\b\u0003\u0001\u0002\u000e\u000f\u0007\u0005",
    "\u0002\u0002\u000f\u0010\u0007\r\u0002\u0002\u0010\u0011\u0005\u0006",
    "\u0004\u0002\u0011\u0012\u0007\u000e\u0002\u0002\u0012!\u0003\u0002",
    "\u0002\u0002\u0013\u0014\t\u0002\u0002\u0002\u0014!\u0005\u0004\u0003",
    "\t\u0015\u0016\u0007\r\u0002\u0002\u0016\u0017\u0005\u0004\u0003\u0002",
    "\u0017\u0018\u0007\u000e\u0002\u0002\u0018!\u0003\u0002\u0002\u0002",
    "\u0019\u001a\u0007\u0005\u0002\u0002\u001a\u001b\u0007\u0007\u0002\u0002",
    "\u001b\u001c\u0005\b\u0005\u0002\u001c\u001d\u0007\u0006\u0002\u0002",
    "\u001d!\u0003\u0002\u0002\u0002\u001e!\u0007\u0005\u0002\u0002\u001f",
    "!\u0005\b\u0005\u0002 \r\u0003\u0002\u0002\u0002 \u0013\u0003\u0002",
    "\u0002\u0002 \u0015\u0003\u0002\u0002\u0002 \u0019\u0003\u0002\u0002",
    "\u0002 \u001e\u0003\u0002\u0002\u0002 \u001f\u0003\u0002\u0002\u0002",
    "!*\u0003\u0002\u0002\u0002\"#\f\b\u0002\u0002#$\t\u0003\u0002\u0002",
    "$)\u0005\u0004\u0003\t%&\f\u0007\u0002\u0002&\'\t\u0002\u0002\u0002",
    "\')\u0005\u0004\u0003\b(\"\u0003\u0002\u0002\u0002(%\u0003\u0002\u0002",
    "\u0002),\u0003\u0002\u0002\u0002*(\u0003\u0002\u0002\u0002*+\u0003\u0002",
    "\u0002\u0002+\u0005\u0003\u0002\u0002\u0002,*\u0003\u0002\u0002\u0002",
    "-2\u0005\u0004\u0003\u0002./\u0007\u000f\u0002\u0002/1\u0005\u0004\u0003",
    "\u00020.\u0003\u0002\u0002\u000214\u0003\u0002\u0002\u000220\u0003\u0002",
    "\u0002\u000223\u0003\u0002\u0002\u000237\u0003\u0002\u0002\u000242\u0003",
    "\u0002\u0002\u000257\u0003\u0002\u0002\u00026-\u0003\u0002\u0002\u0002",
    "65\u0003\u0002\u0002\u00027\u0007\u0003\u0002\u0002\u000289\t\u0004",
    "\u0002\u00029\t\u0003\u0002\u0002\u0002\u0007 (*26"].join("");


var atn = new antlr4.atn.ATNDeserializer().deserialize(serializedATN);

var decisionsToDFA = atn.decisionToState.map( function(ds, index) { return new antlr4.dfa.DFA(ds, index); });

var sharedContextCache = new antlr4.PredictionContextCache();

var literalNames = [ null, null, null, null, "'}'", "'{'", "'='", "'+'", 
                     "'-'", "'*'", "'/'", "'('", "')'", "','", "'.'" ];

var symbolicNames = [ null, "FLOAT", "INT", "ID", "RCRLPAREN", "LCRLPAREN", 
                      "ASSIGN", "PLUS", "MINUS", "ASTERISK", "DIVISION", 
                      "LPAREN", "RPAREN", "COMMA", "DOT", "NEWLINE", "WHITESPACE" ];

var ruleNames =  [ "expressionSequence", "expression", "functionArguments", 
                   "number" ];

function expressionGrammarParser (input) {
	antlr4.Parser.call(this, input);
    this._interp = new antlr4.atn.ParserATNSimulator(this, atn, decisionsToDFA, sharedContextCache);
    this.ruleNames = ruleNames;
    this.literalNames = literalNames;
    this.symbolicNames = symbolicNames;
    return this;
}

expressionGrammarParser.prototype = Object.create(antlr4.Parser.prototype);
expressionGrammarParser.prototype.constructor = expressionGrammarParser;

Object.defineProperty(expressionGrammarParser.prototype, "atn", {
	get : function() {
		return atn;
	}
});

expressionGrammarParser.EOF = antlr4.Token.EOF;
expressionGrammarParser.FLOAT = 1;
expressionGrammarParser.INT = 2;
expressionGrammarParser.ID = 3;
expressionGrammarParser.RCRLPAREN = 4;
expressionGrammarParser.LCRLPAREN = 5;
expressionGrammarParser.ASSIGN = 6;
expressionGrammarParser.PLUS = 7;
expressionGrammarParser.MINUS = 8;
expressionGrammarParser.ASTERISK = 9;
expressionGrammarParser.DIVISION = 10;
expressionGrammarParser.LPAREN = 11;
expressionGrammarParser.RPAREN = 12;
expressionGrammarParser.COMMA = 13;
expressionGrammarParser.DOT = 14;
expressionGrammarParser.NEWLINE = 15;
expressionGrammarParser.WHITESPACE = 16;

expressionGrammarParser.RULE_expressionSequence = 0;
expressionGrammarParser.RULE_expression = 1;
expressionGrammarParser.RULE_functionArguments = 2;
expressionGrammarParser.RULE_number = 3;

function ExpressionSequenceContext(parser, parent, invokingState) {
	if(parent===undefined) {
	    parent = null;
	}
	if(invokingState===undefined || invokingState===null) {
		invokingState = -1;
	}
	antlr4.ParserRuleContext.call(this, parent, invokingState);
    this.parser = parser;
    this.ruleIndex = expressionGrammarParser.RULE_expressionSequence;
    return this;
}

ExpressionSequenceContext.prototype = Object.create(antlr4.ParserRuleContext.prototype);
ExpressionSequenceContext.prototype.constructor = ExpressionSequenceContext;

ExpressionSequenceContext.prototype.expression = function() {
    return this.getTypedRuleContext(ExpressionContext,0);
};

ExpressionSequenceContext.prototype.EOF = function() {
    return this.getToken(expressionGrammarParser.EOF, 0);
};

ExpressionSequenceContext.prototype.accept = function(visitor) {
    if ( visitor instanceof expressionGrammarVisitor ) {
        return visitor.visitExpressionSequence(this);
    } else {
        return visitor.visitChildren(this);
    }
};




expressionGrammarParser.ExpressionSequenceContext = ExpressionSequenceContext;

expressionGrammarParser.prototype.expressionSequence = function() {

    var localctx = new ExpressionSequenceContext(this, this._ctx, this.state);
    this.enterRule(localctx, 0, expressionGrammarParser.RULE_expressionSequence);
    try {
        this.enterOuterAlt(localctx, 1);
        this.state = 8;
        this.expression(0);
        this.state = 9;
        this.match(expressionGrammarParser.EOF);
    } catch (re) {
    	if(re instanceof antlr4.error.RecognitionException) {
	        localctx.exception = re;
	        this._errHandler.reportError(this, re);
	        this._errHandler.recover(this, re);
	    } else {
	    	throw re;
	    }
    } finally {
        this.exitRule();
    }
    return localctx;
};

function ExpressionContext(parser, parent, invokingState) {
	if(parent===undefined) {
	    parent = null;
	}
	if(invokingState===undefined || invokingState===null) {
		invokingState = -1;
	}
	antlr4.ParserRuleContext.call(this, parent, invokingState);
    this.parser = parser;
    this.ruleIndex = expressionGrammarParser.RULE_expression;
    return this;
}

ExpressionContext.prototype = Object.create(antlr4.ParserRuleContext.prototype);
ExpressionContext.prototype.constructor = ExpressionContext;


 
ExpressionContext.prototype.copyFrom = function(ctx) {
    antlr4.ParserRuleContext.prototype.copyFrom.call(this, ctx);
};

function BracketExpressionContext(parser, ctx) {
	ExpressionContext.call(this, parser);
    ExpressionContext.prototype.copyFrom.call(this, ctx);
    return this;
}

BracketExpressionContext.prototype = Object.create(ExpressionContext.prototype);
BracketExpressionContext.prototype.constructor = BracketExpressionContext;

expressionGrammarParser.BracketExpressionContext = BracketExpressionContext;

BracketExpressionContext.prototype.LPAREN = function() {
    return this.getToken(expressionGrammarParser.LPAREN, 0);
};

BracketExpressionContext.prototype.expression = function() {
    return this.getTypedRuleContext(ExpressionContext,0);
};

BracketExpressionContext.prototype.RPAREN = function() {
    return this.getToken(expressionGrammarParser.RPAREN, 0);
};
BracketExpressionContext.prototype.accept = function(visitor) {
    if ( visitor instanceof expressionGrammarVisitor ) {
        return visitor.visitBracketExpression(this);
    } else {
        return visitor.visitChildren(this);
    }
};


function BinaryOperatorExpressionContext(parser, ctx) {
	ExpressionContext.call(this, parser);
    this.left = null; // ExpressionContext;
    this.op = null; // Token;
    this.right = null; // ExpressionContext;
    ExpressionContext.prototype.copyFrom.call(this, ctx);
    return this;
}

BinaryOperatorExpressionContext.prototype = Object.create(ExpressionContext.prototype);
BinaryOperatorExpressionContext.prototype.constructor = BinaryOperatorExpressionContext;

expressionGrammarParser.BinaryOperatorExpressionContext = BinaryOperatorExpressionContext;

BinaryOperatorExpressionContext.prototype.expression = function(i) {
    if(i===undefined) {
        i = null;
    }
    if(i===null) {
        return this.getTypedRuleContexts(ExpressionContext);
    } else {
        return this.getTypedRuleContext(ExpressionContext,i);
    }
};

BinaryOperatorExpressionContext.prototype.DIVISION = function() {
    return this.getToken(expressionGrammarParser.DIVISION, 0);
};

BinaryOperatorExpressionContext.prototype.ASTERISK = function() {
    return this.getToken(expressionGrammarParser.ASTERISK, 0);
};

BinaryOperatorExpressionContext.prototype.PLUS = function() {
    return this.getToken(expressionGrammarParser.PLUS, 0);
};

BinaryOperatorExpressionContext.prototype.MINUS = function() {
    return this.getToken(expressionGrammarParser.MINUS, 0);
};
BinaryOperatorExpressionContext.prototype.accept = function(visitor) {
    if ( visitor instanceof expressionGrammarVisitor ) {
        return visitor.visitBinaryOperatorExpression(this);
    } else {
        return visitor.visitChildren(this);
    }
};


function FunctionExpressionContext(parser, ctx) {
	ExpressionContext.call(this, parser);
    this.func = null; // Token;
    ExpressionContext.prototype.copyFrom.call(this, ctx);
    return this;
}

FunctionExpressionContext.prototype = Object.create(ExpressionContext.prototype);
FunctionExpressionContext.prototype.constructor = FunctionExpressionContext;

expressionGrammarParser.FunctionExpressionContext = FunctionExpressionContext;

FunctionExpressionContext.prototype.LPAREN = function() {
    return this.getToken(expressionGrammarParser.LPAREN, 0);
};

FunctionExpressionContext.prototype.functionArguments = function() {
    return this.getTypedRuleContext(FunctionArgumentsContext,0);
};

FunctionExpressionContext.prototype.RPAREN = function() {
    return this.getToken(expressionGrammarParser.RPAREN, 0);
};

FunctionExpressionContext.prototype.ID = function() {
    return this.getToken(expressionGrammarParser.ID, 0);
};
FunctionExpressionContext.prototype.accept = function(visitor) {
    if ( visitor instanceof expressionGrammarVisitor ) {
        return visitor.visitFunctionExpression(this);
    } else {
        return visitor.visitChildren(this);
    }
};


function UnaryOperatorExpressionContext(parser, ctx) {
	ExpressionContext.call(this, parser);
    this.op = null; // Token;
    ExpressionContext.prototype.copyFrom.call(this, ctx);
    return this;
}

UnaryOperatorExpressionContext.prototype = Object.create(ExpressionContext.prototype);
UnaryOperatorExpressionContext.prototype.constructor = UnaryOperatorExpressionContext;

expressionGrammarParser.UnaryOperatorExpressionContext = UnaryOperatorExpressionContext;

UnaryOperatorExpressionContext.prototype.expression = function() {
    return this.getTypedRuleContext(ExpressionContext,0);
};

UnaryOperatorExpressionContext.prototype.PLUS = function() {
    return this.getToken(expressionGrammarParser.PLUS, 0);
};

UnaryOperatorExpressionContext.prototype.MINUS = function() {
    return this.getToken(expressionGrammarParser.MINUS, 0);
};
UnaryOperatorExpressionContext.prototype.accept = function(visitor) {
    if ( visitor instanceof expressionGrammarVisitor ) {
        return visitor.visitUnaryOperatorExpression(this);
    } else {
        return visitor.visitChildren(this);
    }
};


function ParameterExpressionContext(parser, ctx) {
	ExpressionContext.call(this, parser);
    this.id = null; // Token;
    this.value = null; // NumberContext;
    ExpressionContext.prototype.copyFrom.call(this, ctx);
    return this;
}

ParameterExpressionContext.prototype = Object.create(ExpressionContext.prototype);
ParameterExpressionContext.prototype.constructor = ParameterExpressionContext;

expressionGrammarParser.ParameterExpressionContext = ParameterExpressionContext;

ParameterExpressionContext.prototype.LCRLPAREN = function() {
    return this.getToken(expressionGrammarParser.LCRLPAREN, 0);
};

ParameterExpressionContext.prototype.RCRLPAREN = function() {
    return this.getToken(expressionGrammarParser.RCRLPAREN, 0);
};

ParameterExpressionContext.prototype.ID = function() {
    return this.getToken(expressionGrammarParser.ID, 0);
};

ParameterExpressionContext.prototype.number = function() {
    return this.getTypedRuleContext(NumberContext,0);
};
ParameterExpressionContext.prototype.accept = function(visitor) {
    if ( visitor instanceof expressionGrammarVisitor ) {
        return visitor.visitParameterExpression(this);
    } else {
        return visitor.visitChildren(this);
    }
};


function ConstantExpressionContext(parser, ctx) {
	ExpressionContext.call(this, parser);
    this.value = null; // NumberContext;
    ExpressionContext.prototype.copyFrom.call(this, ctx);
    return this;
}

ConstantExpressionContext.prototype = Object.create(ExpressionContext.prototype);
ConstantExpressionContext.prototype.constructor = ConstantExpressionContext;

expressionGrammarParser.ConstantExpressionContext = ConstantExpressionContext;

ConstantExpressionContext.prototype.number = function() {
    return this.getTypedRuleContext(NumberContext,0);
};
ConstantExpressionContext.prototype.accept = function(visitor) {
    if ( visitor instanceof expressionGrammarVisitor ) {
        return visitor.visitConstantExpression(this);
    } else {
        return visitor.visitChildren(this);
    }
};


function IdentifierExpressionContext(parser, ctx) {
	ExpressionContext.call(this, parser);
    this.id = null; // Token;
    ExpressionContext.prototype.copyFrom.call(this, ctx);
    return this;
}

IdentifierExpressionContext.prototype = Object.create(ExpressionContext.prototype);
IdentifierExpressionContext.prototype.constructor = IdentifierExpressionContext;

expressionGrammarParser.IdentifierExpressionContext = IdentifierExpressionContext;

IdentifierExpressionContext.prototype.ID = function() {
    return this.getToken(expressionGrammarParser.ID, 0);
};
IdentifierExpressionContext.prototype.accept = function(visitor) {
    if ( visitor instanceof expressionGrammarVisitor ) {
        return visitor.visitIdentifierExpression(this);
    } else {
        return visitor.visitChildren(this);
    }
};



expressionGrammarParser.prototype.expression = function(_p) {
	if(_p===undefined) {
	    _p = 0;
	}
    var _parentctx = this._ctx;
    var _parentState = this.state;
    var localctx = new ExpressionContext(this, this._ctx, _parentState);
    var _prevctx = localctx;
    var _startState = 2;
    this.enterRecursionRule(localctx, 2, expressionGrammarParser.RULE_expression, _p);
    var _la = 0; // Token type
    try {
        this.enterOuterAlt(localctx, 1);
        this.state = 30;
        this._errHandler.sync(this);
        var la_ = this._interp.adaptivePredict(this._input,0,this._ctx);
        switch(la_) {
        case 1:
            localctx = new FunctionExpressionContext(this, localctx);
            this._ctx = localctx;
            _prevctx = localctx;

            this.state = 12;
            localctx.func = this.match(expressionGrammarParser.ID);
            this.state = 13;
            this.match(expressionGrammarParser.LPAREN);
            this.state = 14;
            this.functionArguments();
            this.state = 15;
            this.match(expressionGrammarParser.RPAREN);
            break;

        case 2:
            localctx = new UnaryOperatorExpressionContext(this, localctx);
            this._ctx = localctx;
            _prevctx = localctx;
            this.state = 17;
            localctx.op = this._input.LT(1);
            _la = this._input.LA(1);
            if(!(_la===expressionGrammarParser.PLUS || _la===expressionGrammarParser.MINUS)) {
                localctx.op = this._errHandler.recoverInline(this);
            }
            else {
            	this._errHandler.reportMatch(this);
                this.consume();
            }
            this.state = 18;
            this.expression(7);
            break;

        case 3:
            localctx = new BracketExpressionContext(this, localctx);
            this._ctx = localctx;
            _prevctx = localctx;
            this.state = 19;
            this.match(expressionGrammarParser.LPAREN);
            this.state = 20;
            this.expression(0);
            this.state = 21;
            this.match(expressionGrammarParser.RPAREN);
            break;

        case 4:
            localctx = new ParameterExpressionContext(this, localctx);
            this._ctx = localctx;
            _prevctx = localctx;
            this.state = 23;
            localctx.id = this.match(expressionGrammarParser.ID);
            this.state = 24;
            this.match(expressionGrammarParser.LCRLPAREN);
            this.state = 25;
            localctx.value = this.number();
            this.state = 26;
            this.match(expressionGrammarParser.RCRLPAREN);
            break;

        case 5:
            localctx = new IdentifierExpressionContext(this, localctx);
            this._ctx = localctx;
            _prevctx = localctx;
            this.state = 28;
            localctx.id = this.match(expressionGrammarParser.ID);
            break;

        case 6:
            localctx = new ConstantExpressionContext(this, localctx);
            this._ctx = localctx;
            _prevctx = localctx;
            this.state = 29;
            localctx.value = this.number();
            break;

        }
        this._ctx.stop = this._input.LT(-1);
        this.state = 40;
        this._errHandler.sync(this);
        var _alt = this._interp.adaptivePredict(this._input,2,this._ctx)
        while(_alt!=2 && _alt!=antlr4.atn.ATN.INVALID_ALT_NUMBER) {
            if(_alt===1) {
                if(this._parseListeners!==null) {
                    this.triggerExitRuleEvent();
                }
                _prevctx = localctx;
                this.state = 38;
                this._errHandler.sync(this);
                var la_ = this._interp.adaptivePredict(this._input,1,this._ctx);
                switch(la_) {
                case 1:
                    localctx = new BinaryOperatorExpressionContext(this, new ExpressionContext(this, _parentctx, _parentState));
                    localctx.left = _prevctx;
                    this.pushNewRecursionContext(localctx, _startState, expressionGrammarParser.RULE_expression);
                    this.state = 32;
                    if (!( this.precpred(this._ctx, 6))) {
                        throw new antlr4.error.FailedPredicateException(this, "this.precpred(this._ctx, 6)");
                    }
                    this.state = 33;
                    localctx.op = this._input.LT(1);
                    _la = this._input.LA(1);
                    if(!(_la===expressionGrammarParser.ASTERISK || _la===expressionGrammarParser.DIVISION)) {
                        localctx.op = this._errHandler.recoverInline(this);
                    }
                    else {
                    	this._errHandler.reportMatch(this);
                        this.consume();
                    }
                    this.state = 34;
                    localctx.right = this.expression(7);
                    break;

                case 2:
                    localctx = new BinaryOperatorExpressionContext(this, new ExpressionContext(this, _parentctx, _parentState));
                    localctx.left = _prevctx;
                    this.pushNewRecursionContext(localctx, _startState, expressionGrammarParser.RULE_expression);
                    this.state = 35;
                    if (!( this.precpred(this._ctx, 5))) {
                        throw new antlr4.error.FailedPredicateException(this, "this.precpred(this._ctx, 5)");
                    }
                    this.state = 36;
                    localctx.op = this._input.LT(1);
                    _la = this._input.LA(1);
                    if(!(_la===expressionGrammarParser.PLUS || _la===expressionGrammarParser.MINUS)) {
                        localctx.op = this._errHandler.recoverInline(this);
                    }
                    else {
                    	this._errHandler.reportMatch(this);
                        this.consume();
                    }
                    this.state = 37;
                    localctx.right = this.expression(6);
                    break;

                } 
            }
            this.state = 42;
            this._errHandler.sync(this);
            _alt = this._interp.adaptivePredict(this._input,2,this._ctx);
        }

    } catch( error) {
        if(error instanceof antlr4.error.RecognitionException) {
	        localctx.exception = error;
	        this._errHandler.reportError(this, error);
	        this._errHandler.recover(this, error);
	    } else {
	    	throw error;
	    }
    } finally {
        this.unrollRecursionContexts(_parentctx)
    }
    return localctx;
};

function FunctionArgumentsContext(parser, parent, invokingState) {
	if(parent===undefined) {
	    parent = null;
	}
	if(invokingState===undefined || invokingState===null) {
		invokingState = -1;
	}
	antlr4.ParserRuleContext.call(this, parent, invokingState);
    this.parser = parser;
    this.ruleIndex = expressionGrammarParser.RULE_functionArguments;
    return this;
}

FunctionArgumentsContext.prototype = Object.create(antlr4.ParserRuleContext.prototype);
FunctionArgumentsContext.prototype.constructor = FunctionArgumentsContext;

FunctionArgumentsContext.prototype.expression = function(i) {
    if(i===undefined) {
        i = null;
    }
    if(i===null) {
        return this.getTypedRuleContexts(ExpressionContext);
    } else {
        return this.getTypedRuleContext(ExpressionContext,i);
    }
};

FunctionArgumentsContext.prototype.COMMA = function(i) {
	if(i===undefined) {
		i = null;
	}
    if(i===null) {
        return this.getTokens(expressionGrammarParser.COMMA);
    } else {
        return this.getToken(expressionGrammarParser.COMMA, i);
    }
};


FunctionArgumentsContext.prototype.accept = function(visitor) {
    if ( visitor instanceof expressionGrammarVisitor ) {
        return visitor.visitFunctionArguments(this);
    } else {
        return visitor.visitChildren(this);
    }
};




expressionGrammarParser.FunctionArgumentsContext = FunctionArgumentsContext;

expressionGrammarParser.prototype.functionArguments = function() {

    var localctx = new FunctionArgumentsContext(this, this._ctx, this.state);
    this.enterRule(localctx, 4, expressionGrammarParser.RULE_functionArguments);
    var _la = 0; // Token type
    try {
        this.state = 52;
        this._errHandler.sync(this);
        switch(this._input.LA(1)) {
        case expressionGrammarParser.FLOAT:
        case expressionGrammarParser.INT:
        case expressionGrammarParser.ID:
        case expressionGrammarParser.PLUS:
        case expressionGrammarParser.MINUS:
        case expressionGrammarParser.LPAREN:
            this.enterOuterAlt(localctx, 1);
            this.state = 43;
            this.expression(0);
            this.state = 48;
            this._errHandler.sync(this);
            _la = this._input.LA(1);
            while(_la===expressionGrammarParser.COMMA) {
                this.state = 44;
                this.match(expressionGrammarParser.COMMA);
                this.state = 45;
                this.expression(0);
                this.state = 50;
                this._errHandler.sync(this);
                _la = this._input.LA(1);
            }
            break;
        case expressionGrammarParser.RPAREN:
            this.enterOuterAlt(localctx, 2);

            break;
        default:
            throw new antlr4.error.NoViableAltException(this);
        }
    } catch (re) {
    	if(re instanceof antlr4.error.RecognitionException) {
	        localctx.exception = re;
	        this._errHandler.reportError(this, re);
	        this._errHandler.recover(this, re);
	    } else {
	    	throw re;
	    }
    } finally {
        this.exitRule();
    }
    return localctx;
};

function NumberContext(parser, parent, invokingState) {
	if(parent===undefined) {
	    parent = null;
	}
	if(invokingState===undefined || invokingState===null) {
		invokingState = -1;
	}
	antlr4.ParserRuleContext.call(this, parent, invokingState);
    this.parser = parser;
    this.ruleIndex = expressionGrammarParser.RULE_number;
    this.value = null; // Token
    return this;
}

NumberContext.prototype = Object.create(antlr4.ParserRuleContext.prototype);
NumberContext.prototype.constructor = NumberContext;

NumberContext.prototype.FLOAT = function() {
    return this.getToken(expressionGrammarParser.FLOAT, 0);
};

NumberContext.prototype.INT = function() {
    return this.getToken(expressionGrammarParser.INT, 0);
};

NumberContext.prototype.accept = function(visitor) {
    if ( visitor instanceof expressionGrammarVisitor ) {
        return visitor.visitNumber(this);
    } else {
        return visitor.visitChildren(this);
    }
};




expressionGrammarParser.NumberContext = NumberContext;

expressionGrammarParser.prototype.number = function() {

    var localctx = new NumberContext(this, this._ctx, this.state);
    this.enterRule(localctx, 6, expressionGrammarParser.RULE_number);
    var _la = 0; // Token type
    try {
        this.enterOuterAlt(localctx, 1);
        this.state = 54;
        localctx.value = this._input.LT(1);
        _la = this._input.LA(1);
        if(!(_la===expressionGrammarParser.FLOAT || _la===expressionGrammarParser.INT)) {
            localctx.value = this._errHandler.recoverInline(this);
        }
        else {
        	this._errHandler.reportMatch(this);
            this.consume();
        }
    } catch (re) {
    	if(re instanceof antlr4.error.RecognitionException) {
	        localctx.exception = re;
	        this._errHandler.reportError(this, re);
	        this._errHandler.recover(this, re);
	    } else {
	    	throw re;
	    }
    } finally {
        this.exitRule();
    }
    return localctx;
};


expressionGrammarParser.prototype.sempred = function(localctx, ruleIndex, predIndex) {
	switch(ruleIndex) {
	case 1:
			return this.expression_sempred(localctx, predIndex);
    default:
        throw "No predicate with index:" + ruleIndex;
   }
};

expressionGrammarParser.prototype.expression_sempred = function(localctx, predIndex) {
	switch(predIndex) {
		case 0:
			return this.precpred(this._ctx, 6);
		case 1:
			return this.precpred(this._ctx, 5);
		default:
			throw "No predicate with index:" + predIndex;
	}
};


exports.expressionGrammarParser = expressionGrammarParser;
