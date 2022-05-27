import { DataType } from "./DataType";
import { AnalysisError, ErrorType } from "./Error";

export class Value {

    private _type:DataType;
    private _value:any;
    private _row:number;
    private _col:number;

    constructor(value:any, row:number=0, col:number=0, type:DataType=DataType.UNDEFINED){
        this._type = type;
        this._row = row;
        this._col = col;
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
    public setValue(value:any, type:DataType):void{
        this._value = value;
        this._type = type;
    }

    public setPosition(row:number, col:number):void{
        this._col = col;
        this._row = row;
    }

    public set type(type:DataType){ this._type = type; }
    public get type(){ return this._type }

    public set value(value:any){ this._value = value; }
    public get value(){ return this._value }

    public set row(row:number) { this._row = row; }
    public get row() { return this._row; }

    public set col(col:number) { this._col = col; }
    public get col() { return this._col; }
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
        if(this._type !== DataType.ARRAY) throw new AnalysisError("Tipo de dato no es array.", ErrorType.SEMANTICO, this._row, this._col);
        if(!this._value) return 0;
        return this._value.length;
    }
    //#endregion
}