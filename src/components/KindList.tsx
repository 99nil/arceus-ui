import React from "react";
import {Cascader} from 'antd';

const options = [
    {
        value: 'monitoring.coreos.com',
        label: 'monitoring.coreos.com',
        children: [
            {
                value: 'PrometheusRule',
                label: 'PrometheusRule',
                children: [
                    {
                        value: 'v1',
                        label: 'v1',
                    },
                ],
            },
        ],
    }
];

class KindList extends React.Component<any, any> {

    constructor(props: any) {
        super(props);
        this.state = {
            group: '',
            kind: '',
            version: '',
        }
    }

    /**
     * 生成原数据
     * @param value
     */
    generateResource = (value: any) => {
        if (value.length !== 3) return
        console.log(value)
        this.setState({
            group: value[0],
            kind: value[1],
            version: value[2],
        })
        if (this.props.generateResource)
            this.props.generateResource(value[0], value[1], value[2])
    }

    render() {
        return <Cascader
            className="ml10"
            options={options}
            onChange={value => this.generateResource(value)}
            changeOnSelect
        />
    }
}

export default KindList
