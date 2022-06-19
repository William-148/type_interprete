import { IRunner } from "./IRunner";
import { NodeType } from "./NodeType";
import { Position } from "./Position";
import { SymbolTable } from "./SymbolTable";
import { Value } from "./Value";

export abstract class Node implements IRunner{
    protected _name:string;
    protected _type:NodeType;
    protected _position:Position;

    constructor(name:string, type:NodeType=NodeType.UNDEFINED){
        this._name = name;
        this._type = type;
        this._position = new Position();
    }

    //#region GETTERS AND SETTERS ******************************************************************
    public set name(name:string) { this._name = name; }
    public get name() { return this._name; }
    
    public set type(type:NodeType) { this._type = type; }
    public get type() { return this._type; }
    
    public set position(position:Position) { this._position = position; }
    public get position() { return this._position; }
    public setRowCol(row:number, col:number):void{ this.position.row = row; this.position.col = col;}

    public get isIdentifier():boolean { return this._type === NodeType.IDENTIFIER; }
    public get isSentence():boolean { return this._type === NodeType.SENTENCE; }
    //#endregion

    /**
     * Returns an array with the children of a node.
     */
    abstract getChilds():Node[];

    abstract run(st: SymbolTable):Value;

    /**
     * Recursive method that generates the graphviz code of the node and its children.
     * @param id Array containing a counter of visited nodes.
     * @returns Object that contains the nodes and links in graphviz code.
     */
    public graph(id:number[]):{nodes:string, links:string}{
        const idCurrent = id[0];
        let nodes:string='', links:string='';
        nodes = `n${idCurrent} [label="${this.name}"];\n`;
        let returned:{nodes:string, links:string};
        let idChild:number;
        // Iterating children of the current node
        this.getChilds().forEach((item:Node)=>{
            idChild = id[0] + 1; 
            id[0] = idChild;
            returned = item.graph(id);
            nodes += returned.nodes;
            links += `n${idCurrent} -> n${idChild};\n`;
            links += returned.links;
        });

        return {nodes, links};
    };

    /**
     * String that contains the graphviz code of the Abstract Syntax Tree.
     * @returns Strint with graphviz code.
     */
    public getDot():string{
        const {nodes, links} = this.graph([1]);
        return  `digraph G {\n${nodes}\n${links}}`;
    }
}

export class NodeBase extends Node{
    run(st: SymbolTable): Value { return new Value(''); }
    getChilds(): Node[] { return [];}
}