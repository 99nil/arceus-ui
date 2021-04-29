import React from "react";
import {Button, Input, message, Popover, Select, Tree, Modal} from "antd";
import {MinusCircleOutlined, PlusCircleOutlined, PlusSquareOutlined, ExclamationCircleOutlined} from '@ant-design/icons'
import KindList from "./KindList";
import {ArrayNode, ND, SourceType, TNode} from "../base/base";
import {
    convertValueByType,
    getTreeNodeByPath,
    objToYaml,
    randomString,
    updateTreeNodeByPath, yamlToObjMulti,
} from "../base";
import {InfoParamsType, tree} from "../api/resource";
import TextArea from "antd/lib/input/TextArea";

const {confirm} = Modal;

class CTree extends React.Component<any, any> {

    constructor(props: any) {
        super(props);
        this.state = {
            kindRef: React.createRef(),
            data: [],
            expandedKeys: [],
        }
    }

    /**
     * 构建完整数据结构
     * @param data 元数据
     * @param prefix 额外添加的前缀
     * @param cutPrefix 需要被替换的前缀
     */
    buildFullData = (data: any, prefix: string = '', cutPrefix: string = ''): any => {
        if (prefix === '') prefix = randomString(6)
        let result: any = {}
        for (let k in data) {
            if (!data.hasOwnProperty(k)) continue
            result[k] = data[k]
        }
        result.children = []
        result._children = []
        let children = data.children
        if (data._children && data._children.length > 0) children = data._children
        for (let k in children) {
            if (!children.hasOwnProperty(k)) continue
            result._children.push(this.buildFullData(children[k], prefix, cutPrefix))
        }
        if (data.required && data.required.length > 0) {
            for (let vv of data.children) {
                if (data.required.indexOf(vv.name) === -1) continue
                let child = this.buildFullData(vv, prefix, cutPrefix)
                child.stats = {
                    isRequired: true,
                    isEdit: true,
                }
                // 设置默认字段不允许编辑
                if (['root.apiVersion', 'root.kind'].indexOf(child.key) !== -1) child.stats.isEdit = false
                result.children.push(child)
            }
        }

        // 添加节点状态
        if (!result.stats) result.stats = {
            isRequired: false,
            isEdit: true,
        }
        // 重构节点唯一key
        if (cutPrefix !== '') {
            result.key = result.key.replace(cutPrefix, prefix)
        } else {
            result.key = prefix + '.' + result.key
        }
        // 构建Base Element元素标题
        switch (result.type) {
            case 'array':
                result.title = this.createAppendArrayNode(
                    result.key,
                    this.createMenuTitle(result.key, result)
                )
                break
            case 'object': // 对象节点，object string/string
                if (result._children.length === 0) {
                    result.title = this.createAppendObjectNode(result.key, result)
                } else {
                    result.title = this.createMenuTitle(result.key, result)
                }
                break
            case 'boolean':
                const options: ND[] = [
                    {name: 'false', desc: 'false'},
                    {name: 'true', desc: 'true'},
                ]
                if (result.value === '') result.value = options[0].name
                result.title = this.createPrefixNode(
                    this.createMenuTitle(result.key, result),
                    this.createSelectNode(result.key, options, result.value)
                )
                break
            default:
                // 构建Select Element元素标题
                if (result.enums && result.enums.length > 0) {
                    let options: ND[] = []
                    for (const v of result.enums) {
                        options.push({
                            name: v,
                            desc: v,
                        })
                    }
                    if (result.value === '' && options.length > 0) result.value = options[0].name
                    result.title = this.createPrefixNode(
                        this.createMenuTitle(result.key, result),
                        this.createSelectNode(result.key, options, result.value)
                    )
                } else {
                    result.title = this.createPrefixNode(
                        this.createMenuTitle(result.key, result),
                        this.createInputNode(result.key, result.value)
                    )
                }
                break
        }
        return result
    }

    /**
     * 根据obj值构建完整数据结构
     * @param data
     * @param prefix
     * @param cutPrefix
     * @param obj
     */
    buildFullDataWithObj = (data: any, prefix: string = '', cutPrefix: string = '', obj: any = {}): any => {
        if (prefix === '') prefix = randomString(6)
        let result: any = {}
        for (let k in data) {
            if (!data.hasOwnProperty(k)) continue
            result[k] = data[k]
        }
        result.children = []
        result._children = []
        let children = data.children
        if (data._children && data._children.length > 0) children = data._children
        for (let k in children) {
            if (!children.hasOwnProperty(k)) continue
            const v = children[k]
            result._children.push(this.buildFullData(v, prefix, cutPrefix))

            if (!obj || !obj.hasOwnProperty(v.name)) continue
            result.children.push(this.buildFullDataWithObj(v, prefix, cutPrefix, obj[v.name]))
        }

        if (data.required && data.required.length > 0 && !obj) {
            for (let vv of data.children) {
                if (data.required.indexOf(vv.name) === -1) continue
                let child = this.buildFullData(vv, prefix, cutPrefix)
                child.stats = {
                    isRequired: true,
                    isEdit: true,
                }
                // 设置默认字段不允许编辑
                if (['root.apiVersion', 'root.kind'].indexOf(child.key) !== -1) child.stats.isEdit = false
                result.children.push(child)
            }
        }

        // 添加节点状态
        if (!result.stats) result.stats = {
            isRequired: false,
            isEdit: true,
        }
        // 重构节点唯一key
        if (cutPrefix !== '') {
            result.key = result.key.replace(cutPrefix, prefix)
        } else {
            result.key = prefix + '.' + result.key
        }
        // 构建Base Element元素标题
        switch (result.type) {
            case 'array':
                result.title = this.createAppendArrayNode(
                    result.key,
                    this.createMenuTitle(result.key, result)
                )
                if (obj) {
                    for (const k in obj) {
                        if (!obj.hasOwnProperty(k)) continue
                        // 默认构建普通数组节点
                        const tNode = this.buildFullDataWithObj(
                            result._children[0],
                            result.key + '.' + k,
                            result.key,
                            obj[k]
                        )
                        result.children.push(tNode)
                    }
                }
                break
            case 'object': // 对象节点，object string/string
                if (result._children.length > 0) {
                    result.title = this.createMenuTitle(result.key, result)
                    break
                }
                result.title = this.createAppendObjectNode(result.key, result)
                if (obj) {
                    for (const k in obj) {
                        if (!obj.hasOwnProperty(k)) continue
                        const key = result.key + '.' + randomString(6)
                        result.children.push({
                            key,
                            name: k,
                            title: this.createKVInputNode(key, k, obj[k]),
                            type: SourceType.String,
                            value: obj[k],
                            children: [],
                        })
                    }
                }
                break
            case 'boolean':
                result.value = obj ? obj.toString() : result.value
                const options: ND[] = [
                    {name: 'false', desc: 'false'},
                    {name: 'true', desc: 'true'},
                ]
                if (result.value === '') result.value = options[0].name
                result.title = this.createPrefixNode(
                    this.createMenuTitle(result.key, result),
                    this.createSelectNode(result.key, options, result.value)
                )
                break
            default:
                result.value = obj ? obj.toString() : result.value
                // 构建Select Element元素标题
                if (result.enums && result.enums.length > 0) {
                    let options: ND[] = []
                    for (const v of result.enums) {
                        options.push({
                            name: v,
                            desc: v,
                        })
                    }
                    if (result.value === '' && options.length > 0) result.value = options[0].name
                    result.title = this.createPrefixNode(
                        this.createMenuTitle(result.key, result),
                        this.createSelectNode(result.key, options, result.value)
                    )
                } else {
                    result.title = this.createPrefixNode(
                        this.createMenuTitle(result.key, result),
                        this.createInputNode(result.key, result.value)
                    )
                }
                break
        }
        return result
    }

    /**
     * 生成Yaml字符串
     */
    convertToYaml = () => {
        if (this.props.buildYamlData) {
            let data: any[] = []
            for (const v of this.state.data) {
                const item = this.parseTreeToObj([v])
                data.push(item)
            }
            const yamlData = objToYaml(data)
            this.props.buildYamlData(yamlData)
        }
    }

    /**
     * 解析操作 展示提示框
     * @param fn
     */
    showParseConfirm = (fn: any) => {
        confirm({
            title: 'Do you Want to parse these items?',
            icon: <ExclamationCircleOutlined/>,
            content: 'Note: it will cover the original target.',
            onOk() {
                fn()
            },
            onCancel() {
                // console.log('Cancel');
            },
        });
    }

    /**
     * yaml生成树结构
     * @param code
     */
    convertToTreeData = (code: string) => {
        let obj: any
        try {
            obj = yamlToObjMulti(code)
        } catch (e) {
            message.error('Yaml格式错误')
            return
        }
        const that = this
        this.showParseConfirm(() => {
            for (const k in obj) {
                if (!obj.hasOwnProperty(k)) continue
                const v = obj[k]
                const apiVersion = v.apiVersion
                const kind = v.kind
                const versionData = apiVersion.split('/')
                if (versionData.length === 1) versionData.unshift('core')
                const params: InfoParamsType = {
                    kind,
                    group: versionData[0],
                    version: versionData[1],
                }
                that.setState({data: []})
                tree(params).then(function (result: any) {
                    if (!result) return
                    const fullData = that.buildFullDataWithObj(result, '', '', v)
                    const data = [...that.state.data, fullData]
                    that.setState({data, expandedKeys: that.getExpandedKeys(data)})
                }).catch(function (reason) {
                    console.log(reason)
                })
            }
        })
    }

    /**
     * 获取kind对应的渲染数据，并向数据集中增加一组
     * @param group
     * @param kind
     * @param version
     */
    generateResource = (group: string, kind: string, version: string) => {
        const that = this
        const params: InfoParamsType = {group, kind, version}
        tree(params).then(function (result: any) {
            if (!result) return
            const fullData = that.buildFullData(result)
            const data = [...that.state.data, fullData]
            that.setState({data, expandedKeys: that.getExpandedKeys(data)})
        })
    }

    /**
     * tree转obj
     * @param nodes
     * @return any
     */
    parseTreeToObj = (nodes: any[]): any => {
        let obj: any = {}
        for (const v of nodes) {
            switch (v.type) {
                case SourceType.Object:
                    obj[v.name] = this.parseTreeToObj(v.children)
                    if (v.name === 'root') obj = obj[v.name]
                    break
                case SourceType.Array:
                    let arr = []
                    for (const va of v.children) {
                        if (va.type === SourceType.Object) {
                            if (va.children.length > 0) arr.push(this.parseTreeToObj(va.children))
                        } else {
                            if (va.value !== '') arr.push(convertValueByType(va.value, va.type))
                        }
                    }
                    obj[v.name] = arr
                    break
                default:
                    if (v.name !== '') obj[v.name] = convertValueByType(v.value, v.type)
                    break
            }
        }
        return obj
    }

    /**
     * 添加select节点
     * @param selectData
     * @param path
     * @param value
     * @return React.ReactNode
     */
    createSelectNode = (path: string, selectData: ND[], value: string = '') => {
        let optionData = []
        for (const v of selectData) {
            optionData.push({
                label: v.name,
                value: JSON.stringify({value: v.name, path})
            })
        }
        const defaultValue = JSON.stringify({
            value: value === '' ? selectData[0].name : value,
            path
        })
        return <Select
            defaultValue={defaultValue}
            className="selectStyle"
            onChange={this.changeSelectValue}
            key={path + randomString(3)}
            options={optionData}
        />
    }

    /**
     * 添加input文本节点
     * @param path
     * @param value
     * @return React.ReactNode
     */
    createInputNode = (path: string, value: string = '') => {
        return <TextArea
            style={{height: '35px', minHeight: '35px'}}
            data-path={path}
            onChange={this.changeInputValue}
            defaultValue={value}
        />
    }

    /**
     * 添加K/V input文本节点
     * @param path
     * @param name
     * @param value
     * @return React.ReactNode
     */
    createKVInputNode = (path: string, name: string = '', value: string = '') => {
        return this.createPrefixNode(<Input
            data-path={path}
            style={{width: '150px', height: '80%'}}
            onChange={e => this.changeInputValue(e, false)}
            defaultValue={name}
        />, this.createDeleteNode(path, this.createInputNode(path, value)))
    }

    /**
     * 添加数组input文本节点
     * @param path
     */
    createArrInputNode = (path: string) => this.createPrefixNode(ArrayNode, this.createDeleteNode(path, this.createInputNode(path)))

    /**
     * 创建移除节点按钮
     * @param path
     * @param node
     */
    createDeleteNode = (path: string, node: React.ReactNode) => {
        return (<>
            <span className="floatLeft">{node}</span>
            <span className="floatLeft">
                <Button
                    data-path={path}
                    type='link'
                    icon={<MinusCircleOutlined/>}
                    danger
                    onClick={this.removeObjItem}
                />
            </span>
        </>)
    }

    /**
     * 添加数组按钮节点
     * @param path
     * @param node
     * @return React.ReactNode
     */
    createAppendArrayNode = (path: string, node: React.ReactNode) => {
        return (
            <div className="flex">
                <span className="f1">{node}</span>
                <Button
                    className="f1"
                    data-path={path}
                    type="link"
                    icon={<PlusCircleOutlined/>}
                    style={{marginTop: '-4px'}}
                    onClick={this.addArrItem}
                />
            </div>
        )
    }

    /**
     * 添加对象按钮节点
     * @param path
     * @param source
     * @return React.ReactNode
     */
    createAppendObjectNode = (path: string, source: any) => {
        return (
            <div className="flex">
                <span className="f1">{this.createMenuTitle(path, source)}</span>
                <Button
                    className="f1"
                    data-path={path}
                    type="link"
                    icon={<PlusSquareOutlined/>}
                    style={{marginTop: '-4px'}}
                    onClick={this.addObjItem}
                />
            </div>
        )
    }

    /**
     * 创建节点前缀
     * @param name
     * @param node
     * @return React.ReactNode
     */
    createPrefixNode = (name: React.ReactNode, node: React.ReactNode) => {
        return (
            <span className="ant-input-wrapper ant-input-group">
                <span className="ant-input-group-addon"> {name} </span>
                <span> {node} </span>
            </span>
        )
    }

    /**
     * 构建标题
     * @param title
     * @param tipContent
     * @param key
     * @return React.ReactNode
     */
    createTitle = (title: React.ReactNode, tipContent: string, key: number = 0) => {
        if (tipContent === '') return title
        return <Popover
            content={tipContent}
            trigger="hover"
            arrowPointAtCenter
            key={key}
        > {title} </Popover>
    }

    // 构建移除菜单
    createDeleteMenu = (path: string, isArray: boolean = false) => {
        return <Button
            key="del"
            data-path={path}
            className="ml2"
            type="primary"
            onClick={isArray ? this.removeObjItem : this.removeItem}

            style={{margin: '5px'}}
            danger
        > delete </Button>
    }

    /**
     * 构建子项菜单
     * @param path 节点唯一路径标识
     * @param source 该节点数据集
     * @param childs 该节点当前渲染的子节点集合
     * @return React.ReactNode
     */
    createMenuTitle = (path: string, source: any, childs: string[] = []) => {
        // 获取未渲染的子项
        let desc = ''
        if (source.descs && source.descs.length > 0) desc = source.descs[0].desc
        let notExistChildren = []
        if (!childs || childs.length === 0)
            for (const item of source.children) childs.push(item.name)
        for (const item of source._children) if (childs.indexOf(item.name) === -1) notExistChildren.push(item)
        // 如果子项都渲染过并且为required节点， 则直接返回
        if (notExistChildren.length === 0 && source.stats.isRequired) return this.createTitle(source.name, desc)
        // 渲染不存在子项选择
        let set = notExistChildren.map((child, index) => {
            // TODO 支持根据zh/en自动识别渲染
            let desc = ''
            if (child.descs && child.descs.length > 0) desc = child.descs[0].desc
            return this.createTitle(<Button
                data-path={path}
                data-name={child.name}
                className="ml2"
                type="primary"
                key={index}
                onClick={this.addItemFromMenu}
                style={{margin: '5px'}}
            > {child.name} </Button>, desc, index)
        })
        // 不是required节点或者数组节点，构建基础菜单
        if (!source.stats.isRequired) set.unshift(this.createDeleteMenu(path, source.type === SourceType.Array))
        if (source.type === SourceType.Array) set = [this.createDeleteMenu(path, source.type === SourceType.Array)]
        return this.createTitle(<Popover
            trigger="click"
            content={<div style={{maxWidth: '500px'}}>{set}</div>}
            arrowPointAtCenter
        > {source.name} </Popover>, desc)
    }

    /**
     * 同步菜单项
     * @param path
     * @param addSet  需要添加的子项菜单名
     * @param delSet  需要移除的子项菜单名
     */
    syncItemMenu = (path: string, addSet: string[] = [], delSet: string[] = []) => {
        // 获取选中节点
        const node = getTreeNodeByPath(path, this.state.data)
        if (!node) return
        let expandedKeys = this.state.expandedKeys

        // 添加或移除子项
        const children = [...node.children]
        for (const s of node._children) {
            if (delSet.indexOf(s.name) > -1) {
                let delStatus = true
                for (const c of children) {
                    if (c.name === s.name) {
                        delStatus = false
                        break
                    }
                }
                if (delStatus) {
                    children.push(s)
                    if (expandedKeys.indexOf(s.key) === -1) expandedKeys.push(s.key)
                }
            }
            if (addSet.indexOf(s.name) > -1) {
                let addIndex = -1
                for (const ck in children) {
                    if (children[ck].name === s.name) {
                        addIndex = parseInt(ck)
                        break
                    }
                }
                children.splice(addIndex, 1)
            }
        }
        let cs = []
        for (const v of children) cs.push(v.name)
        node.title = this.createMenuTitle(path, node, cs)
        node.children = children
        if (expandedKeys.indexOf(node.key) === -1) expandedKeys.push(node.key)
        // 更新选中节点
        const data = updateTreeNodeByPath(path, this.state.data, node)
        this.setState({data, expandedKeys})
    }

    addItemFromMenu = (e: any) => {
        const path = e.currentTarget.getAttribute('data-path')
        const name = e.currentTarget.getAttribute('data-name')
        this.syncItemMenu(path, [], [name])
    }

    /**
     * 添加arr节点子项
     * @param e
     */
    addArrItem = (e: any) => {
        const path = e.currentTarget.getAttribute('data-path')
        // 根据path获取到tree的数组节点
        const node = getTreeNodeByPath(path, this.state.data)
        if (!node || node._children.length === 0) return
        // 获取实际渲染数组节点数量
        const nodeChildNum = node.children.length
        // 默认构建普通数组节点
        const keyPath = path + '.' + nodeChildNum
        // 数组节点添加需要重新构造添加后的所有子项key
        const tNode = this.buildFullData(node._children[0], keyPath, path)
        let expandedKeys = this.state.expandedKeys
        if (tNode.type === 'object') {
            if (expandedKeys.indexOf(node.key) === -1) expandedKeys.push(node.key)
            if (expandedKeys.indexOf(tNode.key) === -1) expandedKeys.push(tNode.key)
        }
        node.children.push(tNode)
        // 根据path更新tree
        const data = updateTreeNodeByPath(path, this.state.data, node)
        this.setState({data, expandedKeys})
    }

    /**
     * 添加obj节点子项
     * @param e
     */
    addObjItem = (e: any) => {
        const path = e.currentTarget.getAttribute('data-path')
        // 根据path获取tree节点信息
        const node = getTreeNodeByPath(path, this.state.data)
        if (!node) return
        const key = path + '.' + randomString(6)
        const tNode = {
            key,
            name: '',
            title: this.createKVInputNode(key),
            type: SourceType.String,
            value: '',
            children: [],
        }
        let expandedKeys = this.state.expandedKeys
        if (expandedKeys.indexOf(path) === -1) expandedKeys.push(path)
        node.children.push(tNode)
        const data = updateTreeNodeByPath(path, this.state.data, node)
        this.setState({data, expandedKeys})
    }

    /**
     * 移除节点数组/KV子项
     * @param e
     */
    removeObjItem = (e: any) => {
        const path = e.currentTarget.getAttribute('data-path')
        const node = getTreeNodeByPath(path, this.state.data)
        if (!node) return
        let data = updateTreeNodeByPath(path, this.state.data, null)
        this.setState({data})
    }

    /**
     * 移除节点子项
     * @param e
     */
    removeItem = (e: any) => {
        const path = e.currentTarget.getAttribute('data-path')
        const node = getTreeNodeByPath(path, this.state.data)
        if (!node) return
        let data = updateTreeNodeByPath(path, this.state.data, null)
        this.setState({data})
        // 存在父节点，更新menu
        const pathArr = path.split('.')
        const pathLen = pathArr.length
        if (pathLen === 1) return
        const parentPath = pathArr.slice(0, pathLen - 1).join('.')
        this.syncItemMenu(parentPath, [node.name])
    }

    /**
     * 修改select内容
     * @param val
     */
    changeSelectValue = (val: string) => {
        const valObj = JSON.parse(val)
        const node = getTreeNodeByPath(valObj.path, this.state.data)
        if (!node) return
        node.value = valObj.value
        const data = updateTreeNodeByPath(valObj.path, this.state.data, node)
        this.setState({data})
    }

    /**
     * 修改input内容
     * @param e
     * @param isVal
     */
    changeInputValue = (e: any, isVal: boolean = true) => {
        const path = e.currentTarget.getAttribute('data-path')
        const value = e.currentTarget.value
        const node = getTreeNodeByPath(path, this.state.data)
        if (!node) return
        isVal ? node.value = value : node.name = value
        const data = updateTreeNodeByPath(path, this.state.data, node)
        this.setState({data})
    }

    /**
     * 选中树节点
     * @param selectedKeys
     * @param e {selected: bool, selectedNodes, node, event}
     */
    onSelect = (selectedKeys: any, e: any) => {
        console.log('onSelect: ', selectedKeys)
    }

    /**
     * 展开节点
     * @param expandedKeys
     * @param e {expanded: bool, node: TNode}
     */
    onExpand = (expandedKeys: any, e: any) => {
        const currentKey = e.node.key
        let currentExpandedKeys = []
        for (const key of expandedKeys) {
            if (key.indexOf(currentKey) !== -1 && key !== currentKey) continue
            currentExpandedKeys.push(key)
        }
        this.setState({expandedKeys: currentExpandedKeys})
    }

    /**
     * 根据树数据获取全部节点key
     * @param nodes
     */
    getExpandedKeys = (nodes: TNode[]) => {
        let expandedKeys: string[] = []
        for (const node of nodes) expandedKeys.push(node.key, ...this.getExpandedKeys(node.children))
        return expandedKeys
    }

    /**
     * 折叠所有节点
     */
    foldAll = () => this.setState({expandedKeys: []})

    /**
     * 展开所有节点
     */
    unfoldAll = () => this.setState({expandedKeys: this.getExpandedKeys(this.state.data)})

    render() {
        return (
            <div className={this.props.className}>
                <KindList
                    ref={this.state.kindRef}
                    generateResource={this.generateResource}
                />
                <Tree
                    className="treeStyle"
                    onSelect={this.onSelect}
                    onExpand={this.onExpand}
                    showLine={true}
                    treeData={this.state.data}
                    expandedKeys={this.state.expandedKeys}
                />
            </div>
        )
    }
}

export default CTree
