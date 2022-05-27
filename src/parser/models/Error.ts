export enum ErrorType{
    LEXICO,
    SINTACTICO,
    SEMANTICO
}

export class AnalysisError extends Error{
    private _row:number;
    private _col:number;

    constructor(message:string, tipo:ErrorType, row:number = -1, col:number = -1){
        super(message);
        this.setName(tipo);
        this._row = row;
        this._col = col;
        /*
        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, AnalysisError);
        }
        */
    }

    public get row() { return this._row; }
    public set row(row:number) { this._row = row; }

    public get col() { return this._col; }
    public set col(col:number) { this._col = col; }

    public setRowColumn(row:number, col:number):void{
        this._row = row;
        this._col = col;
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

    public toString = ():string => (this._row === -1 && this._col === -1)?
        `${this.name}: ${this.message}`:
        `${this.name}: ${this.message}  Fila:${this.row} Columna:${this.col}`;
}