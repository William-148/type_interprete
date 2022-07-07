import { Node, NodeBase } from "../models/Node";
import { NodeType } from "../models/NodeType";
import { Value } from "../models/Value";
import { Symbol } from "../models/Symbol";
import { SymbolTable } from "../models/SymbolTable";
import { Display } from "../models/Display";
import { DataType, StringType } from "../models/DataType";
import { DefineType } from "../dataType/DefineType";
import { Position } from "../models/Position";


export class DeclarationList extends Node{
    private list:Node[];
    constructor(){
        super("Sentencias", NodeType.SENTENCE);
        this.list = []
    }

    public run (st: SymbolTable):Value{
        this.list.forEach((item)=>{
            item.run(st);
        });
        return new Value('');
    }

    public add(declaration:Node):void{
        this.list.push(declaration);
    }
    
    public getDeclarations():DeclarationList|Node{
        return this.list.length===1?this.list[0]:this;
    }

    public getChilds():Node[]{ return this.list; }
}

/**
 * Permite la declaración y asingación de varialbes
 */
 export class Declaration extends Node{
    
    private identifier:string;
    private expression:Node|null;
    private dataType:DataType = DataType.ANY;
    private arrayLevel:number = 0;
    private arrayType:DataType = DataType.ANY;
    private _isConst:boolean;

    /**
     * @param identifier Nodo que contiene estructura la cual se le asignará un valor 
     * @param value Nodo que contiene el valor a ser asignado
     * @param dataType Tipo de dato que per
     */
    constructor(identifier:string, value:Node|null, dataType:DefineType|null=null, isConst:boolean=false){
        super("Declaración", NodeType.INS_DECLARATION);
        this.identifier = identifier;
        this.expression = value;
        if(!!dataType) this.defineDataType(dataType);
        this._isConst = isConst;
    }

    public getChilds():Node[]{ 
        const list:Node[] = [new NodeBase(this.identifier)]; 
        if(!!this.expression) list.push(this.expression);
        list.push(new NodeBase(StringType(this.dataType)));
        return list;
    }

    public set isConst(isConst:boolean) { this._isConst = isConst; }

    private NodeTypeToData(nodeType:NodeType):DataType{
        switch(nodeType){
            case NodeType.DT_STRING: return DataType.STRING;
            case NodeType.DT_BOOLEAN: return DataType.BOOL;
            case NodeType.DT_NUMBER: return DataType.NUMBER;
            case NodeType.DT_IDENTIFIER: return DataType.STRUCT;
            default: return DataType.ANY;
        }
    }

    private defineDataType(dataType:DefineType):void{
        switch(dataType.type){
            case NodeType.DT_ARRAY:
                this.dataType = DataType.ARRAY;
                this.arrayLevel = dataType.arrayLevel;
                this.arrayType = this.NodeTypeToData(dataType.arrayType);
                break;
            default: 
                this.dataType = this.NodeTypeToData(dataType.type);
        }
    }

    public run (st: SymbolTable):Value{
        const expValue:Value = !!this.expression ? 
            this.expression.run(st):
            new Value('', new Position(this._position.row, this._position.col + this.identifier.length + 1));
        try{
            const newSymbol = new Symbol(this.identifier, this.dataType, this._isConst);
            newSymbol.arrayLevel = this.arrayLevel;
            newSymbol.arrayType = this.arrayType;
            newSymbol.position = expValue.position;
            st.declare(newSymbol, expValue);
        }catch(error){
            Display.error(error);
        }
        return new Value('', this._position);
    }
}