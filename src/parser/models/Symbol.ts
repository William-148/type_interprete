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

    constructor(id:string, value:any, type:DataType, isConst:boolean=false){
        super(value, 0, 0, type);
        this._id=id;
        this._isConst=isConst;
    }

    public get id():string { return this._id; }
    public set id(id:string) { this._id=id; }
    public get isConst():boolean { return this._isConst }

    public setValue(value: any, type: DataType): void {
        this._value = value;
        if(type !== DataType.ANY && type !== DataType.UNDEFINED)
            this.type = type;
    }

    /**
     * Verifica si es posible asignarle un valor a un simbolo por su tipo de dato
     * @param value Valor a asignar al simbolo
     * @returns boolean
     */
    public isAssignable(value:Value):boolean{
        return this.isUndefined() || this.isAny() || this._type === value.type;
    }
}

