import { DataType } from "./DataType";
import { Position } from "./Position";
import { AnalysisError, ErrorType } from "./Error";

export class Value extends Position{

    protected _type:DataType;
    protected _value:any;

    constructor(value:any, row:number=0, col:number=0, type:DataType=DataType.UNDEFINED){
        super(row, col);
        this._type = type;
        this._value = (type === DataType.UNDEFINED ? undefined: value);
    }

    public toString = ():string => {
        switch(this._type){
            case DataType.NUMBER:
            case DataType.STRING:
            case DataType.BOOL:
            case DataType.UNDEFINED:
                return ''+this._value;
            default: return '';
        }
    }

    //#region SETTERS Y GETTERS **********************************************************************
    public setValue(value:Value):void{
        this._value = value.value;
        this._type = value.type;
    }

    public set type(type:DataType){ this._type = type; }
    public get type(){ return this._type }

    public set value(value:any){ this._value = value; }
    public get value(){ return this._value }
    //#endregion

    //#region VERIFICAR TIPO DE DATO *****************************************************************
    public typeToStr = ():string => DataType[this._type];
    public isNumber = ():boolean => this._type === DataType.NUMBER;
    public isBool = ():boolean => this._type === DataType.BOOL;
    public isString = ():boolean => this._type === DataType.STRING;
    public isUndefined = ():boolean => this._type === DataType.UNDEFINED;
    public isArray = ():boolean => this._type === DataType.ARRAY;
    public isStruct = ():boolean => this._type === DataType.STRUCT;
    public isAny = ():boolean => this._type === DataType.ANY;
    //#endregion

    //#region METODOS PARA ARRAYS ********************************************************************
    public get arraySize():number{
        if(this._type !== DataType.ARRAY) throw new AnalysisError("Tipo de dato no es array.", ErrorType.SEMANTICO, this);
        if(!this._value) return 0;
        return this._value.length;
    }
    //#endregion
}