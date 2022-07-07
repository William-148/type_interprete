import { IRunner } from "../models/IRunner";
import { Node } from "../models/Node";
import { NodeType } from "../models/NodeType";
import { Value } from "../models/Value";
import { SymbolTable } from "../models/SymbolTable";
import { Display } from "../models/Display";
import { DataType } from "../models/DataType";

/**
 * Representa a la sentencia de llamada o invocación de una función
 */
 export class CallFunction extends Node{
    private parameters:Node;
    constructor(id:string, parameters:Node){
        super(id, NodeType.INS_CALL_FUNCTION);
        this.parameters = parameters;
        this.parameters.name = "Parámetros";
    }

    public run (st: SymbolTable):Value{
        switch(this.name){
            case "console.log": return this.print(st);
        }
        return new Value('', this._position);
    }

    //#region FUNCIONES NATIVAS **************************************************************
    private print(st:SymbolTable,):Value{
        let logs:string='';
        //Recorremos todos los parametros de la función
        let parameterValue:Value;
        for(let parameter of this.parameters.getChilds()){
            parameterValue = parameter.run(st);
            logs += parameterValue;
        }
        Display.log(logs + '\n');
        return new Value('', this._position);
    }
    //#endregion

    public getChilds():Node[]{ return [this.parameters]; }
}