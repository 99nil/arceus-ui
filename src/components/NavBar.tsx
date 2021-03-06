import React from "react";
import {message, Affix, Button, Popover, Drawer, Upload, Modal, Cascader} from "antd";
import {
    PlusSquareOutlined,
    MinusSquareOutlined,
    CopyOutlined,
    DownloadOutlined,
    DoubleLeftOutlined,
    DoubleRightOutlined,
    SettingOutlined,
    ApartmentOutlined
} from '@ant-design/icons'
import './index.css'
import {copyData, downloadData, objToYaml, yamlToObj} from "../base";
import {generateURL, uploadURL} from "../api/resource";
import {create as quickstartCreate} from "../api/quickstart";
import {Editor, EditorChange} from "codemirror";
import {UnControlled as CodeMirror} from "react-codemirror2";
import {list as ruleList} from "../api/quickstart";
import {CascaderOptionType} from "antd/lib/cascader";

function filter(inputValue: string, path: CascaderOptionType[]) {
    if (path.length !== 3) return false
    return path.some((option: any) => option.label.toLowerCase().indexOf(inputValue.toLowerCase()) > -1);
}

const uploadProps = {
    name: 'file',
    action: uploadURL,
    showUploadList: false,
    maxCount: 1,
    onChange(info: any) {
        if (info.file.status === 'done') {
            message.success(`${info.file.name} file uploaded successfully`)
        } else if (info.file.status === 'error') {
            message.error(`${info.file.name} file upload failed.`)
        }
    },
};

const generateProps = {
    name: 'file',
    action: generateURL,
    showUploadList: false,
    maxCount: 1,
    onChange(info: any) {
        if (info.file.status === 'error') {
            message.error(`${info.file.name} file parse failed: `, info.file.response)
            return
        }
        if (info.file.status === 'done') {
            const data = info.file.response
            downloadData(data)
            message.success(`Custom Resource Definition is downloaded.`)
            return
        }
    },
}

class NavBar extends React.Component<any, any> {

    constructor(props: any) {
        super(props);
        this.state = {
            top: 0,
            configVisible: false,
            isModalVisible: false,
            ruleOptions: [],
            rules: [],
            defaultData: '',
            codeData: '',
        }
        this.getOptions()
    }

    getOptions = () => {
        ruleList().then((result: any) => {
            if (!result) return
            this.setState({ruleOptions: result})
        })
    }

    setRules = (value: any) => {
        if (value.length !== 3) return
        const rules = this.state.rules
        rules.push({
            group: value[0],
            name: value[1],
            version: value[2],
        })
        this.setState({rules})
    }

    /**
     * ??????
     */
    fold = () => {
        if (this.props.fold) this.props.fold()
    }

    /**
     * ??????
     */
    unfold = () => {
        if (this.props.unfold) this.props.unfold()
    }

    /**
     * ???????????????
     */
    build = () => {
        if (this.props.buildData) this.props.buildData()
    }

    /**
     * ?????????yaml
     */
    parse = () => {
        if (this.props.parseData) this.props.parseData()
    }

    /**
     * ????????????
     */
    quickstart = () => {
        this.setState({
            isModalVisible: true,
        })
    }

    handleOk = () => {
        // ??????Rule??????????????????????????????
        if (!this.state.rules || this.state.rules.length === 0) {
            message.error('??????????????????????????????')
            return
        }
        if (!this.state.codeData) {
            message.error('???????????????????????????')
            return
        }
        if (!this.props.updateCodeData) {
            console.log('updateCodeData function not found')
            message.error('???????????????????????????')
            return
        }
        // yaml???json
        const obj = yamlToObj(this.state.codeData)
        const jsonData = JSON.stringify(obj)
        // ??????yaml????????????
        let resource = {
            apiVersion: 'arceus/v1beta',
            kind: 'QuickStart',
            spec: {
                data: jsonData,
                rule: this.state.rules,
            },
        }
        quickstartCreate(resource).then((result: any) => {
            if (!result) return
            // obj???yaml
            const code = objToYaml(result)
            this.props.updateCodeData(code)
            this.setState({
                isModalVisible: false,
            })
        })
    }

    handleCancel = () => {
        this.setState({
            isModalVisible: false,
        })
    }

    /**
     * ??????
     */
    copyData = () => {
        if (!this.props.data) {
            message.error('???????????????????????????')
            return
        }
        copyData(this.props.data)
    }

    /**
     * ??????
     */
    downloadData = () => {
        if (!this.props.data) {
            message.error('??????????????????')
            return
        }
        downloadData(this.props.data)
    }

    /**
     * ????????????
     */
    configOpen = () => this.setState({configVisible: true})

    /**
     * ????????????
     */
    configClose = () => this.setState({configVisible: false})

    render() {
        return (<>
            <Affix offsetTop={this.state.top}>
                <div className="navBar">
                    <Popover trigger="hover" content="??????">
                        <Button className="ml2" type="primary" onClick={this.configOpen}>
                            <SettingOutlined/>
                        </Button>
                    </Popover>
                    <Popover trigger="hover" content="????????????">
                        <Button className="ml2" type="primary" onClick={this.fold}>
                            <PlusSquareOutlined/>
                        </Button>
                    </Popover>
                    <Popover trigger="hover" content="????????????">
                        <Button className="ml2" type="primary" onClick={this.unfold}>
                            <MinusSquareOutlined/>
                        </Button>
                    </Popover>
                    <Popover trigger="hover" content="??????">
                        <Button className="ml2" type="primary" onClick={this.parse}>
                            <DoubleLeftOutlined/>
                        </Button>
                    </Popover>
                    <Popover trigger="hover" content="??????">
                        <Button className="ml2" type="primary" onClick={this.build}>
                            <DoubleRightOutlined/>
                        </Button>
                    </Popover>
                    <Popover trigger="hover" content="????????????">
                        <Button className="ml2" type="primary" onClick={this.quickstart}>
                            <ApartmentOutlined/>
                        </Button>
                    </Popover>
                    <Popover trigger="hover" content="??????">
                        <Button className="ml2" type="primary" onClick={this.copyData}>
                            <CopyOutlined/>
                        </Button>
                    </Popover>
                    <Popover trigger="hover" content="??????">
                        <Button className="ml2" type="primary" onClick={this.downloadData}>
                            <DownloadOutlined/>
                        </Button>
                    </Popover>
                </div>
            </Affix>
            <Drawer
                title="????????????"
                placement="left"
                closable={false}
                visible={this.state.configVisible}
                onClose={this.configClose}
            >
                <p>???????????????????????????</p>
                <Upload {...generateProps}>
                    <Button type="ghost" block>
                        ??????????????????
                    </Button>
                </Upload>
                <Upload {...uploadProps}>
                    <Button type="primary" block>
                        ??????????????????
                    </Button>
                </Upload>
            </Drawer>
            <Modal
                title="Quick Start"
                visible={this.state.isModalVisible}
                onOk={this.handleOk}
                onCancel={this.handleCancel}
            >
                <p>????????????</p>
                <Cascader
                    className="ml10"
                    placeholder="QuickStartRule Select"
                    options={this.state.ruleOptions || []}
                    onChange={value => this.setRules(value)}
                    showSearch={{filter, matchInputWidth: false}}
                    changeOnSelect
                />
                <p>?????????YAML??????</p>
                <CodeMirror
                    className="quickstart"
                    value={this.state.defaultData}
                    options={{
                        mode: 'yaml',
                        theme: 'material',
                        lineNumbers: true, // ????????????
                        lineWrapping: true, // ??????????????????
                        tabindex: 4,
                    }}
                    editorDidMount={(editor: Editor) => {
                        editor.setSize('auto', 300)
                    }}
                    onChange={(editor: Editor, data: EditorChange, value: string) => {
                        this.setState({codeData: value})
                    }}
                />
            </Modal>
        </>);
    }
}

export default NavBar
