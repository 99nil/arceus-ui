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
    return request('/resource/tree', {params})
}

export const uploadURL = host + '/resource/upload'

export const generateURL = host + '/resource/generate'
