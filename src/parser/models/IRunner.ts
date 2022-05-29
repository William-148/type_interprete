import { SymbolTable } from "./SymbolTable";
import { Value } from "./Value";

export interface IRunner {
    /**
     * Representa la ejecución de código
     * @param st Tabla de simbolo
     */
    run: (st:SymbolTable) => Value
}