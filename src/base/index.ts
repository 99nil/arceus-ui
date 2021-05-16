import {ArrayNode, SourceType, TNode} from "./base";
import jsyaml from "js-yaml";
import {message} from "antd";

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
    for (const k in nodes) {
        const item = nodes[k]
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
 * 根据yaml数组内容及当前输入行 构建关键字key路径（yaml数组根据\n切割）
 * @param yamlSet
 * @param line
 * @return string
 */
export function getPathByYamlData(yamlSet: string[], line: number): string {
    let path: string = ''
    const lineData = yamlSet[line]
    const filterLineData = lineData.trimLeft()
    const lineSpaceLen = lineData.length - filterLineData.length
    if (lineSpaceLen < 2) {
        // 顶级字段
        return ''
    }
    // 判断当前行是否数组
    let isArray: boolean = false
    if (filterLineData.startsWith('- ')) isArray = true
    // 删除编辑行
    yamlSet.splice(line)
    // 获取父级字段空格数
    const parentSpaceLen = lineSpaceLen - 2
    for (let i = line; i > 0; i--) {
        let currentText = yamlSet[i - 1]
        const currentSpaceLen = currentText.length - currentText.trimLeft().length
        currentText = currentText.trimLeft()
        // 匹配父级字段名
        const arrayCheck: boolean = isArray && currentSpaceLen === lineSpaceLen && !currentText.startsWith('- ')
        if (arrayCheck || currentSpaceLen === parentSpaceLen) {
            let filterPath = currentText.substring(0, currentText.indexOf(':'))
            // 替换数组字符
            if (filterPath.startsWith('- ')) filterPath = ArrayNode
            path += '.' + filterPath
            const topPath = getPathByYamlData(yamlSet, i - 1)
            if (topPath !== '') path = topPath + path
            break
        }
    }
    return path
}

/**
 * 根据yaml数组内容获取group、version、kind
 * yaml数组根据\n切割
 * @param yamlSet
 * @return string[]
 */
export function getGVK(yamlSet: string[]): string[] {
    const gvk = []
    for (const v of yamlSet) {
        if (v.startsWith('apiVersion: ')) {
            const apiVersion = v.substring(12).trimRight()
            const versionData = apiVersion.split('/')
            if (versionData.length === 1) versionData.unshift('core')
            gvk[0] = versionData[0]
            gvk[1] = versionData[1]
        }
        if (v.startsWith('kind: ')) {
            gvk[2] = v.substring(6).trimRight()
        }
    }
    return gvk
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
 */
export function yamlToObj(str: string): any {
    const obj = jsyaml.safeLoad(str)
    return obj || {}
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

export function downloadData(data: any) {
    if (!data) {
        message.error('无内容可下载')
        return
    }
    const element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(data));
    const filename = randomString(6) + '.yml'
    element.setAttribute('download', filename);
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
}

export function copyData(data: any) {
    let text = document.createElement("textarea");    // 直接构建textarea
    text.value = data                                           // 设置内容
    document.body.appendChild(text);                           // 添加临时实例
    text.select();                                             // 选择实例内容
    document.execCommand("Copy");                  // 执行复制
    document.body.removeChild(text);                           // 删除临时实例
}
