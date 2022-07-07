import { Node } from '../models/Node';
import { NodeType } from '../models/NodeType';
import { SymbolTable } from '../models/SymbolTable';
import { Value } from '../models/Value';
import { DataType } from '../models/DataType';
import { AnalysisError, ErrorType } from '../models/Error';
import { Display } from '../models/Display';

// CLASE OPERACIONES RELACIONALES ************************************************************************
export class LogicOperation extends Node{
    private leftExpression:Node;
    private rightExpression:Node;

    constructor(exp1:Node, exp2:Node, operator:string){
        super(operator, NodeType.OP_LOGIC);
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
            let result:Value = this.logicOperation(val1, val2);
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
    private logicOperation(val1:Value, val2:Value):Value{
        switch(this.name){
            case "||":
                if(!!val1.value) return val1;
                return val2;
            case "&&":
                let result = false;
                if(val1.value && val2.value) result = true;
                return new Value(result, val1.position, DataType.BOOL);
            default: return new Value('', val1.position);
        }
    }
}