import { Node } from '../models/Node';
import { NodeType } from '../models/NodeType';
import { SymbolTable } from '../models/SymbolTable';
import { Value } from '../models/Value';
import { DataType } from '../models/DataType';

// CLASE OPERACIONES BINARIAS ************************************************************************
export class ArrayStructure extends Node{
    private _elements:Array<Node>;

    constructor(elements:Array<Node>){
        super('Array', NodeType.ARRAY_STRUCTURE);
        this._elements = elements;
    }

    public getChilds():Node[]{
        return this._elements;
    }

    public run (st: SymbolTable):Value{
        const arrayValue = new Value([], this._position, DataType.ARRAY);
        for(let element of this._elements){
            const current:Value = element.run(st);
            arrayValue.addArrayElement(current);
        }
        return arrayValue;
    }
}