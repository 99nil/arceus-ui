import {SourceType, TNode} from "./base";
import jsyaml from "js-yaml";

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
 * 根据类型修改值
 * @param val
 * @param type
 */
export function convertValueByType(val: any, type: SourceType): any {
    switch (type) {
        case SourceType.Integer:
            return parseInt(val)
        case SourceType.Number:
            return parseFloat(val)
        default:
            return val
    }
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
 * 对象深拷贝
 * @param obj
 */
export function deepClone(obj: any): any {
    let o: any = {}
    if (typeof obj != "object") return obj
    if (obj === null) return null
    if (obj instanceof Array) {
        o = [];
        for (let i = 0, len = obj.length; i < len; i++) {
            o.push(deepClone(obj[i]))
        }
    } else {
        for (let j in obj) {
            if (!obj.hasOwnProperty(j)) continue
            o[j] = deepClone(obj[j])
        }
    }
    return o;
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
    // maybe object or array
    const arr = jsyaml.safeLoadAll(str)
    for (const item of arr) {
        if (!item) continue
        // 处理kind
        if (!item.hasOwnProperty('kind')) continue
        const key = item.kind + '-' + randomString(6)
        obj[key] = item
    }
    return obj
}
