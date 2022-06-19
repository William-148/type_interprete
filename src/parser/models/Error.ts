import { Position } from "./Position";

export enum ErrorType{
    LEXICO,
    SINTACTICO,
    SEMANTICO
}

export class AnalysisError extends Error{
    private _position:Position;

    constructor(message:string, tipo:ErrorType, position:Position|null=null){
        super(message);
        this.setName(tipo);
        this._position = new Position(-1,-1);
        if(!!position) this._position.setPosition(position);
        /*
        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, AnalysisError);
        }
        */
    }

    public get row() { return this._position.row; }
    public set row(row:number) { this._position.row = row; }

    public get col() { return this._position.col; }
    public set col(col:number) { this._position.col = col; }

    public setRowColumn(row:number, col:number):void{
        this._position.row = row;
        this._position.col = col;
    }

    public setPosition(position:Position):void{
        this._position = position;
    }

    private setName(tipo:ErrorType):void{
        switch(tipo){
            case ErrorType.LEXICO:
                this.name = "Lexical Error";
                break;
            case ErrorType.SINTACTICO:
                this.name = "Sintaxis Error";
                break;
            default:
                this.name = "Semantic Error";
                break;
        }
    }

    public toString = ():string => (this._position.row === -1 && this._position.col === -1)?
        `${this.name}: ${this.message}`:
        `${this.name}: ${this.message}  ${this._position}`;
}