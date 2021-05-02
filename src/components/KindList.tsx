import React from "react";
import {Cascader} from 'antd';
import {list} from "../api/resource";
import {info as templateInfo, list as templateList} from "../api/template";
import {CascaderOptionType} from "antd/lib/cascader";

function filter(inputValue: string, path: CascaderOptionType[]) {
    if (path.length !== 3) return false
    return path.some((option: any) => option.label.toLowerCase().indexOf(inputValue.toLowerCase()) > -1);
}

class KindList extends React.Component<any, any> {

    constructor(props: any) {
        super(props);
        this.state = {
            options: [],
            customOptions: [],
            templateOptions: [],
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

    generateWithObjAndData = (value: any) => {
        if (value.length !== 3) return
        if (this.props.generateWithObjAndData)
            templateInfo({
                group: value[0],
                kind: value[1],
                version: value[2],
            }).then((result: any) => {
                if (!result) return
                for (const v of result) {
                    this.props.generateWithObjAndData(v.data, v.template)
                }
            })
    }

    getOptions = () => {
        const that = this
        list().then((result: any) => {
            if (!result) return
            that.setState({options: result})
        })
        list('custom').then((result: any) => {
            if (!result) return
            that.setState({customOptions: result})
        })
        templateList().then((result: any) => {
            if (!result) return
            that.setState({templateOptions: result})
        })
    }

    render() {
        return <div>
            <Cascader
                className="ml10"
                placeholder="Base Resource Select"
                options={this.state.options || []}
                onChange={value => this.generateResource(value)}
                showSearch={{filter, matchInputWidth: false}}
                changeOnSelect
            /><br/>
            <Cascader
                className="ml10 mt5"
                placeholder="Custom Resource Select"
                options={this.state.customOptions || []}
                onChange={value => this.generateResource(value)}
                showSearch={{filter, matchInputWidth: false}}
                changeOnSelect
            /><br/>
            <Cascader
                className="ml10 mt5"
                placeholder="Template Select"
                options={this.state.templateOptions || []}
                onChange={value => this.generateWithObjAndData(value)}
                showSearch={{filter, matchInputWidth: false}}
                changeOnSelect
            />
        </div>
    }
}

export default KindList
