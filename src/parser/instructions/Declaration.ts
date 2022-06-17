import { IRunner } from "../models/IRunner";
import { Node } from "../models/Node";
import { NodeType } from "../models/NodeType";
import { Value } from "../models/Value";
import { SymbolTable } from "../models/SymbolTable";
import { Display } from "../models/Display";
import { DataType } from "../models/DataType";
import { DefineType } from "../dataType/DefineType";


export class DeclarationList extends Node implements IRunner{
    constructor(){
        super("Sentencias", NodeType.SENTENCE);
    }

    public run (st: SymbolTable):Value{
        this._childs.forEach((item)=>{
            item.run(st);
        });
        return new Value('');
    }
    
    public getDeclarations():DeclarationList|Declaration{
        return this._childs.length===1?this._childs[0]:this;
    }
}

/**
 * Permite la declaración y asingación de varialbes
 */
 export class Declaration extends Node implements IRunner{
    
    private dataType:DataType = DataType.ANY;
    private _hasExpression:boolean = false;
    private identifier:string;
    private _isConst:boolean;

    /**
     * @param identifier Nodo que contiene estructura la cual se le asignará un valor 
     * @param value Nodo que contiene el valor a ser asignado
     * @param dataType Tipo de dato que per
     */
    constructor(identifier:string, value:Node|null, dataType:DefineType|null=null, isConst:boolean=false){
        super("Declaración", NodeType.INS_DECLARACION);
        this.identifier = identifier;
        this._isConst = isConst;
        this.addChild(new Node(identifier));
        if(!!value){ 
            this.addChild(value);
            this._hasExpression = true;
        }
        if(!!dataType) {
            this.addChild(dataType);
            this.defineDataType(dataType.type);
        }
    }

    public set isConst(isConst:boolean) { this._isConst = isConst; }

    private defineDataType(dataType:NodeType):void{
        switch(dataType){
            case NodeType.DT_STRING: 
                this.dataType = DataType.STRING; return;
            case NodeType.DT_BOOLEAN: 
                this.dataType = DataType.BOOL; return;
            case NodeType.DT_NUMBER: 
                this.dataType = DataType.NUMBER; return;
            case NodeType.DT_IDENTIFIER: 
                this.dataType = DataType.STRUCT; return;
            default: 
                this.dataType = DataType.ANY;
        }
    }

    public run (st: SymbolTable):Value{
        const expression:IRunner = this.childs[1];
        const expValue:Value = !!expression && this._hasExpression ?
            expression.run(st): 
            new Value('', this.row, this.col + this.identifier.length + 1);
        try{
            st.declare(this.identifier, expValue, this.dataType, this._isConst);
        }catch(error){
            Display.error(error);
        }
        return new Value('');
    }
}