grammar expressionGrammar;

expressionSequence: expression EOF;

expression: func=ID LPAREN functionArguments RPAREN	#FunctionExpression
	| op=(PLUS | MINUS) expression	#UnaryOperatorExpression
	| left=expression op=(DIVISION|ASTERISK) right=expression	#BinaryOperatorExpression
	| left=expression op=(PLUS|MINUS) right=expression	#BinaryOperatorExpression
	| LPAREN expression RPAREN #BracketExpression
	| id=ID LCRLPAREN value=number RCRLPAREN  #ParameterExpression
	| id=ID #IdentifierExpression
	| value=number	#ConstantExpression
	;
functionArguments: expression (COMMA expression)* | ;

number		: value=(FLOAT|INT);

/*
    Lexer Rules
 */

 fragment LOWERCASE  : [a-z] ;
fragment UPPERCASE  : [A-Z] ;
fragment DIGIT: [0-9] ;

FLOAT: (DIGIT+ DOT DIGIT*) ([Ee] [+-]? DIGIT+)?
	   |DOT DIGIT+ ([Ee] [+-]? DIGIT+)?
		|DIGIT+ ([Ee] [+-]? DIGIT+)?
		;
INT: DIGIT+ ; 
ID: [_]*(LOWERCASE|UPPERCASE)[A-Za-z0-9_]*;

RCRLPAREN			: '}' ;
LCRLPAREN			: '{' ;
ASSIGN				: '=' ;
PLUS               : '+' ;
MINUS              : '-' ;
ASTERISK           : '*' ;
DIVISION           : '/' ;
LPAREN             : '(' ;
RPAREN				: ')';
COMMA				: ',' ;
DOT					: '.';


NEWLINE	: ('\r'? '\n' | '\r')+ -> skip;
WHITESPACE : (' ' | '\t')+ -> skip ;










