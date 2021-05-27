import request from "../utils/request";

export async function create(data: any): Promise<any> {
    return request('/quickstart', {
        method: 'POST',
        data,
    })
}
