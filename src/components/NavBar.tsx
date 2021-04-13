import React from "react";
import {message, Affix, Button, Popover, Drawer} from "antd";
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
import {randomString} from "../base";

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
        if (!this.props.data) message.error('无内容可下载')
        const element = document.createElement('a');
        element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(this.props.data));
        const filename = randomString(6) + '.yml'
        element.setAttribute('download', filename);
        element.style.display = 'none';
        document.body.appendChild(element);
        element.click();
        document.body.removeChild(element);
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
                    <Popover trigger="hover" content="粘贴">
                        <Button className="ml2" type="primary" onClick={this.downloadData}>
                            <DownloadOutlined/>
                        </Button>
                    </Popover>
                    <Popover trigger="hover" content="设置">
                        <Button className="ml2" type="primary" onClick={this.configOpen}>
                            <SettingOutlined/>
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
                <p>敬请期待</p>
            </Drawer>
        </>);
    }
}

export default NavBar
