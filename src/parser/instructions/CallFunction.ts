import { IRunner } from "../models/IRunner";
import { Node } from "../models/Node";
import { NodeType } from "../models/NodeType";
import { Value } from "../models/Value";
import { SymbolTable } from "../models/SymbolTable";
import { Display } from "../models/Display";

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