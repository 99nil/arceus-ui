import React from "react";
import {message, Affix, Button, Popover, Drawer, Upload} from "antd";
import {
    PlusSquareOutlined,
    MinusSquareOutlined,
    CopyOutlined,
    DownloadOutlined,
    DoubleLeftOutlined,
    DoubleRightOutlined,
    SettingOutlined
} from '@ant-design/icons'
import './index.css'
import {downloadData} from "../base";
import {generateURL, uploadURL} from "../api/resource";
import {createURL} from "../api/template";

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

const templateProps = {
    name: 'file',
    action: createURL,
    showUploadList: false,
    maxCount: 1,
    onChange(info: any) {
        if (info.file.status === 'error') {
            message.error(`${info.file.name} file upload failed: `, info.file.response)
            return
        }
        if (info.file.status === 'done') {
            message.success(`${info.file.name} file uploaded successfully`)
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
        }
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
     * 复制
     */
    copyData = () => {
        let text = document.createElement("textarea");    // 直接构建textarea
        text.value = this.props.data                               // 设置内容
        document.body.appendChild(text);                           // 添加临时实例
        text.select();                                             // 选择实例内容
        document.execCommand("Copy");                  // 执行复制
        document.body.removeChild(text);                           // 删除临时实例
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
                <Upload {...templateProps}>
                    <Button type="primary" block>
                        模板添加
                    </Button>
                </Upload>
            </Drawer>
        </>);
    }
}

export default NavBar
