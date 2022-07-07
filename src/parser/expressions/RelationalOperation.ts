import { Node } from '../models/Node';
import { NodeType } from '../models/NodeType';
import { SymbolTable } from '../models/SymbolTable';
import { Value } from '../models/Value';
import { DataType } from '../models/DataType';
import { AnalysisError, ErrorType } from '../models/Error';
import { Display } from '../models/Display';

// CLASE OPERACIONES RELACIONALES ************************************************************************
export class RelationalOperation extends Node{
    private leftExpression:Node;
    private rightExpression:Node;

    constructor(exp1:Node, exp2:Node, operator:string){
        super(operator, NodeType.OP_RELATIONAL);
        this.leftExpression = exp1;
        this.rightExpression = exp2;
    }

    public getChilds():Node[]{
        return [this.leftExpression, this.rightExpression];
    }

    public run (st: SymbolTable):Value{
        // Obteniendo valores de las expresiones
        let val1:Value = this.leftExpression.run(st);
        let val2:Value = this.rightExpression.run(st);

        try{
            let result:Value = this.relationalOperation(val1, val2);
            result.position = this._position;
            return result;
        }catch(error){
            Display.error(error);
            return new Value('', this._position);
        }
    }

    /**
     * @returns Objeto Value que contiene el resultado de la operación
     * @throws AnalysisError
     */
     private relationalOperation(val1:Value, val2:Value):Value{
        // Operación Número-Número
        if(val1.type === val2.type || val1.isUndefined || val2.isUndefined){
            const result:boolean = this.operation(val1, val2);
            return new Value(result, val1.position, DataType.BOOL);
        }
        throw new AnalysisError(
            `Operación "${this.name}" no se puede realizar entre ${val1.typeStr}-${val2.typeStr}`,
            ErrorType.SEMANTICO, this._position
        );
    }

    private operation(val1:Value, val2:Value):boolean{
        switch(this.name){
            case "<": return val1.value < val2.value;
            case ">": return val1.value > val2.value;
            case "<=": return val1.value <= val2.value;
            case ">=": return val1.value >= val2.value;
            case "===": return val1.value === val2.value;
            case "==": return val1.value == val2.value;
            case "!=": return val1.value != val2.value;
            case "!==": return val1.value !== val2.value;
            default: return false;
        }
    }
}