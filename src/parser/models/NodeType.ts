
export enum NodeType{
    //Tipo de varialbe
    VARIABLE,
    CONSTANTE,

    //Tipo de Dato
    DATA_TYPE,//*
    NUMBER,//*
    DECIMAL,
    STRING,//*
    IDENTIFICADOR,//*
    BOOLEAN,//*
    OBJ_ARRAY,
    OBJ_TYPE,
    NULL,

    //Tipo de operaciones Numericas*
    SUMA,
    RESTA,
    MINUS,
    PLUS,
    MULTIPLICACION,
    DIVISION,
    MODULO,
    POTENCIA,
    INCREMENTO,
    DECREMENTO,
    INCREMENTO_UNARIO,
    DECREMENTO_UNARIO,

    //Tipo de operaciones comparativas*
    MAYOR_QUE,
    MENOR_QUE,
    MAYOR_IGUAL,
    MENOR_IGUAL,
    NO_IGUAL,
    COMPARADOR_IGUAL,
    
    //Tipo de operaciones Logicas*
    NOT,
    AND,
    OR,
    
    //Tipo de instrucciones *
    INS_FUNCION,
    INS_LLAMADA_FUNCION,
    INS_LLAMADA_ARRAY,
    INS_NEW_ARRAY,
    INS_OP_TERNARIO,
    INS_DECLARACION,
    INS_DEC_ASIGN,
    INS_ASIGNACION,
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
    INS_EXPRESION,

    //--
    PROPIEDAD,
    ERROR,//*
    UNDEFINED,//*

    //NEWS
    OP_BINARY

}