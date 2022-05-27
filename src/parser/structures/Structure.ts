import { Display } from '../models/Display';
import { IRunner } from '../models/IRunner';
import { Node } from '../models/Node';
import { NodeType } from '../models/NodeType';
import { SymbolTable } from '../models/SymbolTable';
import { Value } from '../models/Value';

// CLASE LLAMADA FUNCIÓN ###########################################################################
export class CallFunction extends Node implements IRunner{
    constructor(id:string, parameter:Node){
        super(id, NodeType.INS_LLAMADA_FUNCION);
        this.addChild(parameter);
    }

    public toString = ():string => this.name;

    public run (st: SymbolTable):Value{
        switch(this.name){
            case "console.log": return this.print(st)
        }
        return new Value('', this.row, this.col);
    }

    //#region FUNCIONES NATIVAS **************************************************************
    private print(st:SymbolTable,):Value{
        let parameters:Node = this.childs[0];
        let logs:string='';
        //Recorremos todos los parametros de la función
        let aux:Value;
        parameters.childs.forEach((item:IRunner)=>{
            aux = item.run(st);
            logs += aux + '\n';
        });
        Display.log(logs);
        return new Value('', this.row, this.col);
    }
    //#endregion
}