import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import * as serviceWorker from './serviceWorker';
import CTree from "./components/CTree";
import {UnControlled as CodeMirror} from "react-codemirror2";
import NavBar from "./components/NavBar";

require('codemirror/mode/yaml/yaml')

export default class App extends React.Component<any, any> {

    constructor(props: any) {
        super(props);
        this.state = {
            navBarRef: React.createRef(),
            cTreeRef: React.createRef(),
            defaultData: '',
            codeData: '',
        }
    }

    /**
     * 构建code内容
     * @param data
     */
    buildCodeData = (data: string) => this.setState({defaultData: data})

    render() {
        return (
            <div className="App">
                <NavBar
                    ref={this.state.navBarRef}
                    data={this.state.codeData}
                    fold={() => this.state.cTreeRef.current.foldAll()}
                    unfold={() => this.state.cTreeRef.current.unfoldAll()}
                    buildData={() => this.state.cTreeRef.current.convertToYaml()}
                    parseData={() => {
                        alert('开发中')
                    }}
                />
                <div className="flex">
                    <CTree
                        className="trees"
                        ref={this.state.cTreeRef}
                        buildYamlData={this.buildCodeData}
                    />
                    <CodeMirror
                        className="codes"
                        value={this.state.defaultData}
                        options={{
                            mode: 'yaml',
                            theme: 'material',
                            lineNumbers: true
                        }}
                        editorDidMount={(editor) => {
                            editor.setSize('auto', 500)
                        }}
                        onChange={(editor, data, value) => {
                            this.setState({codeData: value})
                        }}
                    />
                </div>
            </div>
        );
    }
}

ReactDOM.render(<App/>, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
