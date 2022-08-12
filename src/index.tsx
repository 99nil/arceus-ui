import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import * as serviceWorker from './serviceWorker';
import CTree from "./components/CTree";
import {UnControlled as CodeMirror} from "react-codemirror2";
import NavBar from "./components/NavBar";
import 'codemirror/addon/hint/show-hint';
import 'codemirror/addon/hint/anyword-hint.js'
import 'codemirror/addon/hint/show-hint.css';
import 'codemirror/addon/selection/active-line';
import 'codemirror/mode/yaml/yaml';
import 'codemirror/mode/javascript/javascript';
import 'codemirror/mode/xml/xml';
import 'codemirror/mode/toml/toml';
import {Editor, EditorChange, Hint, Hints, Pos} from "codemirror";
import {getTreeNodeByPath, getPathByYamlData, getGVK} from "./base";
import {InfoParamsType, tree} from "./api/resource";
import {version} from "./api/home";
import {Tabs, message} from "antd";
import {convert} from "./api/raw";
import {ArrayNode} from "./base/base";

const {TabPane} = Tabs;

export default class App extends React.Component<any, any> {

    constructor(props: any) {
        super(props);
        this.checkVersion()
        this.state = {
            navBarRef: React.createRef(),
            cTreeRef: React.createRef(),
            defaultMultiData: {
                yaml: '',
                json: '',
                toml: '',
                xml: '',
            },
            codeMultiData: {
                yaml: '',
                json: '',
                toml: '',
                xml: '',
            },
            activeKey: 'yaml'
        }
    }

    checkVersion = () => {
        version().then((result: any) => {
            if (!result) return
            if (!result.version) result.version = 'v0.0.0'
            const item = localStorage.getItem('arceus-version')
            if (item && item === result.version) return
            localStorage.clear()
            localStorage.setItem('arceus-version', result.version)
        })
    }

    /**
     * 构建code内容
     * @param data
     */
    buildCodeData = (data: string) => {
        let {activeKey, codeMultiData, defaultMultiData} = this.state
        codeMultiData.yaml = data
        defaultMultiData.yaml = data
        this.setState({codeMultiData, defaultMultiData})
        if (activeKey === 'yaml') return
        this.formatConvert('yaml', activeKey)
    }

    handleHint = async (editor: Editor): Promise<Hints | null> => {
        const cur = editor.getCursor()
        const lineText = editor.getLine(cur.line)
        if (lineText.indexOf(':') !== -1) return null
        let lineTextClean = lineText.trimLeft()
        const spaceLen = lineText.length - lineTextClean.length
        if (spaceLen % 2 !== 0) return null

        const fullText = editor.getValue()
        const fullTextSet = fullText.split('\n')
        const isArrayLine = lineTextClean.startsWith('- ')
        const gvk = getGVK(fullTextSet, cur.line)
        if (!gvk) return null

        let path = getPathByYamlData(fullTextSet, cur.line, isArrayLine)
        if (path === '' && spaceLen > 0) return null
        if (spaceLen === 0) {
            path = 'root'
        } else {
            path = 'root' + path
        }

        const params: InfoParamsType = {
            group: gvk[0],
            version: gvk[1],
            kind: gvk[2],
        }
        const result = await tree(params)
        const node = getTreeNodeByPath(path, [result])
        if (!node || !node.children || node.children.length === 0) return null

        let start = spaceLen
        if (isArrayLine) {
            lineTextClean = lineTextClean.substring(2)
            start = spaceLen + 2
        }
        let list: Hint[] = []
        for (const v of node.children) {
            if (v.name.indexOf(lineTextClean) === -1) continue
            let hint: Hint = {text: v.name, displayText: v.name}
            hint.text += v.name === ArrayNode ? ' ' : ':'
            list.push(hint)
        }
        return {
            list: list,
            from: Pos(cur.line, start),
            to: Pos(cur.line, cur.ch)
        }
    }

    /**
     * 格式转换
     * @param inf 数据格式
     * @param outf 转换格式
     */
    formatConvert = (inf: string, outf: string) => {
        let {codeMultiData, defaultMultiData} = this.state
        if (!codeMultiData.hasOwnProperty(inf)) {
            message.error('不存在')
            return
        }
        if (codeMultiData[inf].trim() === '') return
        convert(inf, outf, codeMultiData[inf]).then((result: any) => {
            if (!result) return
            if (typeof result === 'object') result = JSON.stringify(result)
            defaultMultiData[outf] = result
            this.setState({defaultMultiData})
        })
    }

    callback = (key: any) => {
        console.log(key)
    }

    render() {
        return (
            <div className="App">
                <NavBar
                    ref={this.state.navBarRef}
                    data={this.state.codeMultiData.yaml}
                    updateCodeData={this.buildCodeData}
                    fold={() => this.state.cTreeRef.current.foldAll()}
                    unfold={() => this.state.cTreeRef.current.unfoldAll()}
                    buildData={() => this.state.cTreeRef.current.convertToYaml()}
                    parseData={() => {
                        this.state.cTreeRef.current.convertToTreeData(this.state.codeMultiData.yaml)
                    }}
                />
                <div className="flex">
                    <CTree
                        className="trees"
                        ref={this.state.cTreeRef}
                        buildYamlData={this.buildCodeData}
                    />

                    <Tabs
                        className="codes"
                        defaultActiveKey="1"
                        onChange={this.callback}
                        onTabClick={(activeKey: string, e: React.KeyboardEvent | React.MouseEvent) => {
                            console.log(activeKey)
                            if (this.state.activeKey === activeKey) return
                            this.formatConvert(this.state.activeKey, activeKey)
                            this.setState({activeKey})
                        }}
                    >
                        <TabPane tab="YAML" key="yaml">
                            <CodeMirror
                                value={this.state.defaultMultiData.yaml}
                                options={{
                                    mode: 'yaml',
                                    theme: 'material',
                                    lineNumbers: true, // 显示行号
                                    lineWrapping: true, // 支持代码折叠
                                    tabindex: 4,
                                    extraKeys: {
                                        'Ctrl': (editor: Editor) => editor.showHint(),
                                    },
                                    hintOptions: {
                                        completeSingle: false,
                                        hint: this.handleHint,
                                    }
                                }}
                                editorDidMount={(editor: Editor) => {
                                    editor.setSize('auto', 500)
                                }}
                                onChange={(editor: Editor, data: EditorChange, value: string) => {
                                    let codeMultiData = this.state.codeMultiData
                                    codeMultiData.yaml = value
                                    this.setState({codeMultiData})
                                }}
                            />
                        </TabPane>
                        <TabPane tab="JSON" key="json">
                            <CodeMirror
                                value={this.state.defaultMultiData.json}
                                options={{
                                    mode: {
                                        name: "javascript",
                                        json: true
                                    },
                                    theme: 'material',
                                    lineNumbers: true, // 显示行号
                                    lineWrapping: true, // 支持代码折叠
                                    tabindex: 4,
                                }}
                                editorDidMount={(editor: Editor) => {
                                    editor.setSize('auto', 500)
                                }}
                                onChange={(editor: Editor, data: EditorChange, value: string) => {
                                    let codeMultiData = this.state.codeMultiData
                                    codeMultiData.json = value
                                    this.setState({codeMultiData})
                                }}
                            />
                        </TabPane>
                        <TabPane tab="TOML" key="toml">
                            <CodeMirror
                                value={this.state.defaultMultiData.toml}
                                options={{
                                    mode: 'toml',
                                    theme: 'material',
                                    lineNumbers: true, // 显示行号
                                    lineWrapping: true, // 支持代码折叠
                                    tabindex: 4,
                                }}
                                editorDidMount={(editor: Editor) => {
                                    editor.setSize('auto', 500)
                                }}
                                onChange={(editor: Editor, data: EditorChange, value: string) => {
                                    let codeMultiData = this.state.codeMultiData
                                    codeMultiData.toml = value
                                    this.setState({codeMultiData})
                                }}
                            />
                        </TabPane>
                        <TabPane tab="XML" key="xml">
                            <CodeMirror
                                value={this.state.defaultMultiData.xml}
                                options={{
                                    mode: 'xml',
                                    theme: 'material',
                                    lineNumbers: true, // 显示行号
                                    lineWrapping: true, // 支持代码折叠
                                    tabindex: 4,
                                }}
                                editorDidMount={(editor: Editor) => {
                                    editor.setSize('auto', 500)
                                }}
                                onChange={(editor: Editor, data: EditorChange, value: string) => {
                                    let codeMultiData = this.state.codeMultiData
                                    codeMultiData.xml = value
                                    this.setState({codeMultiData})
                                }}
                            />
                        </TabPane>
                    </Tabs>
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
