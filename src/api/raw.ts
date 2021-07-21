import request from "../utils/request";

export async function convert(inf: string, outf: string, data: any): Promise<any> {
    return request('/raw/convert', {
        method: 'POST',
        params: {
            in: inf,
            out: outf,
        },
        data,
    })
}
