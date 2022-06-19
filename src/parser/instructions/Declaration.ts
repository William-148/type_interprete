import { Node, NodeBase } from "../models/Node";
import { NodeType } from "../models/NodeType";
import { Value } from "../models/Value";
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
        if(!!dataType) this.defineDataType(dataType.type);
        this._isConst = isConst;
    }

    public getChilds():Node[]{ 
        const list:Node[] = [new NodeBase(this.identifier)]; 
        if(!!this.expression) list.push(this.expression);
        list.push(new NodeBase(StringType(this.dataType)));
        return list;
    }

    public set isConst(isConst:boolean) { this._isConst = isConst; }

    private defineDataType(dataType:NodeType):void{
        switch(dataType){
            case NodeType.DT_STRING: 
                this.dataType = DataType.STRING; break;
            case NodeType.DT_BOOLEAN: 
                this.dataType = DataType.BOOL; break;
            case NodeType.DT_NUMBER: 
                this.dataType = DataType.NUMBER; break;
            case NodeType.DT_IDENTIFIER: 
                this.dataType = DataType.STRUCT; break;
            default: 
                this.dataType = DataType.ANY;
        }
    }

    public run (st: SymbolTable):Value{
        const expValue:Value = !!this.expression ? 
            this.expression.run(st):
            new Value('', new Position(this._position.row, this._position.col + this.identifier.length + 1));
        try{
            st.declare(this.identifier, expValue, this.dataType, this._isConst);
        }catch(error){
            Display.error(error);
        }
        return new Value('', this._position);
    }
}