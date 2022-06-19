import { Node } from '../models/Node';
import { NodeType } from '../models/NodeType';
import { SymbolTable } from '../models/SymbolTable';
import { Value } from '../models/Value';

export class SingleLine extends Node {
    private expression:Node;
    constructor(expression:Node){
        super("Expresion", NodeType.INS_EXPRESION);
        this.expression = expression;
    }
    
    public run(st: SymbolTable):Value{
        return this.expression.run(st);
    }
    
    getChilds():Node[]{
        return [this.expression];
    }
}


