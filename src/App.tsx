import React from 'react';
import logo from './logo.svg';
import TextEditor from './components/TextEditor';
import { run } from './parser/Interpreter'

import './App.css';
import { useState } from 'react';

function App() {
    const [text, setText] = useState("//Only print and numeric operations are available\nconsole.log('hello world!');\nconsole.log(3+(3**(1+1))+1);\nconsole.log(true);")
    const [logs, setLogs] = useState("> Console [V:1.0]");

    const execute = (text:string) => {
        const result = run(text);
        if(!!result){
            setLogs(logs+ "\n[Running -----] \n" +result?.logs);
        }
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
