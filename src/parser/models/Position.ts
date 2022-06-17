export class Position {
    protected _row:number;
    protected _col:number;

    constructor(row:number=0, col:number=0){
        this._row = row;
        this._col = col;
    }

    public set row(row:number) { this._row = row; }
    public get row() { return this._row; }

    public set col(col:number) { this._col = col; }
    public get col() { return this._col; }

    setRowCol(row:number, col:number){
        this._row = row;
        this._col = col;
    }

    setPosition(position:Position){
        this._row = position.row;
        this._col = position.col;
    }

    public printPosition():string{
        return `Fila:${this._row} Columna:${this._col}`
    }

    public toString = ():string => `Fila:${this._row} Columna:${this._col}`;
}