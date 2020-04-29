// Generated from e:\projects\functionFitting\src\grammar\expressionGrammar.g4 by ANTLR 4.7.1
// jshint ignore: start
var antlr4 = require('antlr4/index');

// This class defines a complete generic visitor for a parse tree produced by expressionGrammarParser.

function expressionGrammarVisitor() {
	antlr4.tree.ParseTreeVisitor.call(this);
	return this;
}

expressionGrammarVisitor.prototype = Object.create(antlr4.tree.ParseTreeVisitor.prototype);
expressionGrammarVisitor.prototype.constructor = expressionGrammarVisitor;

// Visit a parse tree produced by expressionGrammarParser#expressionSequence.
expressionGrammarVisitor.prototype.visitExpressionSequence = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by expressionGrammarParser#BracketExpression.
expressionGrammarVisitor.prototype.visitBracketExpression = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by expressionGrammarParser#BinaryOperatorExpression.
expressionGrammarVisitor.prototype.visitBinaryOperatorExpression = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by expressionGrammarParser#FunctionExpression.
expressionGrammarVisitor.prototype.visitFunctionExpression = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by expressionGrammarParser#UnaryOperatorExpression.
expressionGrammarVisitor.prototype.visitUnaryOperatorExpression = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by expressionGrammarParser#ParameterExpression.
expressionGrammarVisitor.prototype.visitParameterExpression = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by expressionGrammarParser#ConstantExpression.
expressionGrammarVisitor.prototype.visitConstantExpression = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by expressionGrammarParser#IdentifierExpression.
expressionGrammarVisitor.prototype.visitIdentifierExpression = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by expressionGrammarParser#functionArguments.
expressionGrammarVisitor.prototype.visitFunctionArguments = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by expressionGrammarParser#paramValue.
expressionGrammarVisitor.prototype.visitParamValue = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by expressionGrammarParser#number.
expressionGrammarVisitor.prototype.visitNumber = function(ctx) {
  return this.visitChildren(ctx);
};



exports.expressionGrammarVisitor = expressionGrammarVisitor;