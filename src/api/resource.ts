import request, {host} from "../utils/request";

export interface InfoParamsType {
    group: string;
    kind: string;
    version: string;
}

export async function list(type: string = ''): Promise<any> {
    return request('/resource/list', {params: {type}})
}

export async function info(params: InfoParamsType): Promise<any> {
    return request('/resource/info', {params})
}

export async function tree(params: InfoParamsType): Promise<any> {
    let resource: any = {}
    const item = localStorage.getItem('resource')
    if (item) {
        resource = JSON.parse(item)
        if (resource[params.group] &&
            resource[params.group][params.version] &&
            resource[params.group][params.version][params.kind])
            return resource[params.group][params.version][params.kind]
    }
    const result = await request('/resource/tree', {params})
    if (result) {
        if (!resource[params.group]) resource[params.group] = {}
        if (!resource[params.group][params.version]) resource[params.group][params.version] = {}
        resource[params.group][params.version][params.kind] = result
        localStorage.setItem('resource', JSON.stringify(resource))
    }
    return result
}

export const uploadURL = host + '/resource/upload'

export const generateURL = host + '/resource/generate'
