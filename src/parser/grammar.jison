// Importación y declaraciones

%{
    const { Node } = require('./models/Node');
    const { NodeType } = require('./models/NodeType');
    const { AnalysisError, ErrorType } = require('./models/Error');
    const { Null, Number, String, Bool, Identifier } = require('./expressions/Primitive');
    const { BinaryOperation } = require('./expressions/Operation');
    const { CallFunction, Declaration } = require('./instructions/Sentence');
    let nodo_inicio = new Node('START');
    let errorList = [];
    nodo_inicio.id = 0; 
    Node.count = 1;
%}

/* #########################################  ANÁLISIS LÉXICO  ################################################# */

%lex
%options case-insensitive
// VALORes regulares para ciertos patrones
comentarios             (\/\*[\s\S]*?\*\/|\/\/.*)
identificador           (([a-zA-Z_])[a-zA-Z0-9_]*)
digito                  ([0-9]+)
decimal                 ({digito}("."{digito}))
numero                  ({digito})
comillaSimple           ("'")
comillaDoble            ("\"")
comilla                 ("`")
cadena_d                ({comillaDoble}((?:\\{comillaDoble}|(?:(?!{comillaDoble}).))*){comillaDoble})
cadena_s                ({comillaSimple}((?:\\{comillaSimple}|(?:(?!{comillaSimple}).))*){comillaSimple})
cadena_t                ({comilla}((?:\\{comilla}|(?:(?!{comilla}).))*){comilla})

%%
/* Tokens */
\s+                     /* omitir espacios en blanco */
{comentarios}           /* omitir comentarios */

// Patron               // Nombre Token
"{"                     return '{'
"}"                     return '}'
"["                     return '['
"]"                     return ']'
"("                     return '('
")"                     return ')'
","                     return ','
"."                     return '.'
":"                     return ':'
";"                     return ';'
"?"                     return '?'

/*palabras reservadas*/
//declaracion de variables o constrantes
"let"                   return 'let'
"const"                 return 'const'

//tipos de datos
"string"                return 'string'
"boolean"               return 'boolean'
"void"                  return 'void'
"number"                return 'number'
"type"                  return 'type'
"Array"                 return 'Array'
"true"                  return 'true'
"false"                 return 'false'
"new"                   return 'new'
"null"                  return 'null'
"undefined"             return 'undefined'

//Estructuras de control
"if"                    return 'if'
"else"                  return 'else'
"switch"                return 'switch'
"case"                  return 'case'
"default"               return 'default'
"while"                 return 'while'
"do"                    return 'do'
"for"                   return 'for'
"in"                    return 'in'
"of"                    return 'of'
"break"                 return 'break'
"continue"              return 'continue'

//funciones
"function"              return 'function'
"return"                return 'return'
"console"               return 'console'
"log"                   return 'log'

//comparadores
"<="                    return '<='
"<"                     return '<'
"==="                    return '==='
"=="                    return '=='
">="                    return '>='
">"                     return '>'
"!="                    return '!='

//operadores logicos
"||"                    return '||'
"&&"                    return '&&'
"!"                     return '!'

//otros
"="                     return '='
"-="                    return '-='
"+="                    return '+='
"++"                    return '++'
"+"                     return '+'
"--"                    return '--'
"-"                     return '-'
"/"                     return '/'
"**"                    return '**'
"*"                     return '*'
"%"                     return '%'

{identificador}         { yytext = yytext.toLowerCase(); return 'identificador';}
{decimal}               return 'decimal'
{numero}                return 'numero'
{cadena_d}              { yytext = yytext.substr(1,yyleng-2); 
                        yytext = yytext.replace(new RegExp(/\\n/, 'g'), '\n');
                        yytext = yytext.replace(new RegExp(/\\t/, 'g'), '\t');
                        return 'cadena_d'; }
{cadena_s}              { yytext = yytext.substr(1,yyleng-2); 
                        yytext = yytext.replace(new RegExp(/\\n/, 'g'), '\n');
                        yytext = yytext.replace(new RegExp(/\\t/, 'g'), '\t');
                        return 'cadena_s'; }
{cadena_t}              { yytext = yytext.substr(1,yyleng-2); 
                        yytext = yytext.replace(new RegExp(/\\n/, 'g'), '\n');
                        yytext = yytext.replace(new RegExp(/\\t/, 'g'), '\t');
                        return 'cadena_t'; }
<<EOF>>                 return 'EOF'; // Token fin de archivo

//Mensaje y recuperacion de errores lexicos
.                       { errorList.push(new AnalysisError('Carácter desconocido "'+yytext+'".', ErrorType.LEXICO, yylloc.first_line, yylloc.first_column));
                        console.error('Error Lexico: ' + yytext + ' en la linea ' + yylloc.first_line + ' y columna ' + yylloc.first_column); }
/lex

/* Precedencia de operaciones */
%left '||'                          // Menor Precedencia
%left '&&'
%right '?'
%left '==', '!=', '==='
%left '>=', '<=', '<', '>'
%left '+' '-'
%left '*' '/' '%'
%left '**' 
%right '.' 
%right '!' '='
%left UMENOS
%right '++' '--' '+=' '-='                // Mayor Precedencia

/* #########################################  ANÁLISIS SINTÁCTICO  ################################################# */

%start INICIO
%%

// $$     $1      $2    $3
INICIO 
  : BODY_FILE         {let data = nodo_inicio;
                       let errorReturn = errorList;
                       Node.count = 0; 
                       nodo_inicio = new Node('START'); 
                       errorList = [];
                       return {tree: data, errors: errorReturn};
                      }
;

BODY_FILE 
  //: FUNCION BODY_FILE     { nodo_inicio.addChildStart($1); }
  : SENTENCIA BODY_FILE   { if($1.type != NodeType.ERROR){nodo_inicio.addChildStart($1);} }
  | 'EOF'                 { nodo_inicio.addChildStart(new Node('EOF')); }
;

SENTENCIA
  : FUNCION         { $$ = $1; $$.setPosition(this._$.first_line, this._$.first_column);}
  | DECLARACION FIN { $$ = $1; $$.setPosition(this._$.first_line, this._$.first_column);}
  | ASIGNACION  FIN { $$ = $1; $$.setPosition(this._$.first_line, this._$.first_column);}
  | IF              { $$ = $1; $$.setPosition(this._$.first_line, this._$.first_column);}
  | SWITCH          { $$ = $1; $$.setPosition(this._$.first_line, this._$.first_column);}
  | FOR             { $$ = $1; $$.setPosition(this._$.first_line, this._$.first_column);}
  | WHILE           { $$ = $1; $$.setPosition(this._$.first_line, this._$.first_column);}
  | DO_WHILE        { $$ = $1; $$.setPosition(this._$.first_line, this._$.first_column);}
  | TYPE            { $$ = $1; $$.setPosition(this._$.first_line, this._$.first_column);}
  | CONSOLE         { $$ = $1; $$.setPosition(this._$.first_line, this._$.first_column);}
  | RETURN          { $$ = $1; $$.setPosition(this._$.first_line, this._$.first_column);}
  | 'break' FIN     { $$ = new Node($1, NodeType.INS_BREAK); $$.setPosition(this._$.first_line, this._$.first_column); }
  | 'continue' FIN  { $$ = new Node($1, NodeType.INS_CONTINUE); $$.setPosition(this._$.first_line, this._$.first_column);}
  | error           { errorList.push(new AnalysisError('Token "'+yytext+'" no esperado.', ErrorType.SINTACTICO, this._$.first_line, this._$.first_column));
                      $$ = new Node('', NodeType.ERROR);
                    }
;

FIN
  : ';'           {$$ = new Node(';');}
;

PRIMITIVO 
  : 'string'          { $$ = new Node('string', NodeType.DT_STRING); $$.setPosition(this._$.first_line, this._$.first_column);}
  | 'boolean'         { $$ = new Node('boolean', NodeType.DT_BOOLEAN); $$.setPosition(this._$.first_line, this._$.first_column);}
  | 'number'          { $$ = new Node('number', NodeType.DT_NUMBER); $$.setPosition(this._$.first_line, this._$.first_column);}
  | 'identificador'   { $$ = new Node($1, NodeType.DT_IDENTIFIER); $$.setPosition(this._$.first_line, this._$.first_column);}
;

DATO 
  : PRIMITIVO CORCHETES                  { $2.name = $1.name; $$ = $2;}
  | 'Array' '<' DATO '>'                 { $$ = new Node($1, NodeType.DATA_TYPE);
                                           $$.addChild($3);
                                         }
;

CORCHETES
  : CORCHETES '[' ']'             { $1.addChild(new Node('[]'));}
  |                               { $$ = new Node('Array', NodeType.DATA_TYPE);}
;

TIPO_DATO 
  : ':' DATO                      { $$ = $2;}
  //|                               { $$ = new Node('null');}
;

TIPO_RETORNO 
  : ':' TIPO_RETORNO_             { $$ = $2; }
  //|                               { $$ = new Node('null'); }
;

TIPO_RETORNO_ 
  : DATO                          { $$ = $1; }
  | 'void'                        { $$ = new Node('void', NodeType.DATA_TYPE); }
;

/* ------  REGLAS PARA FUNCIONES ------------------------------------------------------------------ */
FUNCION           
  : 'function' 'identificador' '(' PARAMETROS ')' TIPO_RETORNO '{' BODY '}'   {$$ = new Node('Funcion', NodeType.INS_FUNCION);
                                                                               $$.setPosition(this._$.first_line, this._$.first_column);
                                                                               $$.addChild(new Node($2));
                                                                               $$.childs[0].setPosition(this._$.first_line, this._$.first_column+$1.length+1);
                                                                               $$.addChild($4);
                                                                               $$.addChild($6);
                                                                               $$.addChild($8);
                                                                              }  
                                                                                                                                                                                        
;

PARAMETROS
  : PARAMETROS ',' 'identificador' TIPO_DATO  { let aux = new Node('Parametro');
                                                aux.addChild(new Node($3, NodeType.IDENTIFICADOR));                                                  
                                                aux.childs[0].setPosition(this._$.first_line, this._$.first_column+3);
                                                aux.addChild($4);
                                                $1.addChild(aux);
                                              }
  | PARAMETROS 'identificador' TIPO_DATO      { let aux1 = new Node('Parametro');
                                                aux1.addChild(new Node($2, NodeType.IDENTIFICADOR));
                                                aux1.childs[0].setPosition(this._$.first_line, this._$.first_column);
                                                aux1.addChild($3);
                                                $1.addChild(aux1);
                                              }
  |                                           { $$ = new Node('Parametros');}
;

BODY
  : BODY SENTENCIA                                    { if($2.getType() != NodeType.ERROR){$1.addChild($2);} $$ = $1; }
  |                                                   { $$ = new Node('Cuerpo');}
;
  

/* ------  REGLAS PARA VARIABLES ------------------------------------------------------------------ */
/* ---------------- Declaracion de variables y asignacion  --------- */
DECLARACION
  : 'let' 'identificador' TIPO_DATO '=' EXPRESION  OTRA_DECLARACION       { $$ = new Declaration($2, $5, $3);
                                                                            $$.setPosition(this._$.first_line, this._$.first_column+4);
                                                                                                                                                 
                                                                          }
  | 'let' 'identificador' TIPO_DATO OTRA_DECLARACION                      { $$ = new Declaration($2, null, $3);
                                                                            $$.setPosition(this._$.first_line, this._$.first_column+4);
                                                                          }
  | 'const' 'identificador' TIPO_DATO '=' EXPRESION  ASIGNACION_CONSTANTE { $$ = new Declaration($2, $5, $3, true);
                                                                            $$.setPosition(this._$.first_line, this._$.first_column+6);
                                                                          }
;

OTRA_DECLARACION
  : ',' 'identificador' TIPO_DATO '=' EXPRESION OTRA_DECLARACION          { $$ = new Node('=', NodeType.INS_DEC_ASIGN);
                                                                            $$.addChild(new Node($2, NodeType.IDENTIFICADOR));
                                                                            $$.childs[0].setPosition(this._$.first_line, this._$.first_column+2);
                                                                            $$.addChild($3);
                                                                            $$.addChild($5);  
                                                                            $$.addChild($6);                                                                        
                                                                          }
  | ',' 'identificador' TIPO_DATO OTRA_DECLARACION                        { $$ = new Node('Declaracion', NodeType.INS_DECLARACION);
                                                                            $$.addChild(new Node($2, NodeType.IDENTIFICADOR));
                                                                            $$.childs[0].setPosition(this._$.first_line, this._$.first_column+2);
                                                                            $$.addChild($3);
                                                                            $$.addChild($4);
                                                                          }
  |                                                                       { $$ = null;}
;

ASIGNACION_CONSTANTE
  : ',' 'identificador' TIPO_DATO '=' EXPRESION ASIGNACION_CONSTANTE      { $$ = new Node('=', NodeType.INS_DEC_ASIGN);
                                                                            $$.addChild(new Node($2, NodeType.IDENTIFICADOR));
                                                                            $$.childs[1].setPosition(this._$.first_line, this._$.first_column+2);
                                                                            $$.addChild($3); 
                                                                            $$.addChild($5);  
                                                                            $$.addChild($6);                                                                        
                                                                          }
  |                                                                       { $$ = null;}
;


/* ---------------- Asignacion de variables ------------------------  */
ASIGNACION
  : EXPRESION '=' EXPRESION                                               { $$ = new Node('=', NodeType.INS_ASIGNACION);
                                                                            $$.addChild($1);
                                                                            $$.addChild($3);
                                                                          }
  | EXPRESION                                                             { if($1.type === NodeType.INS_LLAMADA_FUNCION){
                                                                              $$ = $1;
                                                                            }else{        
                                                                              $$ = new Node('Expresion', NodeType.INS_EXPRESION);
                                                                              $$.addChild($1);
                                                                            }
                                                                          }
;

/* ---------------- Llamada funcion ------------------------  */
LLAMADA_FUNCION
  : 'identificador' '(' INGRESO_PARAMETROS ')'    { $$ = new Node('Llamada Funcion', NodeType.INS_LLAMADA_FUNCION);
                                                    $$.setPosition(this._$.first_line, this._$.first_column);
                                                    $$.addChild(new Node($1, NodeType.IDENTIFICADOR));
                                                    $$.childs[0].setPosition(this._$.first_line, this._$.first_column);
                                                    $$.addChild($3);
                                                  }
;

INGRESO_PARAMETROS
  : EXPRESION INGRESO_PARAMETROS_                 {$2.addChildStart($1); $$ = $2;}
  |                                               {$$ = new Node('Parametros');}
;

INGRESO_PARAMETROS_     
  : ',' EXPRESION INGRESO_PARAMETROS_             {$3.addChildStart($2);$$ = $3; }
  |                                               {$$ = new Node('Parametros');}
;

//LLAMADA ARRAY -----------------------------------------------------------------

LLAMADA_ARRAY
  :  'identificador' POSICION_ARRAY               { $$ = new Node('Llamada Array', NodeType.INS_LLAMADA_ARRAY);
                                                    $$.setPosition(this._$.first_line, this._$.first_column);
                                                    $$.addChild(new Node($1, NodeType.IDENTIFICADOR));
                                                    $$.childs[0].setPosition(this._$.first_line, this._$.first_column);
                                                    $$.addChild($2);
                                                  }   
;

POSICION_ARRAY
  : POSICION_ARRAY  '[' EXPRESION ']'             { $1.addChild($3); }
  | '[' EXPRESION ']'                             { $$ = new Node('Posicion Array'); $$.addChild($2); $$.setPosition(this._$.first_line, this._$.first_column);}
;

/* ------  VALOR DE DATOS ------------------------------------------------------------------ */

//-----------------------------------------------------------------------------------------------
EXPRESION
  : '(' EXPRESION ')'             { $$ = $2; }

  //OPERACIONES ARITMETICAS
  | EXPRESION '+' EXPRESION       { $$ = new BinaryOperation($1, $3, $2); $$.setPosition(this._$.first_line, this._$.first_column);}
  | EXPRESION '-' EXPRESION       { $$ = new BinaryOperation($1, $3, $2); $$.setPosition(this._$.first_line, this._$.first_column);}
  | EXPRESION '*' EXPRESION       { $$ = new BinaryOperation($1, $3, $2); $$.setPosition(this._$.first_line, this._$.first_column);}
  | EXPRESION '/' EXPRESION       { $$ = new BinaryOperation($1, $3, $2); $$.setPosition(this._$.first_line, this._$.first_column);}
  | EXPRESION '**' EXPRESION      { $$ = new BinaryOperation($1, $3, $2); $$.setPosition(this._$.first_line, this._$.first_column);}
  | EXPRESION '%' EXPRESION       { $$ = new BinaryOperation($1, $3, $2); $$.setPosition(this._$.first_line, this._$.first_column);}
  | '-' EXPRESION %prec UMINUS    { $$ = new Node($1, NodeType.MINUS); $$.addChild($2); $$.setPosition(this._$.first_line, this._$.first_column);}    
  | '+' EXPRESION %prec UMINUS    { $$ = new Node($1, NodeType.PLUS); $$.addChild($2); $$.setPosition(this._$.first_line, this._$.first_column);}

  //RELACIONALES
  | EXPRESION '<' EXPRESION       { $$ = new Node($2, NodeType.MENOR_QUE); $$.addChild($1); $$.addChild($3); }
  | EXPRESION '>' EXPRESION       { $$ = new Node($2, NodeType.MAYOR_QUE); $$.addChild($1); $$.addChild($3); }
  | EXPRESION '<=' EXPRESION      { $$ = new Node($2, NodeType.MENOR_IGUAL); $$.addChild($1); $$.addChild($3); }
  | EXPRESION '>=' EXPRESION      { $$ = new Node($2, NodeType.MAYOR_IGUAL); $$.addChild($1); $$.addChild($3); }    
  | EXPRESION '===' EXPRESION     { $$ = new Node($2, NodeType.COMPARADOR_IGUAL); $$.addChild($1); $$.addChild($3); }
  | EXPRESION '==' EXPRESION      { $$ = new Node($2, NodeType.COMPARADOR_IGUAL); $$.addChild($1); $$.addChild($3); }
  | EXPRESION '!=' EXPRESION      { $$ = new Node($2, NodeType.NO_IGUAL); $$.addChild($1); $$.addChild($3); }
  | '!' EXPRESION                 { $$ = new Node($1, NodeType.NOT); $$.addChild($2); }

  //OPERADOR LOGICO
  | EXPRESION '||' EXPRESION      { $$ = new Node($2, NodeType.OR); $$.addChild($1); $$.addChild($3); $$.setPosition(this._$.first_line, this._$.first_column);}
  | EXPRESION '&&' EXPRESION      { $$ = new Node($2, NodeType.AND); $$.addChild($1); $$.addChild($3); $$.setPosition(this._$.first_line, this._$.first_column);}

  //INCREMENTO Y DECREMENTO
  | 'identificador' '+=' EXPRESION    { $$ = new Node($2, NodeType.INCREMENTO); 
                                        $$.addChild(new Node($1, NodeType.IDENTIFICADOR));                                          
                                        $$.childs[0].setPosition(this._$.first_line, this._$.first_column);  
                                        $$.addChild($3); 
                                      }   
  | 'identificador' '-=' EXPRESION    { $$ = new Node($2, NodeType.DECREMENTO); 
                                        $$.addChild(new Node($1, NodeType.IDENTIFICADOR));                                          
                                        $$.childs[0].setPosition(this._$.first_line, this._$.first_column);
                                        $$.addChild($3); 
                                      }   
  | 'identificador' '++'              { $$ = new Node($2, NodeType.INCREMENTO_UNARIO); 
                                        $$.addChild(new Node($1, NodeType.IDENTIFICADOR));                                          
                                        $$.childs[0].setPosition(this._$.first_line, this._$.first_column);
                                      }   
  | 'identificador' '--'              { $$ = new Node($2, NodeType.DECREMENTO_UNARIO); 
                                        $$.addChild(new Node($1, NodeType.IDENTIFICADOR));
                                        $$.childs[0].setPosition(this._$.first_line, this._$.first_column);
                                      }
  //OBTENER DATOS
  | EXPRESION '.' EXPRESION                 { $$ = new Node($2, NodeType.PROPIEDAD); 
                                              $$.addChild($1); 
                                              $$.addChild($3); 
                                              $$.setPosition(this._$.first_line, this._$.first_column); }
  | LLAMADA_FUNCION                         { $$ = $1; }
  | LLAMADA_ARRAY                           { $$ = $1; }
  | EXPRESION '?' EXPRESION ':' EXPRESION   { $$ = new Node('Operador\\nTernario', NodeType.INS_OP_TERNARIO); 
                                              $$.addChild($1); 
                                              $$.addChild($3); 
                                              $$.addChild($5); 
                                              $$.setPosition(this._$.first_line, this._$.first_column); }
  
  //DATOS COMPLEJOS
  | '[' DATO_ARRAY']'                       { $$ = $2; $$.setPosition(this._$.first_line, this._$.first_column);}
  | '{' DATO_TYPE '}'                       { $$ = $2; $$.setPosition(this._$.first_line, this._$.first_column);}
  | 'new' 'Array' '(' EXPRESION ')'         { $$ = new Node('New Array', NodeType.INS_NEW_ARRAY); 
                                              $$.addChild($4);
                                              $$.setPosition(this._$.first_line, this._$.first_column);}

  //DATOS PRIMITIVOS                   
  | 'numero'                      { $$ = new Number($1); $$.setPosition(this._$.first_line, this._$.first_column);}
  | 'decimal'                     { $$ = new Number($1); $$.setPosition(this._$.first_line, this._$.first_column);}
  | 'true'                        { $$ = new Bool('true'); $$.setPosition(this._$.first_line, this._$.first_column);}
  | 'false'                       { $$ = new Bool('false'); $$.setPosition(this._$.first_line, this._$.first_column);}
  | 'cadena_d'                    { $$ = new String($1); $$.setPosition(this._$.first_line, this._$.first_column);}
  | 'cadena_s'                    { $$ = new String($1); $$.setPosition(this._$.first_line, this._$.first_column);}
  | 'cadena_t'                    { $$ = new String($1); $$.setPosition(this._$.first_line, this._$.first_column);}
  | 'identificador'               { $$ = new Identifier($1); $$.setPosition(this._$.first_line, this._$.first_column);}
  | 'null'                        { $$ = new Null(); $$.setPosition(this._$.first_line, this._$.first_column);}
  | 'undefined'                   { $$ = new Null(); $$.setPosition(this._$.first_line, this._$.first_column);}
;

// Asignar valor a atributos types ------------------------------------------------------------------------------
DATO_TYPE
  : 'identificador' ':' EXPRESION OTRO_DATO_TYPE  { let info = new Node('Atributo');
                                                    info.addChild(new Node($1, NodeType.IDENTIFICADOR));                                                      
                                                    info.childs[0].setPosition(this._$.first_line, this._$.first_column);
                                                    info.addChild($3);
                                                    $4.addChild(info); $$=$4;
                                                  }
  //| error                                   {console.log("Error Sintactico datos type"+yytext)}
  |                                               { $$ = new Node('Object Type', NodeType.OBJ_TYPE);}
;

OTRO_DATO_TYPE
  : ',' DATO_TYPE                         {$$ = $2;}
  | ';' DATO_TYPE                         {$$ = $2;}
  |                                       {$$ = new Node('Object Type', NodeType.OBJ_TYPE);}
;

//DATOS ARRAY [dato1, dato2, dato3, ...] --------------------------------------------------------------
DATO_ARRAY
  : EXPRESION OTRO_VALOR                  {$2.addChildStart($1); $$=$2; }
  |                                       {$$ = new Node('Object Array', NodeType.OBJ_ARRAY);}
;

OTRO_VALOR
  : ',' EXPRESION OTRO_VALOR              {$3.addChildStart($2); $$=$3; }
  |                                       {$$ = new Node('Object Array', NodeType.OBJ_ARRAY);}
;

//Tipo de datos para constantes
CONSTANT
  : 'numero'                              {$$ = new Node($1, NodeType.NUMBER); $$.setPosition(this._$.first_line, this._$.first_column);}
  | 'cadena_d'                            {$$ = new Node($1, NodeType.STRING); $$.setPosition(this._$.first_line, this._$.first_column);}
  | 'cadena_s'                            {$$ = new Node($1, NodeType.STRING); $$.setPosition(this._$.first_line, this._$.first_column);}
  | 'cadena_t'                            {$$ = new Node($1, NodeType.STRING); $$.setPosition(this._$.first_line, this._$.first_column);}
  | 'identificador'                       {$$ = new Node($1, NodeType.IDENTIFICADOR); $$.setPosition(this._$.first_line, this._$.first_column);}
  | 'true'                                {$$ = new Node($1, NodeType.BOOLEAN); $$.setPosition(this._$.first_line, this._$.first_column);}
  | 'false'                                {$$ = new Node($1, NodeType.BOOLEAN); $$.setPosition(this._$.first_line, this._$.first_column);}
;

/* ------  SENTENCIA IF ------------------------------------------------------------------ */
IF
  : 'if' '(' EXPRESION ')' '{' BODY '}' ELSE_IF  { $$ = new Node("Instruccion if", NodeType.INS_IF)
                                                   $$.addChild($3);
                                                   $$.addChild($6);
                                                   $$.addChild($8);
                                                  }
  | 'if' error           { errorList.push(new AnalysisError('Token "'+yytext+'" no esperado.', ErrorType.SINTACTICO, this._$.first_line, this._$.first_column));
                           $$ = new Node('', NodeType.ERROR);}
;

ELSE_IF
  : 'else' ELSE_IF_BODY                      { $$ = $2;}
  |
; 
                      
ELSE_IF_BODY
  : 'if' '(' EXPRESION ')' '{' BODY '}' ELSE_IF   { $$ = new Node("Bloque else if", NodeType.INS_ELSE_IF)
                                                    $$.addChild($3);
                                                    $$.addChild($6);
                                                    $$.addChild($8);
                                                  }
  | '{' BODY '}'                                  { $$ = new Node("Bloque else", NodeType.INS_ELSE)
                                                    $$.addChild($2);
                                                  }
;

/* ------  SENTENCIA SWITCH ------------------------------------------------------------------ */

SWITCH
  : 'switch' '(' EXPRESION  ')' '{' CASE  DEFAULT '}'     { $$ = new Node("Instruccion Switch", NodeType.INS_SWITCH)
                                                            $$.addChild($3);
                                                            $$.addChild($6);
                                                            $$.addChild($7);
                                                          }   
;

CASE
  : 'case' CONSTANT ':'  BODY CASE                        { $$ = new Node("Bloque case", NodeType.INS_CASE)
                                                            $$.addChild($2);
                                                            $$.addChild($4);
                                                            $$.addChild($5);
                                                          } 
  |                                                       { $$ = null;}
;

DEFAULT
  : 'default' ':' BODY                                    { $$ = new Node("Bloque default", NodeType.INS_DEFAULT)
                                                            $$.addChild($3);
                                                          } 
  |                                                       { $$ = null; }
;

/* ------  SENTENCIA FOR ------------------------------------------------------------------ */

FOR
  : 'for' '(' EXPRESION_FOR ')' '{' BODY '}'  { $$ = new Node("Instruccion For", NodeType.INS_FOR)
                                                $$.addChild($3);
                                                $$.addChild($6);
                                              } 
;

VARIABLE_INICIO
  : DECLARACION                           { $$ = $1;}
  | 'identificador' '=' EXPRESION         { $$ = new Node('Asignacion', NodeType.INS_ASIGNACION);
                                            $$.addChild(new Node($1, NodeType.IDENTIFICADOR));
                                            $$.childs[0].setPosition(this._$.first_line, this._$.first_column);
                                            $$.addChild(new Node($2));
                                            $$.addChild($3);
                                          }
  | 'identificador'                       { $$ = new Node('Variable'); $$.setPosition(this._$.first_line, this._$.first_column);
                                            $$.addChild( new Node($1, NodeType.IDENTIFICADOR));
                                            $$.code = $1;
                                          }
  |                                       { $$ = new Node('null'); }
;


EXPRESION_FOR
  : VARIABLE_INICIO ';' EXPRESION ';' EXPRESION       { $$ = new Node("Expresion for");
                                                       $$.addChild($1);
                                                       $$.addChild($3);
                                                       $$.addChild($5);
                                                      }
  | 'let' 'identificador' 'in' EXPRESION              { $$ = new Node("Expresion In");
                                                        $$.addChild(new Node($1));
                                                        $$.addChild(new Node($2, NodeType.IDENTIFICADOR));
                                                        $$.childs[1].setPosition(this._$.first_line, this._$.first_column + 4);
                                                        $$.addChild($4);
                                                      }
  | 'let' 'identificador' 'of' EXPRESION              { $$ = new Node("Expresion Of");
                                                        $$.addChild(new Node($1));
                                                        $$.addChild(new Node($2, NodeType.IDENTIFICADOR));                                                          
                                                        $$.childs[1].setPosition(this._$.first_line, this._$.first_column + 4);
                                                        $$.addChild($4);
                                                      }
  | 'identificador' 'in' EXPRESION                    { $$ = new Node("Expresion In");
                                                        $$.addChild(new Node($1, NodeType.IDENTIFICADOR));                                                          
                                                        $$.childs[0].setPosition(this._$.first_line, this._$.first_column);
                                                        $$.addChild($3);
                                                      }
  | 'identificador' 'of' EXPRESION                    { $$ = new Node("Expresion Of");
                                                        $$.addChild(new Node($1, NodeType.IDENTIFICADOR));                                                                                                                    
                                                        $$.childs[0].setPosition(this._$.first_line, this._$.first_column);
                                                        $$.addChild($3);
                                                      }
;

/* ------  WHILE ------------------------------------------------------------------ */
WHILE
  : 'while' '(' EXPRESION ')' '{' BODY '}'            { $$ = new Node("Instruccion\\n While", NodeType.INS_WHILE)
                                                        $$.addChild($3);
                                                        $$.addChild($6);
                                                      } 
;

/* ------  DO WHILE ------------------------------------------------------------------ */
DO_WHILE
  : 'do' '{' BODY '}' 'while' '(' EXPRESION ')' FIN           { $$ = new Node("Instruccion\\n Do While", NodeType.INS_DO_WHILE)
                                                                $$.addChild($3);
                                                                $$.addChild($7);
                                                              } 
;

/* ------  TYPE ------------------------------------------------------------------ */
TYPE
  : 'type' 'identificador' '=' '{' BODY_TYPE '}' FIN          { $$ = new Node("Type", NodeType.INS_TYPE);
                                                                $$.addChild(new Node($2, NodeType.IDENTIFICADOR));
                                                                $$.childs[0].setPosition(this._$.first_line, this._$.first_column+6);
                                                                $$.addChild(new Node($3));
                                                                $$.addChild($5);
                                                              } 
;

BODY_TYPE
  : 'identificador' ':' DATO OTRO_ATRIBUTO                    { let aux2 = new Node('Atributo');
                                                                aux2.addChild(new Node($1, NodeType.IDENTIFICADOR));                                                          
                                                                aux2.childs[0].setPosition(this._$.first_line, this._$.first_column);
                                                                aux2.addChild($3); $4.addChildStart(aux2); $$ = $4;
                                                                $$.code = $1 +':'+$3.code + $4.code;
                                                              }
  //| error                                                   {console.log("Error Sintactico Declaracion type:" + yytext)}
  |                                                           { $$ = new Node('Atributos');}
;

OTRO_ATRIBUTO
  : ',' BODY_TYPE                                             {$$ = $2; $$.code = ', '+$2.code;}
  | BODY_TYPE                                                 {$$ = $1}
;

/* ------  RETURN  ------------------------------------------------------------------ */

RETURN 
  : 'return' EXPRESION FIN    { $$ = new Node('Return', NodeType.INS_RETURN);  $$.addChild($2); $$.setPosition(this._$.first_line, this._$.first_column);}
  | 'return' FIN              { $$ = new Node('Return', NodeType.INS_RETURN); $$.setPosition(this._$.first_line, this._$.first_column);}
;

/*  ---- FUNCIONES NATIVAS --------------------------------------------------------- */
CONSOLE //Imprimir parametros
  : 'console' '.' 'log' '(' INGRESO_PARAMETROS ')' FIN        { $$ = new CallFunction('console.log', $5); $$.setPosition(this._$.first_line, this._$.first_column); }
;