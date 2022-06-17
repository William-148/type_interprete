import { Symbol } from "./Symbol";
import { DataType } from "./DataType";
import { AnalysisError, ErrorType } from "./Error";
import { Value } from "./Value";
import { Position } from "./Position";

interface HashTable<T> {
    [key: string]: T;
}

/**
 * Esta clase representa la tabla de simbolos
 * - Parametros de funciones son creados sin importar si 
 *   existen en ambitos padres
 * - Dentro de una funcion, una variable es buscada primero en el 
 *   ambito actual, si no existe se busca en ambitos padres
 * - Las variables solo toman en cuenta el nombre de las
 *   funciones cuando se está en el ambito raiz, sinó no importa
 */
export class SymbolTable {
    private _parent:SymbolTable|null;
    private _symbols:HashTable<Symbol>;

    constructor(parent:SymbolTable|null=null){
        this._parent=parent;
        this._symbols={};
    }

    public get parent():SymbolTable|null { return this._parent; }
    public get symbols():HashTable<Symbol> { return this._symbols; }

    /**
     * Actualiza un simbolo si existe en entorno actual o padres,
     * retorna True si actualizó, False si no.
     * @throws AnalysisError
     */
    private currentUpdate(symbol:Symbol, recursive:boolean=true):boolean{
        // Buscando simbolo en entorno actual
        const finded = this._symbols[symbol.id];
        if(!!finded) {
            // Verificar que no sea constante
            if(finded.isConst) throw new AnalysisError(
                `No se puede actualizar una constante: "${symbol.id}".`,
                ErrorType.SEMANTICO, symbol
            );
            // Verificar el tipo de dato
            if(!finded.isAssignable(symbol)) throw new AnalysisError(
                `"${symbol.typeToStr()}" no es asignable a "${finded.typeToStr()}".`,
                ErrorType.SEMANTICO, symbol
            );
            // Se actualiza el simbolo
            this._symbols[symbol.id] = symbol;
            return true;
        }
        // Buscando simbolo en entorno padre
        if(!this._parent || !recursive) return false;
        return this._parent.currentUpdate(symbol);
    }

    /**
     * Busca un identificador en entorno actual y padres.
     * @param id Identificador del simbolo
     */
     public find(id:string):Symbol|null {
        // Buscando simbolo en entorno actual
        const symbol = this._symbols[id];
        if(!!symbol) return symbol;
        // Buscando simbolo en entorno padre
        if(!this._parent) return null;
        return this._parent.find(id);
    }

    /**
     * Verifica si la variable exise en éste ambito
     * Si no existe en el ambito actual, busca en los
     * ambitos padres, sino encuentra el simbolo, agrega
     * el nuevo simbolo al ámbito actual.
     * @throws AnalysisError
     */
    public update(id:string, idPosition:Position, value:Value):void{
        const symbol:Symbol|null = this.find(id);
        // Si el simbolo no existe, lanzar error
        if(!symbol) throw new AnalysisError(
            `La variable: "${id}" no ha sido declarada.`,
            ErrorType.SEMANTICO, idPosition
        );
        // Verificar que no sea constante
        if(symbol.isConst) throw new AnalysisError(
            `No se puede cambiar el valor de una constante: "${symbol.id}".`,
            ErrorType.SEMANTICO, idPosition
        );
        // Verificar el tipo de dato
        if(!symbol.isAssignable(value)) throw new AnalysisError(
            `"${value.typeToStr()}" no es asignable a "${symbol.symbolTypeTxt}".`,
            ErrorType.SEMANTICO, idPosition
        );
        // Se actualiza el simbolo
        symbol.setValue(value);
    }

    /**
     * Crea una variable o constante en el ambito actual
     * @throws AnalysisError
     */
    public declare(id:string, value:Value, symbolType:DataType, isConstat:boolean):void{
        const symbol = new Symbol(id, value, symbolType, isConstat);
        symbol.setPosition(value);
        // Verificar el tipo de dato
        if(!symbol.isAssignable(value)) throw new AnalysisError(
            `"${value.typeToStr()}" no es asignable a "${symbol.symbolTypeTxt}".`,
            ErrorType.SEMANTICO, value
        );

        // Buscando simbolo en entorno actual
        const finded = this._symbols[symbol.id];
        if(!!finded) throw new AnalysisError(
            `"${symbol.id}" ya ha sido declarado en el entorno actual.`,
            ErrorType.SEMANTICO, value
        );
        // Agregamos el simbolo
        this._symbols[id] = symbol;
    }
}