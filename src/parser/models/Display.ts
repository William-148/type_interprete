import { AnalysisError } from "./Error";

export class Display{
    private static _errorList:Array<AnalysisError>;
    public static logs:string;

    /**
     * Limpia todas las estructuras del display
     */
    public static clear():void{
        Display._errorList=[];
        Display.logs='';
    }

    public static log(data:string):void { Display.logs += "> " + data; }

    public static error(data:any):void{
        if(data instanceof AnalysisError) {
            Display._errorList.push(data);
            Display.logs += "🐞 " + data + "\n";
        }
        else throw data;
    }
    
}