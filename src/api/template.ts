import request from "../utils/request";
import {InfoParamsType} from "./resource";

export async function list(): Promise<any> {
    return request('/template')
}

export async function info(params: InfoParamsType): Promise<any> {
    return request('/template/info', {params})
}
