import React from "react";
import {Button} from "antd";
import {Deployment, getApiVersions, kind, kubernetesDefaultVersion, resources, treeResources} from "../data/base";
import {ND} from "../base/base";
import {sourceToNode, strToLowerCase} from "../base";

class KindList extends React.Component<any, any> {

    constructor(props: any) {
        super(props);
        this.state = {
            kind: Deployment,
            clickIndex: -1,
        }
    }

    // 生成原数据
    generateResource = (item: ND, index: number) => {
        this.setState({
            kind: item.name,
            clickIndex: index,
        })
        if (this.props.generateResource)
            this.props.generateResource(item.name, this.getResource(item.name, this.props.resourceType))
    }

    /**
     * 根据kind获取资源
     * @param kind
     * @param type
     */
    getResource = (kind: string, type: string = '') => {
        const version = this.props.version || kubernetesDefaultVersion
        const apiVersionNode = getApiVersions(version, kind)
        const kindLow = strToLowerCase(kind)
        return type === 'tree' ?  [apiVersionNode, ...treeResources[kindLow]] : [apiVersionNode, ...resources[kindLow]]
    }

    render() {
        return (
            <div>
                {sourceToNode(kind).selects.map((item: ND, index: number) => {
                    return <Button
                        type="primary"
                        className={this.state.clickIndex === index ? 'ml10 back-green' : 'ml10'}
                        key={index}
                        onClick={() => this.generateResource(item, index)}
                    >
                        {item.name}
                    </Button>
                })}
            </div>
        )
    }
}

export default KindList
