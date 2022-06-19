export enum DataType{
    // Basicos ##################
    UNDEFINED,
    NUMBER,
    BOOL,
    STRING,
    ANY,

    // Compuestos ##################
    ARRAY,
    STRUCT
}

export const StringType = (type:DataType):string => {
    switch(type){
        case DataType.NUMBER: return "number";
        case DataType.BOOL: return "boolean";
        case DataType.STRING: return "string";
        case DataType.ANY: return "any";
        case DataType.ARRAY: return "array";
        case DataType.STRUCT: return "type";
        default: return "undefined";
    }
}