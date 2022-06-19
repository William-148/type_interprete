import { Node } from "../models/Node";
import { NodeType } from "../models/NodeType";
import { Value } from "../models/Value";
import { SymbolTable } from "../models/SymbolTable";
import { Display } from "../models/Display";
import { AnalysisError, ErrorType } from "../models/Error";


/**
 * Permite la manipulación de las asignaciones a variables
 */
 export class Assign extends Node{
    private variable:Node;
    private expression:Node;

    /**
     * @param variable Nodo que contiene estructura la cual se le asignará un valor 
     * @param value Nodo que contiene el valor a ser asignado
     * @param dataType Tipo de dato que per
     */
    constructor(variable:Node, value:Node){
        super("Asignación", NodeType.INS_ASSIGNMENT);
        this.variable = variable;
        this.expression = value;
    }

    public run(st: SymbolTable):Value{
        try{
            const toAssing:Value = this.expression.run(st);
            if(this.variable.isIdentifier){
                st.update(this.variable.name, this.variable.position, toAssing);
            }
            else{
                Display.error(
                    new AnalysisError(
                        'Solo se puede asignar valor a una variable, array o type',
                        ErrorType.SEMANTICO,
                        this.variable.position
                    )
                );
            }
        }catch(error){
            Display.error(error);
        }
        return new Value('');
    }

    public getChilds():Node[]{ return [this.variable, this.expression]}

}