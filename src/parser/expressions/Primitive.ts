import { Node } from '../models/Node';
import { NodeType } from '../models/NodeType';
import { SymbolTable } from '../models/SymbolTable';
import { Value } from '../models/Value';
import { DataType } from '../models/DataType';

// CLASE INDEFINIDO ************************************************************************
export class Null extends Node{
    constructor(){
        super('Null', NodeType.UNDEFINED);
    }

    public toString = ():string => 'undefined'

    public run (st: SymbolTable):Value{
        return new Value('', this._position);
    }

    public getChilds():Node[] { return []; }
}

// CLASE NUMERO ****************************************************************************
export class Number extends Node{
    constructor(number:string){
        super(number, NodeType.NUMBER);
    }

    public run (st: SymbolTable):Value{
        return new Value(+this.name, this._position, DataType.NUMBER);
    }

    public getChilds():Node[] { return []; }
}

// CLASE NUMERO ****************************************************************************
export class String extends Node{
    constructor(stringData:string){
        super(stringData, NodeType.STRING);
    }

    public run (st: SymbolTable):Value{
        return new Value(this.name, this._position, DataType.STRING);
    }

    public getChilds():Node[] { return []; }
}

// CLASE BOOLEAN ****************************************************************************
export class Bool extends Node{
    constructor(booleano:string){
        super(booleano, NodeType.BOOLEAN);
    }

    public run (st: SymbolTable):Value{
        return new Value(this.name==='true', this._position, DataType.BOOL);
    }

    public getChilds():Node[] { return []; }
}

// CLASE IDENTIFIER ****************************************************************************
export class Identifier extends Node{
    constructor(identifier:string){
        super(identifier, NodeType.IDENTIFIER);
    }

    public run (st: SymbolTable):Value{
        const finded:Value|null = st.find(this.name);
        if(!finded) return new Value('', this._position);
        return finded;
    }

    public getChilds():Node[] { return []; }
}

