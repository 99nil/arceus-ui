import React from "react";
import {Button, Input, Radio, Select} from "antd";
import {DeleteOutlined} from '@ant-design/icons'
import {KV, ND, SourceNode, SourceType} from "../base/base";
import {getNodeByPath, getObjByPath, parseNodesToObj, sourceToNode, updateObjByPath} from "../base";
import {getApiVersions, kind, kubernetesVersions, resources} from "../data/base";
import ReactDOM from "react-dom";
import App from "../index";
import NavBar from "./NavBar";

class Template extends React.Component<any, any> {

    constructor(props: any) {
        super(props);
        this.changeKubernetesVersion = this.changeKubernetesVersion.bind(this)
        const kubernetesVersion = sourceToNode(kubernetesVersions).selects[0].name
        this.state = {
            obj: {},
            kind: '',
            apiVersion: '',
            kubernetesVersion,
            clickIndex: -1,
            resource: [],
        }
    }

    readerForm = (item: ND, index: number) => {
        const kind = item.name
        const name: string = kind.replace(kind[0], kind[0].toLowerCase())
        const resource: SourceNode[] = resources[name]
        console.log(resource)

        /**
         * 循环Object
         * 如果type = String | Number | Boolean，判断 selected，checked，value
         * 如果type = Object，判断 items
         * 如果type = Array，判断 items 是否为空。不为空则为Object Array，为空则为 String Array
         */
        this.setState({
            kind: item.name,
            apiVersion: getApiVersions(this.state.kubernetesVersion, kind).value,
            clickIndex: index,
            resource,
            obj: parseNodesToObj(resource),
        })
        ReactDOM.render(<App/>, document.getElementById('root'));
    }

    changeKubernetesVersion(kubernetesVersion: string) {
        this.setState({kubernetesVersion})
    }

    addEmptyObjectItem(e: any) {
        let obj: any = this.state.obj
        const path = e.target.getAttribute("data-path")
        const resource = this.state.resource
        const node = getNodeByPath(path, resource)
        if (!node) {
            return
        }
        if (node.type === SourceType.Object && node.items.length === 0) {
            const paths = path.split('.')
            paths[paths.length - 1] = '_' + paths[paths.length - 1]
            let special: KV[] | null = getObjByPath(obj, paths)
            if (!special) {
                special = []
            }
            special.push({key: '', value: ''})
            obj = updateObjByPath(obj, paths, special)
            this.setState({obj})
        }
    }

    delEmptyObjectItem(e: any) {
        let obj: any = this.state.obj
        const parent = e.target.parentElement
        const paths = parent.getAttribute("data-path").split('.')
        const index = parent.getAttribute("data-index")
        paths[paths.length - 1] = '_' + paths[paths.length - 1]
        let special: KV[] | null = getObjByPath(obj, paths)
        if (!special) {
            return
        }
        // 需要undefined占位，否则会导致删除的不是选中
        // special.splice(index, 1)
        delete special[index]
        obj = updateObjByPath(obj, paths, special)
        this.setState({obj})
    }

    changeEmptyObjectItem(e: any) {
        let obj: any = this.state.obj
        const parent = e.target.parentElement
        const field = e.target.getAttribute('data-field')
        const paths = parent.getAttribute("data-path").split('.')
        const index = parent.getAttribute("data-index")
        paths[paths.length - 1] = '_' + paths[paths.length - 1]
        paths.push(index)
        let special: KV | null = getObjByPath(obj, paths)
        if (!special) {
            return
        }
        if (field === 'key') {
            special.key = e.target.value
        } else {
            special.value = e.target.value
        }
        obj = updateObjByPath(obj, paths, special)
        this.setState({obj})
    }

    buildEmptyObject(path: string, key: number, item: SourceNode, special: KV[] = []) {
        return (
            <li key={key} className="flex">
                <label className="label-flex">{item.title}：</label>
                <div className="item-flex">
                    <Button
                        type="primary"
                        data-path={path}
                        onClick={(e) => this.addEmptyObjectItem(e)}
                    >
                        添加
                    </Button>
                    <ul>
                        {special.map((item, index) => {
                            return this.generateEmptyObject(item, path, index)
                        })}
                    </ul>
                </div>
            </li>
        )
    }

    generateEmptyObject(item: KV, path: string, index: number) {
        return (
            <li data-path={path} data-index={index} key={index}>
                <input
                    data-field="key"
                    defaultValue={item.key}
                    style={{width: '40%'}}
                    onChange={(e) => this.changeEmptyObjectItem(e)}
                />
                <span style={{width: '5%'}}>:</span>
                <input
                    data-field="value"
                    defaultValue={item.value}
                    style={{width: '40%'}}
                    onChange={(e) => this.changeEmptyObjectItem(e)}
                />
                <Button
                    type="primary"
                    icon={<DeleteOutlined/>}
                    danger
                    style={{marginLeft: '2%', width: '10%'}}
                    onClick={(e) => this.delEmptyObjectItem(e)}
                />
            </li>
        )
    }

    addEmptyArrayItem(e: any) {
        let obj: any = this.state.obj
        const path = e.target.getAttribute("data-path")
        const resource = this.state.resource
        const node = getNodeByPath(path, resource)
        if (!node) {
            return
        }
        if (node.type === SourceType.Array && node.items.length === 0) {
            const paths = path.split('.')
            let arr: string[] | null = getObjByPath(obj, paths)
            if (!arr) {
                arr = []
            }
            arr.push('')
            obj = updateObjByPath(obj, paths, arr)
            this.setState({obj})
        }
    }

    delEmptyArrayItem(e: any) {
        let obj: any = this.state.obj
        const parent = e.target.parentElement
        const paths = parent.getAttribute("data-path").split('.')
        const index = parent.getAttribute("data-index")
        let arr: KV[] | null = getObjByPath(obj, paths)
        if (!arr) {
            return
        }
        // 需要undefined占位，否则会导致删除的不是选中
        // special.splice(index, 1)
        delete arr[index]
        obj = updateObjByPath(obj, paths, arr)
        this.setState({obj})
    }

    changeEmptyArrayItem(e: any) {
        let obj: any = this.state.obj
        const parent = e.target.parentElement
        const paths = parent.getAttribute("data-path").split('.')
        const index = parent.getAttribute("data-index")
        paths.push(index)
        obj = updateObjByPath(obj, paths, e.target.value)
        console.log(obj)
        this.setState({obj})
    }

    buildEmptyArray(path: string, key: number, item: SourceNode, arrayData: string[]) {
        return (
            <li key={key} className="flex">
                <label className="label-flex">{item.title}：</label>
                <div className="item-flex">
                    <Button
                        type="primary"
                        data-path={path}
                        onClick={(e) => this.addEmptyArrayItem(e)}
                    >
                        添加
                    </Button>
                    <ul>
                        {arrayData.map((v, index) => {
                            return (
                                <li data-path={path + '.' + index} key={index}>
                                    <input
                                        defaultValue={v}
                                        style={{width: '40%'}}
                                        onChange={(e) => this.changeEmptyArrayItem(e)}
                                    />
                                    <Button
                                        type="primary"
                                        icon={<DeleteOutlined/>}
                                        danger
                                        style={{marginLeft: '2%', width: '10%'}}
                                        onClick={(e) => this.delEmptyArrayItem(e)}
                                    />
                                </li>
                            )
                        })}
                    </ul>
                </div>
            </li>
        )
    }

    buildArray(path: string, key: number, item: SourceNode, arrayData: any[]) {
        return (
            <li key={key} className="flex">
                <label className="label-flex">{item.title}：</label>
                <div className="item-flex">
                    <Button
                        type="primary"
                        data-path={path}
                        onClick={(e) => this.addArrayItem(e)}
                    >
                        添加
                    </Button>
                    <div>
                        {arrayData.map((v: any, index: number) => {
                            return (
                                <ul key={index} className="manor">
                                    {this.build(v, path + '.' + index)}
                                </ul>
                            )
                        })}
                    </div>
                </div>
            </li>
        )
    }

    addArrayItem(e: any) {
        let obj: any = this.state.obj
        const path = e.target.getAttribute("data-path")
        const resource = this.state.resource
        const node = getNodeByPath(path, resource)
        if (!node) {
            return
        }
        if (node.type === SourceType.Array && node.items.length > 0) {
            const paths = path.split('.')
            let arr: any[] | null = getObjByPath(obj, paths)
            if (!arr) {
                arr = []
            }
            arr.push(parseNodesToObj(node.items))
            obj = updateObjByPath(obj, paths, arr)
            this.setState({obj})
        }
    }

    build(obj: any, path: string = ''): any {
        path = path === '' ? path : path + '.'
        return Object.keys(obj).map((k, index) => {
            if (!obj.hasOwnProperty(k)) {
                return null
            }
            // 拼接path，判断类型，如果obj继续往下递归
            const p = path + k
            const node = getNodeByPath(p, this.state.resource)
            if (!node) {
                return null
            }
            switch (node.type) {
                case SourceType.Object:
                    if (node.items.length === 0) {
                        return this.buildEmptyObject(p, index, node, obj['_' + k])
                    } else {
                        return this.build(obj[k], p)
                    }
                case SourceType.Array:
                    if (node.items.length === 0) {
                        return this.buildEmptyArray(p, index, node, obj[k])
                    } else {
                        return this.buildArray(p, index, node, obj[k])
                    }
                default:
                    if (node.selects.length > 0) {
                        return this.generateSelect(p, index, node)
                    } else if (node.checked.length > 0) {
                        return this.generateRadio(p, index, node)
                    } else {
                        return this.generateInput(p, index, node)
                    }
            }
        })
    }

    generateInput(path: string, key: number, item: SourceNode) {
        return (
            <li key={key} className="flex">
                <label className="label-flex">{item.title}：</label>
                <div className="item-flex">
                    <Input data-path={path} defaultValue={item.value}/>
                </div>
            </li>
        )
    }

    generateRadio(path: string, key: number, item: SourceNode) {
        return (
            <li key={key} className="flex">
                <label className="label-flex">{item.title}：</label>
                <div className="item-flex">
                    <Radio.Group data-path={path} defaultValue={item.checked[0].name}>
                        {item.checked.map((v, index) => {
                            return <Radio value={v.name} key={index}>{v.desc}</Radio>
                        })}
                    </Radio.Group>
                </div>
            </li>
        )
    }

    generateSelect(path: string, key: number, item: SourceNode) {
        return (
            <li key={key} className="flex">
                <label className="label-flex">{item.title}：</label>
                <div className="item-flex">
                    <Select data-path={path} defaultValue={item.selects[0].name} style={{width: '100%'}}>
                        {item.selects.map((v, index) => {
                            return <Select.Option value={v.name} key={index}>{v.name}</Select.Option>
                        })}
                    </Select>
                </div>
            </li>
        )
    }

    render() {
        return (
            <div>
                <NavBar changeVersion={this.changeKubernetesVersion}/>
                <div>
                    {sourceToNode(kind).selects.map((item: ND, index: number) => {
                        return <Button
                            type="primary"
                            className={this.state.clickIndex === index ? 'ml10 back-green' : 'ml10'}
                            key={index}
                            onClick={() => this.readerForm(item, index)}
                        >
                            {item.desc}
                        </Button>
                    })}
                </div>
                <div className="generate">
                    <div>
                        {this.state.kind === '' ? '' :
                            <h3 className="title-one">{this.state.kind} {this.state.apiVersion}</h3>}
                        <ul>
                            {this.build(this.state.obj)}
                        </ul>
                    </div>
                </div>
            </div>
        )
    }
}

export default Template
