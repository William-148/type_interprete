import { NodeType } from "./NodeType";
import { Position } from "./Position";

export class Node extends Position{
    //Conteo de numero de nodos creados
    public static count:number = 0;

    //Campos de clase
    private _id:number;
    protected _name:string;
    protected _type:NodeType;
    protected _childs:Array<any>;

    constructor(name:string, type: NodeType = NodeType.UNDEFINED){
        super();
        this._id = Node.count;
        this._name = name;
        this._type = type;
        this._childs = [];
        Node.count ++;
    }

    public toString = ():string => this.name;

    //#region GETTERS AND SETTERS **********************************************************
    public set id(id:number) { this._id = id; }
    public get id() { return this._id; }

    public set name(name:string) { this._name = name; }
    public get name() { return this._name; }

    public set type(type:NodeType) { this._type = type; }
    public get type() { return this._type; }

    public get childs() { return this._childs; }
    public get sizeChilds() { return this._childs.length; }
    //#endregion

    //#region VERIFY TYPES ******************************************************************
    public isIdentifier():boolean { return this._type === NodeType.IDENTIFICADOR; }
    public isSentence():boolean { return this._type === NodeType.SENTENCE}
    //#endregion

    public addChild(child:Node):void{
        if(!!child) this._childs.push(child);
    }

    public addChildStart(child:Node):void{
        if(!!child) this._childs.unshift(child);
    }

    //#region  METODOS PARA OBTENER CODIGO JSON ***********************************************************************
    public toJson(){
        let json_txt:string;
        if(this._childs.length > 0)
            json_txt = `{\n"name": "${ this.name }",\n"type": "${ NodeType[this.type] }",\n"childs": [${ this.childsToJson()}]\n}`;
        
        json_txt = `{\n"name": "${ this.name }",\n"type": "${ NodeType[this.type] }",\n"childs": []\n}`;
        return json_txt;
    }

    private childsToJson():string{
        let json_txt = '';
        this._childs.forEach((value, index)=>{
            if(index === 0) json_txt += value.toJson();
            json_txt += ',\n' + value.toJson();
        });
        return json_txt;
    }
    //#endregion

    //#region METODOS PARA OBTENER COIDGO DE GRAPHVIZ *****************************************************************
    public static graph(node:Node):string{
        let txt:string[] = Node.graph_(node);
        let graphvizTxt =  `digraph G {\n${txt[0]}\n${txt[1]}}`;
        return graphvizTxt;
    }

    private static graph_(node:Node):string[]{
        if(node.type === NodeType.ERROR) return ["",""];
        let nodoTxt:string = '', linkTxt:string = '';
        let idNode = node.id;
        nodoTxt += `n${idNode} [label="${node.name}"];\n`;
        let size = node.childs.length;
        if(size > 0){
            let returned:string[];
            for(let item of node.childs){
                if(item.type === NodeType.ERROR) continue;
                returned = Node.graph_(item);
                nodoTxt += returned[0];
                linkTxt += `n${idNode} -> n${item.id};\n`;
                linkTxt += returned[1];
            }
        }       
        return [nodoTxt, linkTxt];
    }
    //#endregion
}