
export enum NodeType{
    //Tipo de varialbe
    VARIABLE,
    CONSTANTE,

    //Tipo de Dato
    DATA_TYPE,
    NUMBER,//############
    STRING,//############
    IDENTIFIER,//############
    BOOLEAN,//############
    ARRAY_STRUCTURE,//############
    OBJ_TYPE,
    
    //Tipo de instrucciones *
    INS_FUNCION,
    INS_CALL_FUNCTION,//############
    INS_LLAMADA_ARRAY,
    INS_NEW_ARRAY,
    INS_OP_TERNARIO,
    INS_DECLARATION,//############
    INS_DEC_ASIGN,
    INS_ASSIGNMENT,//############
    INS_IMPRIMIR,
    INS_WHILE,
    INS_DO_WHILE,
	INS_IF,
    INS_ELSE_IF,
    INS_ELSE,
	INS_FOR,
	INS_SWITCH,
	INS_CASE,
    INS_DEFAULT,
    INS_BREAK,
    INS_CONTINUE,
    INS_RETURN,
    INS_TYPE,
    INS_GRAPH,
    INS_EXPRESION,//############

    //--
    PROPIEDAD,
    ERROR,//############
    UNDEFINED,//############

    //NEWS
    SENTENCE,//############
    OP_BINARY,//############
    OP_RELATIONAL,//############
    OP_LOGIC,//############
    DT_STRING,//############
    DT_BOOLEAN,//############
    DT_NUMBER,//############
    DT_IDENTIFIER,//############
    DT_ARRAY,//############
    LIST_EXPRESSION,//############

}