import { DataType } from "./DataType";
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

    constructor(id:string, value:Value, symbolType:DataType, isConst:boolean=false){
        super(value.value, 0, 0, value.type);
        this._id=id;
        this._isConst=isConst;
        this._symbolType = (symbolType === DataType.ANY && !value.isUndefined())? value.type : symbolType;
    }

    public get id():string { return this._id; }
    public set id(id:string) { this._id=id; }
    public get isConst():boolean { return this._isConst }
    public get acceptAny():boolean { return this._symbolType === DataType.ANY;}
    public get symbolTypeTxt():string { return DataType[this._symbolType]; }

    /**
     * Verifica si es posible asignarle un valor a un simbolo por su tipo de dato
     * @param value Valor a asignar al simbolo
     * @returns boolean
     */
     public isAssignable(value:Value):boolean{
        return this.acceptAny || value.isUndefined() || this._symbolType === value.type;
    }
}

