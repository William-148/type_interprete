import React from 'react';
import logo from './logo.svg';
import TextEditor from './components/TextEditor';
import { Interpreter } from './parser/Interpreter'
import './App.css';
import { useState } from 'react';

const code =`// Ponderación
const laboratorio:number = 35;
const tareas:number = 5;
const parcial1:number = 20;
const parcial2:number = 15;
const final:number = 25;
const ponderacion:number = laboratorio + tareas + parcial1 + parcial2 + final;

// Nombre estudiante
let name:string = "Khenneth Moreno";
const nota_lab:number = 70;
const nota_tareas:number = 100;
const nota_p1:number = 43;
const nota_p2:number = 60;
const nota_final:number = 55;
const Total:number = (
  laboratorio*nota_lab +
  tareas*nota_tareas +
  parcial1*nota_p1 +
  parcial2*nota_p2 +
  final*nota_final
) / 100;
console.log(name," tiene una nota final de: '",Total, "' sobre '", ponderacion, "'");`

function App() {
    const [text, setText] = useState('')
    const [logs, setLogs] = useState("> Console [V:1.0]");
    const interpreter:Interpreter = new Interpreter();

    const execute = (text:string) => {
        const result:string = interpreter.run(text);
        if(result !== '') setLogs("[Running -----] \n" +result);
    }

    return (
        <div className="App">
            <header className="App-header">
                <div className='Content-logo'>
                    <img src={logo} className="App-logo" alt="logo" />
                </div>
                <div className='editor'>
                    <button  onClick={()=>{execute(text)}} > Run </button>
                    <TextEditor
                        height="400px"
                        value={text}
                        onChange={(value:string, viewUpdate:any) => {
                            setText(value);
                        }}
                    />
                    <hr />
                    <TextEditor
                        value={logs}
                        extensions={[]}
                        readOnly
                        onChange={(value:string, viewUpdate:any) => {
                            setLogs(value);
                        }}
                    />
                </div>
            </header>
        </div>
    );
}

export default App;
