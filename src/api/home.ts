import request from "../utils/request";

export async function version(): Promise<any> {
    return request('/version', {})
}
