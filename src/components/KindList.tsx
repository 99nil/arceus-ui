import React from "react";
import {Cascader} from 'antd';
import {list} from "../api/resource";

class KindList extends React.Component<any, any> {

    constructor(props: any) {
        super(props);
        this.state = {
            options: [],
            customOptions: [],
        }
        this.getOptions()
    }

    /**
     * 生成原数据
     * @param value
     */
    generateResource = (value: any) => {
        if (value.length !== 3) return
        if (this.props.generateResource)
            this.props.generateResource(value[0], value[1], value[2])
    }

    getOptions = () => {
        const that = this
        list().then((result: any) => {
            that.setState({options: result})
        })
        list('custom').then((result: any) => {
            that.setState({customOptions: result})
        })
    }

    render() {
        return <div>
            <Cascader
                className="ml10"
                placeholder="Base Resource Select"
                options={this.state.options}
                onChange={value => this.generateResource(value)}
                changeOnSelect
            /><br/>
            <Cascader
                className="ml10 mt5"
                placeholder="Custom Resource Select"
                options={this.state.customOptions}
                onChange={value => this.generateResource(value)}
                changeOnSelect
            />
        </div>
    }
}

export default KindList
