import {ArrayNode, Source, SourceNode, SourceType, TNode} from "./base";
import jsyaml from "js-yaml";

/**
 * 节点数据转object
 * @param nodes
 * @return any
 */
export function parseNodesToObj(nodes: SourceNode[]): any {
    let obj: any = {}
    for (const v of nodes) {
        switch (v.type) {
            case SourceType.Object:
                obj[v.name] = parseNodesToObj(v.items)
                break
            case SourceType.Array:
                obj[v.name] = []
                break
            default:
                obj[v.name] = v.value
                break
        }
    }
    return obj
}

/**
 * 根据初始结构集补全初始结构集缺失数据
 * @param sources
 * @return BaseStruct[]
 */
export function sourceToNodeSet(sources: Source[]): SourceNode[] {
    let full: SourceNode[] = []
    for (const v of sources) {
        v.items = v.items || []
        if (v.items.length > 0 && !v.type) {
            v.type = SourceType.Object
        }
        full.push({
            name: v.name,
            title: v.title,
            desc: v.desc,
            value: v.value || '',
            must: v.must || false,
            type: v.type || SourceType.String,
            selects: v.selects || [],
            checked: v.checked || [],
            items: sourceToNodeSet(v.items),
        })
    }
    return full
}

/**
 * 根据初始结构补全初始结构缺失数据
 * @param source
 * @return SourceNode
 */
export function sourceToNode(source: Source): SourceNode {
    return {
        name: source.name,
        title: source.title,
        desc: source.desc,
        value: source.value || '',
        must: source.must || false,
        type: source.type || SourceType.String,
        selects: source.selects || [],
        checked: source.checked || [],
        items: sourceToNodeSet(source.items || []),
    }
}

/**
 * 根据节点路径获取节点信息
 * @param path
 * @param nodes
 * @return SourceNode | null
 */
export function getNodeByPath(path: string, nodes: SourceNode[]): SourceNode | null {
    const paths = path.split('.')
    let node: SourceNode | null = null
    for (const v of paths) {
        // 过滤数组key，非数字会返回NaN
        if (parseFloat(v) >= 0) continue
        node = null
        for (const item of nodes) {
            if (item.name === v) {
                node = item
                break
            }
        }
        if (!node) break
        nodes = node.items
    }
    return node
}

/**
 * 根据path获取Object
 * @param obj
 * @param paths
 * @return any
 */
export function getObjByPath(obj: any, paths: string[]): any {
    for (const v of paths) {
        if (!obj.hasOwnProperty(v)) {
            return null
        }
        obj = obj[v]
    }
    return obj
}

/**
 * 根据path更新Object
 * @param obj
 * @param paths
 * @param value
 * @return any
 */
export function updateObjByPath(obj: any, paths: string[], value: any): any {
    const pl = paths.length
    if (pl === 0) {
        return obj
    }
    let newObj: any = Array.isArray(obj) ? [] : {}
    let exist: boolean = pl > 1
    for (const k in obj) {
        if (!obj.hasOwnProperty(k)) {
            continue
        }
        const v = obj[k]
        if (paths[0] === k) {
            if (pl === 1) {
                exist = true
                newObj[k] = value
                continue
            }
            if (typeof v === 'object') {
                newObj[k] = updateObjByPath(v, paths.slice(1), value)
                continue
            }
        }
        newObj[k] = v
    }
    if (!exist) {
        newObj[paths[0]] = value
    }
    return newObj
}

/**
 * 首字母小写
 * @param str
 * @return string
 */
export function strToLowerCase(str: string): string {
    return str.replace(str[0], str[0].toLowerCase())
}

/**
 * 生成随机字符串
 * @param length
 * @return string
 */
export function randomString(length: number): string {
    const chars: string = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'
    let result = ''
    for (let i = length; i > 0; --i) result += chars[Math.floor(Math.random() * chars.length)]
    return result
}

/**
 * object根据key排序
 * @param obj
 */
function sortObj(obj: any): any {
    let newObj: any = {};
    Object.keys(obj).sort().map((key: any) => newObj[key] = obj[key])
    return newObj
}

/**
 * 根据初始结构集补全树结构集缺失数据
 * @param sources
 * @return SourceNode[]
 */
export function nodeSetToTreeNodeSet(sources: SourceNode[]): SourceNode[] {
    let full: SourceNode[] = []
    for (const v of sources) {
        const node = {...v}
        if (node.type === SourceType.Array) {
            const arrSource: Source = {
                name: ArrayNode,
                desc: '数组节点',
                title: ArrayNode,
                must: true,
            }
            if (node.items.length > 0) {
                arrSource.type = SourceType.Object
                arrSource.items = nodeSetToTreeNodeSet(node.items)
            }
            node.items = [sourceToNode(arrSource)]
        } else {
            node.items = nodeSetToTreeNodeSet(node.items)
        }
        full.push(node)
    }
    return full
}

export function getNodeByPathWithTree(path: string, nodes: SourceNode[]): SourceNode | null {
    const paths = path.split('.')
    let node: SourceNode | null = null
    for (const v of paths) {
        node = null
        // 过滤数组key，非数字会返回NaN
        const index = parseFloat(v)
        if (index >= 0) {
            node = nodes[0]
        } else {
            for (const item of nodes) {
                if (item.name === v) {
                    node = item
                    break
                }
            }
        }
        if (!node) break
        nodes = node.items
    }
    return node
}

/**
 * 根据key获取树节点信息
 * @param key
 * @param nodes
 * @return TNode | null
 */
export function getTreeNodeByPath(key: string, nodes: any[]): any {
    let node: any
    for (const item of nodes) {
        if (item.key === key) return item
        node = getTreeNodeByPath(key, item.children)
        if (node) return node
    }
    return node
}

/**
 * 根据key更新树节点信息
 * @param key
 * @param nodes
 * @param value
 * @return TNode[]
 */
export function updateTreeNodeByPath(key: string, nodes: TNode[], value: TNode | null): TNode[] {
    let newNodes: TNode[] = []
    for (const node of nodes) {
        let newNode = {...node}
        if (newNode.key === key) {
            if (value) newNodes.push(value)
            continue
        }
        newNode.children = updateTreeNodeByPath(key, newNode.children, value)
        newNodes.push(newNode)
    }
    return newNodes
}

/**
 * obj转yaml
 * @param obj
 * @return string
 */
export function objToYaml(obj: any): string {
    let str = ''
    // 处理首次循环，获取类型拼接kind
    for (const key in obj) {
        if (!obj.hasOwnProperty(key)) continue
        str += `---\n`
        str += jsyaml.safeDump(sortObj(obj[key]))
    }
    str += str !== '' ? '---' : ''
    return str
}

/**
 * yaml转obj
 * @param str
 * @return any
 */
export function yamlToObjMulti(str: string): any {
    let obj: any = {}
    const arr = jsyaml.safeLoadAll(str)
    for (const item of arr) {
        if (!item) continue
        // 处理kind
        if (!item.hasOwnProperty('kind')) continue
        const key = item.kind + '-' + randomString(6)
        delete item.kind
        obj[key] = item
    }
    return obj
}
