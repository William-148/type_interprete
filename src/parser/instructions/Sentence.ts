import { Node } from '../models/Node';
import { NodeType } from '../models/NodeType';
import { SymbolTable } from '../models/SymbolTable';
import { Value } from '../models/Value';

export class Sentence extends Node {
    private list:Array<Node>;
    
    constructor(){
        super("Sentencias", NodeType.SENTENCE);
        this.list = [];
    }

    public add(sentence:Node):void{
        this.list.push(sentence);
    }
    
    run(st: SymbolTable):Value{
        this.list.forEach((item)=> item.run(st) );
        return new Value('');
    }
    
    getChilds():Node[]{ return this.list; }
}


