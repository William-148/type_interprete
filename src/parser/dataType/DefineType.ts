import { NodeType } from "../models/NodeType";
import { Node } from "../models/Node";
import { SymbolTable } from "../models/SymbolTable";
import { Value } from "../models/Value";

// CLASE OPERACIONES BINARIAS ************************************************************************
export class DefineType extends Node{
    private _arrayLevel:number;
    private _arrayType:NodeType;

    constructor(name:string, type:NodeType){
        super(name, type);
        this._arrayLevel = type===NodeType.DT_ARRAY?1:0;
        this._arrayType = NodeType.UNDEFINED;
    }

    public toString = ():string => this.name + '('+ this._arrayLevel + ')';

    public get arrayLevel():number { return this._arrayLevel; }
    public get arrayType():NodeType { return this._arrayType; }

    public toArray(level:number):void{
        if(this._type !== NodeType.DT_ARRAY){
            this._arrayType = this._type;
            this._type = NodeType.DT_ARRAY;
            this._arrayLevel = level;
        }
        else{
            this._arrayLevel += level;
        }
    }

    run(st: SymbolTable): Value { return new Value(''); }

    getChilds(): Node[] {  return []; }
}