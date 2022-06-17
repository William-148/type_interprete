import { IRunner } from "../models/IRunner";
import { Node } from "../models/Node";
import { NodeType } from "../models/NodeType";
import { Value } from "../models/Value";
import { SymbolTable } from "../models/SymbolTable";
import { Display } from "../models/Display";
import { AnalysisError, ErrorType } from "../models/Error";


/**
 * Permite la manipulación de las asignaciones a variables
 */
 export class Assign extends Node implements IRunner{

    /**
     * @param variable Nodo que contiene estructura la cual se le asignará un valor 
     * @param value Nodo que contiene el valor a ser asignado
     * @param dataType Tipo de dato que per
     */
    constructor(variable:Node, value:Node){
        super("Asignación", NodeType.INS_ASIGNACION);
        this.addChild(variable);
        this.addChild(value);
    }

    public run(st: SymbolTable):Value{
        const variable:Node = this._childs[0];
        const expression:IRunner = this._childs[1];
        try{
            const toAssing = expression.run(st);
            if(variable.type === NodeType.IDENTIFICADOR){
                st.update(variable.name, variable, toAssing);
            }
            else{
                Display.error(
                    new AnalysisError(
                        'Solo se puede asignar valor a una variable, array o type',
                        ErrorType.SEMANTICO,
                        variable
                    )
                );
            }
        }catch(error){
            Display.error(error);
        }
        return new Value('');
    }

}