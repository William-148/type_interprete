import {parse} from './grammar'
import { Node } from './models/Node';
import { Display } from './models/Display';
import { SymbolTable } from './models/SymbolTable';

export function run(input:string){
    //Ejecutar Parser
    const { tree, errors} = parse(input);
    if(!tree) return undefined;
    //Generando grafica del AST
    const dot = Node.graph(tree);
    //Iniciando ejecución de código
    Display.clear();
    errors.forEach((item:any)=>{
        Display.error(item);
    })
    let st = new SymbolTable();
    tree.childs.forEach((element:any) => {
        if(!!element.run) element.run(st);
    });
    return {
        "logs": Display.logs,
        dot
    }
}