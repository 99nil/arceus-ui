import request from "../utils/request";

export interface InfoParamsType {
    group: string;
    kind: string;
    version: string;
}

export async function list(): Promise<any> {
    return request('/resource/list')
}

export async function info(params: InfoParamsType): Promise<any> {
    return request('/resource/info', {params})
}

export async function tree(params: InfoParamsType): Promise<any> {
    return request('/resource/tree', {params})
}
