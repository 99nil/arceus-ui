import React from "react";
import {Cascader} from 'antd';
import {list} from "../api/resource";

class KindList extends React.Component<any, any> {

    constructor(props: any) {
        super(props);
        this.state = {
            options: [],
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
        list().then(function (result) {
            that.setState({options: result})
        })
    }

    render() {
        return <Cascader
            className="ml10"
            options={this.state.options}
            onChange={value => this.generateResource(value)}
            changeOnSelect
        />
    }
}

export default KindList
