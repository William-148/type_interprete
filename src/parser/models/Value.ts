import { DataType, StringType } from "./DataType";
import { Position } from "./Position";
import { AnalysisError, ErrorType } from "./Error";

export class Value{

    protected _type:DataType;
    protected _value:any;
    protected _position:Position;

    constructor(value:any, position:Position|null=null, type:DataType=DataType.UNDEFINED){
        this._type = type;
        this._value = (type === DataType.UNDEFINED ? undefined: value);
        this._position = !!position ? position : new Position();
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

    // Position **************************************************************************************
    public set position(position:Position) { this._position.setPosition(position); }
    public get position() { return this._position; }
    public setRowCol(row:number, col:number):void{ this.position.row = row; this.position.col = col;}

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
    public get typeStr():string { return StringType(this._type); }
    public get isNumber():boolean { return this._type === DataType.NUMBER; }
    public get isBool():boolean { return this._type === DataType.BOOL; }
    public get isString():boolean { return this._type === DataType.STRING; }
    public get isUndefined():boolean { return this._type === DataType.UNDEFINED; }
    public get isArray():boolean { return this._type === DataType.ARRAY; }
    public get isStruct():boolean { return this._type === DataType.STRUCT; }
    public get isAny():boolean { return this._type === DataType.ANY; }
    //#endregion

    //#region METODOS PARA ARRAYS ********************************************************************
    public get arraySize():number{
        if(this._type !== DataType.ARRAY) throw new AnalysisError("Tipo de dato no es array.", ErrorType.SEMANTICO, this._position);
        if(!this._value) return 0;
        return this._value.length;
    }
    //#endregion
}