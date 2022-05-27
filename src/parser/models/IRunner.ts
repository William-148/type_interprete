import { SymbolTable } from "./SymbolTable";
import { Value } from "./Value";

export interface IRunner {
    run: (st:SymbolTable) => Value
}