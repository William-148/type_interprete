import { DataType, StringType } from "./DataType";
import { Value } from "./Value";

/**
 * Permite almacenar el valor, tipo de dato, si es variable o constante, de un symbolo.
 * @field id:string Guarda el identificador del simbolo.
 * @field isConst:boolean Determina si un simbolo es constante o variable.
 */
export class Symbol extends Value {
    private _id:string;
    private _isConst:boolean;
    private _symbolType:DataType;

    constructor(id:string, symbolType:DataType, isConst:boolean=false){
        super(undefined, null, DataType.UNDEFINED);
        this._id=id;
        this._isConst=isConst;
        this._symbolType = symbolType;
    }

    public get id():string { return this._id; }
    public set id(id:string) { this._id=id; }
    public get isConst():boolean { return this._isConst }
    public get acceptAny():boolean { return this._symbolType === DataType.ANY; }
    public get symbolIsArray():boolean { return this._symbolType === DataType.ARRAY; }
    public get symbolTypeTxt():string { 
        if(this.symbolIsArray) return `Array${this._arrayLevel>1?"("+this.arrayLevel+")":''}<${StringType(this._arrayType)}>`;
        return StringType(this._symbolType); 
    }

    public setValue(value:Value):void{
        this._value = value.value;
        this._type = value.type;
        this._arrayType = value.arrayType;
        this._arrayLevel = value.arrayLevel;
        this._symbolType = (this._symbolType === DataType.ANY && !value.isUndefined)? value.type : this._symbolType;
    }

    /**
     * Verifica si es posible asignarle un valor a un simbolo por su tipo de dato
     * @param value Valor a asignar al simbolo
     * @returns boolean
     */
     public isAssignable(value:Value):boolean{
        if(this.acceptAny) return true;
        if(this.symbolIsArray) return this._arrayLevel === value.arrayLevel && this._arrayType === value.arrayType;
        return value.isUndefined || this._symbolType === value.type;
    }
}

