import { Node } from '../models/Node';
import { IRunner } from "../models/IRunner";
import { NodeType } from '../models/NodeType';
import { SymbolTable } from '../models/SymbolTable';
import { Value } from '../models/Value';
import { DataType } from '../models/DataType';
import { AnalysisError, ErrorType } from '../models/Error';
import { Display } from '../models/Display';

// CLASE OPERACIONES BINARIAS ************************************************************************
export class BinaryOperation extends Node implements IRunner{
    constructor(exp1:Node, exp2:Node, operator:string){
        super(operator, NodeType.OP_BINARY);
        this.addChild(exp1);
        this.addChild(exp2);
    }

    public run (st: SymbolTable):Value{
        // Obteniendo expresiones
        let exp1:IRunner = this.childs[0];
        let exp2:IRunner = this.childs[1];

        // Obteniendo valores de las expresiones
        let val1:Value = exp1.run(st);
        let val2:Value = exp2.run(st);

        try{
            let result:Value = this.binaryOperation(val1, val2, this.name);
            result.setPosition(this);
            return result;
        }catch(error){
            Display.error(error);
            return new Value('', this.row, this.col);
        }
    }

    //#region OPERACIÓN BINARIA **********************************************************************
    /**
     * @returns Objeto Value que contiene el resultado de la operación
     * @throws AnalysisError
     */
     private binaryOperation(val1:Value, val2:Value, operation:string):Value{
        // Operación Número-Número
        if(val1.isNumber() && val2.isNumber()){
            const result:number = this.numericalOperation(val1, val2, operation);
            return new Value(result, 0, 0, DataType.NUMBER);
        }
        // Operación con String
        if((val1.isString() || val2.isString()) && operation === '+'){
            return new Value(val1.value + val2.value, 0, 0, DataType.STRING);
        }
        throw new AnalysisError(
            `Operación "${operation}" no se puede realizar entre ${val1.typeToStr()}-${val2.typeToStr()}`,
            ErrorType.SEMANTICO, this
        );
    }

    private numericalOperation(val1:Value, val2:Value, operation:string):number{
        switch(operation){
            case "+": return val1.value + val2.value;
            case "-": return val1.value - val2.value;
            case "/": return val1.value / val2.value;
            case "*": return val1.value * val2.value;
            case "%": return val1.value % val2.value;
            case "**": return val1.value ** val2.value;
            default: return 0;
        }
    }
    //#endregion
}