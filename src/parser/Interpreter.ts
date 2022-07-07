import { parse } from './grammar'
import { Node } from './models/Node';
import { Display } from './models/Display';
import { SymbolTable } from './models/SymbolTable';

export class Interpreter {
    private AST:Node|null;
    constructor(){
        this.AST = null;
    }

    /**
     * Executes the code contained in a string.
     * @param input String that contains the code to execute.
     * @returns String that contains logs of the execution result.
     */
    public run(input:string):string{
        //Ejecutar Parser
        const returned = parse(input);
        const tree:Node = returned.tree;
        const errors:any[] = returned.errors;
        if(!tree) return '';
        //Iniciando ejecución de código
        Display.clear();
        errors.forEach((item:any)=>{
            Display.error(item);
        })
        let st = new SymbolTable();
        tree.run(st);
        this.AST = tree;
        return Display.logs;
    }

    /**
     * Returns the Abstract Syntax Tree in graphviz code of the last execution.
     */
    public get dotAST():string{
        if(!!this.AST) return this.AST.getDot();
        return '';
    }
}
