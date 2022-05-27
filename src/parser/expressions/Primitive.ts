import { Node } from '../models/Node';
import { NodeType } from '../models/NodeType';
import { SymbolTable } from '../models/SymbolTable';
import { Value } from '../models/Value';
import { DataType } from '../models/DataType';
import { IRunner } from '../models/IRunner';

// CLASE INDEFINIDO ************************************************************************
export class Null extends Node implements IRunner{
    constructor(){
        super('Null', NodeType.UNDEFINED);
    }

    public toString = ():string => 'undefined'

    public run (st: SymbolTable):Value{
        return new Value('', this.row, this.col);
    }
}

// CLASE NUMERO ****************************************************************************
export class Number extends Node implements IRunner{
    constructor(number:string){
        super(number, NodeType.NUMBER);
    }

    public toString = ():string => this.name;

    public run (st: SymbolTable):Value{
        return new Value(+this.name, this.row, this.col, DataType.NUMBER);
    }
}

// CLASE NUMERO ****************************************************************************
export class String extends Node implements IRunner{
    constructor(stringData:string){
        super(stringData, NodeType.STRING);
    }

    public toString = ():string => this.name;

    public run (st: SymbolTable):Value{
        return new Value(this.name, this.row, this.col, DataType.NUMBER);
    }
}

// CLASE BOOLEAN ****************************************************************************
export class Bool extends Node implements IRunner{
    constructor(booleano:string){
        super(booleano, NodeType.BOOLEAN);
    }

    public toString = ():string => this.name;

    public run (st: SymbolTable):Value{
        return new Value(this.name==='true', this.row, this.col, DataType.BOOL);
    }
}

// CLASE IDENTIFIER ****************************************************************************
export class Identifier extends Node implements IRunner{
    constructor(identifier:string){
        super(identifier, NodeType.IDENTIFICADOR);
    }

    public toString = ():string => this.name;

    public run (st: SymbolTable):Value{
        return st.search(this.name);
    }
}

