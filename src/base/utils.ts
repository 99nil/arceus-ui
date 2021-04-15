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
    if (pl === 0) return obj
    let newObj: any = Array.isArray(obj) ? [] : {}
    let exist: boolean = pl > 1
    for (const k in obj) {
        if (!obj.hasOwnProperty(k)) continue
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
    if (!exist) newObj[paths[0]] = value
    return newObj
}

/**
 * object根据key排序
 * @param obj
 */
export function sortObj(obj: any): any {
    let newObj: any = {};
    Object.keys(obj).sort().map((key: any) => newObj[key] = obj[key])
    return newObj
}

/**
 * 对象深拷贝
 * @param obj
 */
export  function deepClone(obj: any): any {
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
