import { IRunner } from "../models/IRunner";
import { Node } from "../models/Node";
import { NodeType } from "../models/NodeType";
import { Value } from "../models/Value";
import { SymbolTable } from "../models/SymbolTable";


/**
 * Permite la manipulación de las asignaciones a variables
 */
 export class Assign extends Node implements IRunner{

    /**
     * @param variable Nodo que contiene estructura la cual se le asignará un valor 
     * @param value Nodo que contiene el valor a ser asignado
     * @param dataType Tipo de dato que per
     */
    constructor(variable:Node, value:Node, dataType:Node|null=null){
        super("Asignación", NodeType.INS_ASIGNACION);
        this.addChild(variable);
        this.addChild(value);
        if(!!dataType) this.addChild(dataType);
    }

    public run(st: SymbolTable):Value{
         return new Value('');
    }

}