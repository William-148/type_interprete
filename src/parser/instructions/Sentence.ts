import { DataType } from '../models/DataType';
import { Display } from '../models/Display';
import { AnalysisError, ErrorType } from '../models/Error';
import { IRunner } from '../models/IRunner';
import { Node } from '../models/Node';
import { NodeType } from '../models/NodeType';
import { SymbolTable } from '../models/SymbolTable';
import { Value } from '../models/Value';

// CLASE LLAMADA FUNCIÓN ###########################################################################
/**
 * Representa a la sentencia de llamada o invocación de una función
 */
export class CallFunction extends Node implements IRunner{
    constructor(id:string, parameter:Node){
        super(id, NodeType.INS_LLAMADA_FUNCION);
        this.addChild(parameter);
    }

    public run (st: SymbolTable):Value{
        switch(this.name){
            case "console.log": return this.print(st)
        }
        return new Value('', this.row, this.col);
    }

    //#region FUNCIONES NATIVAS **************************************************************
    private print(st:SymbolTable,):Value{
        const parameters:Node = this.childs[0];
        let logs:string='';
        //Recorremos todos los parametros de la función
        let parameterValue:Value;
        parameters.childs.forEach((parameter:IRunner)=>{
            parameterValue = parameter.run(st);
            logs += parameterValue;
        });
        Display.log(logs + '\n');
        return new Value('', this.row, this.col);
    }
    //#endregion
}

// CLASE LLAMADA FUNCIÓN ###########################################################################
/**
 * Permite la declaración y asingación de varialbes
 */
export class Declaration extends Node implements IRunner{
    
    private dataType:DataType = DataType.UNDEFINED;
    private identifier:string;
    private isConst:boolean;

    /**
     * @param identifier Nodo que contiene estructura la cual se le asignará un valor 
     * @param value Nodo que contiene el valor a ser asignado
     * @param dataType Tipo de dato que per
     */
    constructor(identifier:string, value:Node|null, dataType:Node|null=null, isConst:boolean=false){
        super("Declaración", NodeType.INS_DECLARACION);
        this.identifier = identifier;
        this.isConst = isConst;
        this.addChild(new Node(identifier));
        if(!!value) this.addChild(value);
        if(!!dataType) {
            this.addChild(dataType);
            this.defineDataType(dataType.type);
        }
    }

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
                this.dataType = DataType.UNDEFINED;
        }
    }

    public run (st: SymbolTable):Value{
        const expression:IRunner = this.childs[1];
        const expValue:Value = !!expression ?
            expression.run(st): 
            new Value('', this.row, this.col + this.identifier.length + 1);
        try{
            st.declare(this.identifier, expValue, this.dataType, this.isConst);
        }catch(error){
            Display.error(error);
        }
        return new Value('');
    }
}


/**
 * Permite la manipulación de las asignaciones a variables
 */
 export class Assing extends Node implements IRunner{

    /**
     * @param variable Nodo que contiene estructura la cual se le asignará un valor 
     * @param value Nodo que contiene el valor a ser asignado
     * @param dataType Tipo de dato que per
     */
    constructor(variable:Node, value:Node, dataType:Node|null=null){
        super("Asignación", NodeType.INS_ASIGNACION);
        this.addChild(variable);
        this.addChild(value);
        if(!!dataType) this.addChild(dataType);
    }

    public run (st: SymbolTable):Value{
        return new Value('');
    }
}