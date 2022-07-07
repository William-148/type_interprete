import { DataType, StringType } from "./DataType";
import { Position } from "./Position";
import { AnalysisError, ErrorType } from "./Error";

export class Value{

    protected _type:DataType;
    protected _value:any;
    protected _position:Position;
    protected _arrayLevel:number;
    protected _arrayType:DataType;

    constructor(value:any, position:Position|null=null, type:DataType=DataType.UNDEFINED){
        this._type = type;
        this._value = (type === DataType.UNDEFINED ? undefined: value);
        this._position = !!position ? position : new Position();
        this._arrayLevel = (type === DataType.ARRAY ? 1 : 0);
        this._arrayType = DataType.UNDEFINED;
    }

    //#region CAST VALUE TO STRING ******************************************************************
    public toString = ():string => {
        switch(this._type){
            case DataType.NUMBER:
            case DataType.STRING:
            case DataType.BOOL:
            case DataType.UNDEFINED:
                return ''+this._value;
            case DataType.ARRAY:
                return this.arrayString();
            default: return '';
        }
    }

    private arrayString():string{
        let stringValue = '[';
        for(let element of this._value){
            stringValue += (stringValue.length !== 1 ? ', ': '') + element;
        }
        return stringValue + ']';
    }
    //#endregion

    // Position **************************************************************************************
    public set position(position:Position) { this._position.setPosition(position); }
    public get position() { return this._position; }
    public setRowCol(row:number, col:number):void{ this._position.row = row; this._position.col = col;}

    //#region SETTERS Y GETTERS **********************************************************************
    public setValue(value:Value):void{
        this._value = value.value;
        this._type = value.type;
        this._arrayType = value.arrayType;
        this._arrayLevel = value.arrayLevel;
    }

    public set type(type:DataType){ this._type = type; }
    public get type(){ return this._type }

    public set value(value:any){ this._value = value; }
    public get value(){ return this._value }

    public get arrayLevel(){ return this._arrayLevel; }
    public set arrayLevel(arrayLevel:number){ this._arrayLevel = arrayLevel; }
    public get arrayType(){ return this._arrayType; }
    public set arrayType(arrayType:DataType){ this._arrayType = arrayType; }
    //#endregion

    //#region VERIFICAR TIPO DE DATO *****************************************************************
    public get typeStr():string { 
        if(this.isArray) return `Array${this._arrayLevel>1?"("+this.arrayLevel+")":''}<${StringType(this._arrayType)}>`;
        return StringType(this._type); 
    }
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
        if(this._type !== DataType.ARRAY) throw new AnalysisError(
                "Tipo de dato no es array.", 
                ErrorType.SEMANTICO, this._position
            );
        if(!this._value) return 0;
        return this._value.length;
    }

    /**
     * Valida si los elementos a ingresar tiene el tipo de dato aceptado. 
     * Si el elemento es array, valida que las dimensiones sean las correctas.
     * @param element Elemento a insertar.
     */
    private validateArrayType(element:Value):void{
        if(element.isArray){
            // Valida si el tipo de dato del array sean los mismos
            if(this._arrayType !== element.arrayType) this._arrayType = DataType.ANY;
            // Valida si la dimension del array es la correcta
            if(this._arrayLevel !== element.arrayLevel + 1) this._arrayLevel = 1;
        }
        else{
            /**
             * Si la dimension del array es mayor a uno, quiere decir 
             * que se intenta agregar un elemento que no es array cuando
             * lo ideal es que se reciba un array de cierta dimension.
             * Por ello se acepta el dato, pero se cambia la dimension a 1.
             */
            if(this._arrayLevel > 1) this._arrayLevel = 1;
            // Valida si el tipo de datos aceptado sea el mismo al elemento a insertar
            if(this._arrayType !== element.type) this._arrayType = DataType.ANY;
        }
    }

    public addArrayElement(element:Value):void{
        // Aun no hay elementos en el array
        if(this._arrayType === DataType.UNDEFINED){
            this._arrayType = (element.isArray ? element.arrayType : element.type);
            this._arrayLevel += (element.isArray ? element.arrayLevel : 0);
        }
        // Ya existen elementos en el array
        else this.validateArrayType(element);

        //Agregando elemento al array
        this._value.push(element);
    }
    //#endregion
}