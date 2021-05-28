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
     * 折叠
     */
    fold = () => {
        if (this.props.fold) this.props.fold()
    }

    /**
     * 展开
     */
    unfold = () => {
        if (this.props.unfold) this.props.unfold()
    }

    /**
     * 构建树结构
     */
    build = () => {
        if (this.props.buildData) this.props.buildData()
    }

    /**
     * 解析为yaml
     */
    parse = () => {
        if (this.props.parseData) this.props.parseData()
    }

    /**
     * 快速开始
     */
    quickstart = () => {
        this.setState({
            isModalVisible: true,
        })
    }

    handleOk = () => {
        // 选择Rule，输入内容，生成数据
        if (!this.state.rules || this.state.rules.length === 0) {
            message.error('操作失败，请选择规则')
            return
        }
        if (!this.state.codeData) {
            message.error('操作失败，内容为空')
            return
        }
        if (!this.props.updateCodeData) {
            console.log('updateCodeData function not found')
            message.error('操作失败，系统错误')
            return
        }
        // yaml转json
        const obj = yamlToObj(this.state.codeData)
        const jsonData = JSON.stringify(obj)
        // 拼接yaml资源内容
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
            // obj转yaml
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
     * 复制
     */
    copyData = () => {
        if (!this.props.data) {
            message.error('复制失败，内容为空')
            return
        }
        copyData(this.props.data)
    }

    /**
     * 下载
     */
    downloadData = () => {
        if (!this.props.data) {
            message.error('无内容可下载')
            return
        }
        downloadData(this.props.data)
    }

    /**
     * 打开配置
     */
    configOpen = () => this.setState({configVisible: true})

    /**
     * 关闭配置
     */
    configClose = () => this.setState({configVisible: false})

    render() {
        return (<>
            <Affix offsetTop={this.state.top}>
                <div className="navBar">
                    <Popover trigger="hover" content="设置">
                        <Button className="ml2" type="primary" onClick={this.configOpen}>
                            <SettingOutlined/>
                        </Button>
                    </Popover>
                    <Popover trigger="hover" content="折叠全部">
                        <Button className="ml2" type="primary" onClick={this.fold}>
                            <PlusSquareOutlined/>
                        </Button>
                    </Popover>
                    <Popover trigger="hover" content="展开全部">
                        <Button className="ml2" type="primary" onClick={this.unfold}>
                            <MinusSquareOutlined/>
                        </Button>
                    </Popover>
                    <Popover trigger="hover" content="解析">
                        <Button className="ml2" type="primary" onClick={this.parse}>
                            <DoubleLeftOutlined/>
                        </Button>
                    </Popover>
                    <Popover trigger="hover" content="构建">
                        <Button className="ml2" type="primary" onClick={this.build}>
                            <DoubleRightOutlined/>
                        </Button>
                    </Popover>
                    <Popover trigger="hover" content="快速开始">
                        <Button className="ml2" type="primary" onClick={this.quickstart}>
                            <ApartmentOutlined/>
                        </Button>
                    </Popover>
                    <Popover trigger="hover" content="复制">
                        <Button className="ml2" type="primary" onClick={this.copyData}>
                            <CopyOutlined/>
                        </Button>
                    </Popover>
                    <Popover trigger="hover" content="下载">
                        <Button className="ml2" type="primary" onClick={this.downloadData}>
                            <DownloadOutlined/>
                        </Button>
                    </Popover>
                </div>
            </Affix>
            <Drawer
                title="高级设置"
                placement="left"
                closable={false}
                visible={this.state.configVisible}
                onClose={this.configClose}
            >
                <p>更多内容，敬请期待</p>
                <Upload {...generateProps}>
                    <Button type="ghost" block>
                        资源定义生成
                    </Button>
                </Upload>
                <Upload {...uploadProps}>
                    <Button type="primary" block>
                        资源上传解析
                    </Button>
                </Upload>
            </Drawer>
            <Modal
                title="Quick Start"
                visible={this.state.isModalVisible}
                onOk={this.handleOk}
                onCancel={this.handleCancel}
            >
                <p>选择规则</p>
                <p>
                    <Cascader
                        className="ml10"
                        placeholder="QuickStartRule Select"
                        options={this.state.ruleOptions || []}
                        onChange={value => this.setRules(value)}
                        showSearch={{filter, matchInputWidth: false}}
                        changeOnSelect
                    />
                </p>
                <p>请填写YAML内容</p>
                <p>
                    <CodeMirror
                        className="quickstart"
                        value={this.state.defaultData}
                        options={{
                            mode: 'yaml',
                            theme: 'material',
                            lineNumbers: true, // 显示行号
                            lineWrapping: true, // 支持代码折叠
                            tabindex: 4,
                        }}
                        editorDidMount={(editor: Editor) => {
                            editor.setSize('auto', 300)
                        }}
                        onChange={(editor: Editor, data: EditorChange, value: string) => {
                            this.setState({codeData: value})
                        }}
                    />
                </p>
            </Modal>
        </>);
    }
}

export default NavBar
