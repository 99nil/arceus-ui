import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import * as serviceWorker from './serviceWorker';
import CTree from "./components/CTree";
import {UnControlled as CodeMirror} from "react-codemirror2";
import NavBar from "./components/NavBar";
import {kubernetesDefaultVersion} from "./data/base";
require('codemirror/mode/yaml/yaml')

export default class App extends React.Component<any, any> {

    constructor(props: any) {
        super(props);
        this.state = {
            navBarRef: React.createRef(),
            k8sTreeRef: React.createRef(),
            defaultData: '',
            codeData: '',
            version: kubernetesDefaultVersion,
        }
    }

    /**
     * 构建code内容
     * @param data
     */
    buildCodeData = (data: string) => this.setState({defaultData: data})

    /**
     * 改变版本
     */
    changeVersion = (version: string) => {
        this.setState({ version })
        this.state.k8sTreeRef.current.changeTreeDataVersion(version)
    }

    render() {
        return (
            <div className="App">
                <NavBar
                    ref={this.state.navBarRef}
                    data={this.state.codeData}
                    fold={() => this.state.k8sTreeRef.current.foldAll()}
                    unfold={() => this.state.k8sTreeRef.current.unfoldAll()}
                    buildData={() => this.state.k8sTreeRef.current.convertToYaml()}
                    parseData={() => this.state.k8sTreeRef.current.convertToTreeData(this.state.codeData)}
                    changeVersion={this.changeVersion}
                />
                <div className="flex">
                    <CTree
                        className="trees"
                        ref={this.state.k8sTreeRef}
                        buildYamlData={this.buildCodeData}
                        version={this.state.version}
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

ReactDOM.render(<App />, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
