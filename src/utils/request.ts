/**
 * request 网络请求工具
 * 更详细的 api 文档: https://github.com/umijs/umi-request
 */
import {extend} from 'umi-request';
import {notification} from 'antd';

const codeMessage: { [code: number]: string } = {
    200: '服务器成功返回请求的数据。',
    201: '新建或修改数据成功。',
    202: '一个请求已经进入后台排队（异步任务）。',
    204: '删除数据成功。',
    400: '发出的请求有错误，服务器没有进行新建或修改数据的操作。',
    401: '用户没有权限（令牌、用户名、密码错误）。',
    403: '用户得到授权，但是访问是被禁止的。',
    404: '发出的请求针对的是不存在的记录，服务器没有进行操作。',
    406: '请求的格式不可得。',
    410: '请求的资源被永久删除，且不会再得到的。',
    422: '当创建一个对象时，发生一个验证错误。',
    500: '服务器发生错误，请检查服务器。',
    502: '网关错误。',
    503: '服务不可用，服务器暂时过载或维护。',
    504: '网关超时。',
};

/**
 * 异常处理程序
 */
const errorHandler = (error: { response: Response, data: any }): Response => {
    const {response, data} = error;
    if (response && response.status) {
        const errorText = data && (typeof data === 'object' ? Object.keys(data).length > 0 : true) ? data : (codeMessage[response.status] || response.statusText);
        // const {status, url} = response;
        console.log(errorText)
        notification.error({
            message: `操作失败`,
            description: errorText,
        });
    } else if (!response) {
        notification.error({
            message: '网络异常',
            description: '您的网络发生异常，无法连接服务器',
        });
    }
    return response;
};

/**
 * 配置request请求时的默认参数
 */
const requestWithExtend = extend({
    errorHandler, // 默认错误处理
    // credentials: 'include', // 默认请求是否带上cookie
    headers: {
        'Content-Type': 'application/json;charset=utf-8',
    },
});

export const host = window.location.protocol + '//' + window.location.host
// export const host = 'http://localhost:2638'

/**
 * 封装一次request，使response可以统一校验后使用
 */
const request = async (url: string, option: any = {}) => {
    let result = await requestWithExtend(host + url, {
        getResponse: true,
        ...option,
        prefix: ''
    })
    return result ? result.data : null
}

export default request;
