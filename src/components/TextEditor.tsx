import CodeMirror from '@uiw/react-codemirror';
import { javascript } from '@codemirror/lang-javascript';
import { oneDark } from '@codemirror/theme-one-dark';

const TextEditor = (props:any) => {

    return (
        <CodeMirror
            height="200px"
            width='100%'
            extensions={[javascript({ jsx: true })]}
            theme={oneDark}
        
            {...props}
        />
    );
}

export default TextEditor;