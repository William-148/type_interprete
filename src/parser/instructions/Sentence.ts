import { IRunner } from '../models/IRunner';
import { Node } from '../models/Node';
import { NodeType } from '../models/NodeType';
import { SymbolTable } from '../models/SymbolTable';
import { Value } from '../models/Value';

export class Sentence extends Node implements IRunner{
    constructor(){
        super("Sentencias", NodeType.SENTENCE);
    }

    public run (st: SymbolTable):Value{
        this._childs.forEach((item)=>{
            item.run(st);
        });
        return new Value('');
    }
}


