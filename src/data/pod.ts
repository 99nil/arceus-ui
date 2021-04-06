import {Source, SourceType} from "../base/base";
import {metadata} from "./common";

const containerPort: Source = {
    name: 'ports',
    title: '端口列表',
    desc: '需要暴露的端口库号列表',
    type: SourceType.Array,
    items: [{
        name: 'name',
        title: '端口名称',
        desc: '端口的名称',
        must: true,
    }, {
        name: 'containerPort',
        title: '监听端口',
        desc: '容器需要监听的端口号',
        must: true
    }, {
        name: 'hostIP',
        title: '主机IP',
        desc: '容器所在主机的IP'
    }, {
        name: 'hostPort',
        title: '主机监听端口',
        desc: '容器所在主机需要监听的端口号，默认与Container相同'
    }, {
        name: 'protocol',
        title: '端口协议',
        desc: '端口协议，支持TCP和UDP，默认TCP',
        selects: [
            { name: 'TCP', desc: 'TCP' },
            { name: 'UDP', desc: 'UDP' }
        ]
    }]
}

const livenessProbe: Source = {
    name: 'livenessProbe',
    title: '健康检查配置',
    desc: '对Pod内各容器健康检查的设置，当探测无响应几次后将自动重启该容器，检查方法有exec、httpGet和tcpSocket，对一个容器只需设置其中一种方法即可',
    items: [{
        name: 'exec',
        title: 'exec方式',
        desc: '对Pod容器内检查方式设置为exec方式',
        items: [{
            name: 'command',
            title: '命令',
            desc: 'exec方式需要制定的命令或脚本',
            type: SourceType.Array
        }]
    }, {
        name: 'httpGet',
        title: 'httpGet方式',
        desc: '对Pod内个容器健康检查方法设置为HttpGet，需要制定Path、port',
        items: [{
            name: 'path',
            title: '路径',
            desc: '访问地址路径'
        }, {
            name: 'port',
            title: '端口',
            desc: '端口号'
        }, {
            name: 'host',
            title: '域名',
            desc: '地址域名'
        }, {
            name: 'scheme',
            title: '连接方式',
            desc: '连接方式，默认HTTP',
            value: 'HTTP'
        }, {
            name: 'HttpHeaders',
            title: '请求头',
            desc: '请求头参数',
            type: SourceType.Array,
            items: [{
                name: 'name',
                title: '名称',
                desc: '请求头名称'
            }, {
                name: 'value',
                title: '值',
                desc: '请求头名称对应的值'
            }]
        }]
    }, {
        name: 'tcpSocket',
        title: 'tcpSocket方式',
        desc: '对Pod内个容器健康检查方式设置为tcpSocket方式',
        items: [{
            name: 'port',
            title: '端口',
            desc: '端口号'
        }]
    }, {
        name: 'initialDelaySeconds',
        title: '启动后首次探测时间(s)',
        desc: '容器启动完成后首次探测的时间，单位为秒'
    }, {
        name: 'timeoutSeconds',
        title: '超时时间(s)',
        desc: '对容器健康检查探测等待响应的超时时间，单位秒，默认1秒',
        value: '1'
    }, {
        name: 'periodSeconds',
        title: '定时探测时间(s)',
        desc: '对容器监控检查的定期探测时间设置，单位秒，默认10秒一次',
        value: '10'
    }, {
        name: 'successThreshold',
        title: '失败的最小连续成功次数',
        desc: '探测失败的最小连续成功次数将被视为成功。默认值为1。启动和活动时必须​​为1。最小值为1',
        value: '1'
    }, {
        name: 'failureThreshold',
        title: '成功的最小连续失败次数',
        desc: '成功后将被视为探针的最小连续失败数。默认值为3。最小值为1',
        value: '3'
    }]
}

export const volumeMounts: Source = {
    name: 'volumeMounts',
    title: '容器存储卷',
    desc: '挂载到容器内部的存储卷配置',
    type: SourceType.Array,
    items: [{
        name: 'name',
        title: '定义的存储卷名称',
        desc: '引用pod定义的共享存储卷的名称，需用volumes[]部分定义的的卷名'
    }, {
        name: 'mountPath',
        title: '挂载绝对路径',
        desc: '存储卷在容器内挂载的绝对路径，应少于512字符'
    }, {
        name: 'subPath',
        title: '应挂载路径',
        desc: '容器卷内应挂载路径。默认为空（卷根目录）'
    }, {
        name: 'readOnly',
        title: '是否为只读',
        desc: '是否为只读模式',
        checked: [
            { name: 'false', desc: '否' },
            { name: 'true', desc: '是' }
        ]
    }]
}

export const resourceRequirements: Source = {
    name: 'resources',
    title: '资源配置',
    desc: '资源限制和请求的设置',
    items: [{
        name: 'limits',
        title: '资源限制',
        desc: '资源限制的设置',
        items: [{
            name: 'cpu',
            title: 'CPU限制',
            desc: 'CPU的限制，单位为core数，将用于docker run --cpu-shares参数'
        }, {
            name: 'memory',
            title: '内存限制',
            desc: '内存限制，单位可以为Mib/Gib，将用于docker run --memory参数'
        }]
    }, {
        name: 'requests',
        title: '请求限制',
        desc: '资源请求的设置',
        items: [{
            name: 'cpu',
            title: 'CPU请求',
            desc: 'CPU请求，容器启动的初始可用数量，单位为core数'
        }, {
            name: 'memory',
            title: '内存请求',
            desc: '内存请求,容器启动的初始可用数量，单位可以为Mib/Gib'
        }]
    }]
}

const volumes: Source = {
    name: 'volumes',
    title: '存储卷配置',
    desc: '在该pod上定义共享存储卷列表',
    type: SourceType.Array,
    items: [{
        name: 'name',
        title: '名称',
        desc: '共享存储卷名称 （volumes类型有很多种）'
    }, {
        name: 'hostPath',
        title: '宿主机目录',
        desc: '类型为hostPath的存储卷，表示挂载Pod所在宿主机的目录',
        items: [{
            name: 'path',
            title: '宿主机目录路径',
            desc: 'Pod所在宿主机的目录，将被用于同期中mount的目录'
        }]
    }, {
        name: 'secret',
        title: '密钥',
        desc: '类型为secret的存储卷，挂载集群与定义的secre对象到容器内部',
        items: [{
            name: 'secretName',
            title: '密钥名称',
            desc: 'pod所在命名空间内定义的secret名称'
        }]
    }, {
        name: 'configMap',
        title: '配置文件',
        desc: '类型为configMap的存储卷，挂载预定义的configMap对象到容器内部',
        items: [{
            name: 'name',
            title: '配置名称',
            desc: '定义的configMap名称'
        }, {
            name: 'items',
            title: 'items',
            desc: 'items',
            items: [{
                name: 'key',
                title: '文件名称',
                desc: '键名'
            }, {
                name: 'path',
                title: '路径',
                desc: '路径'
            }]
        }]
    }]
}

const container: Source = {
    name: 'containers',
    title: '容器列表',
    desc: 'Pod中容器列表',
    type: SourceType.Array,
    must: true,
    items: [{
        name: 'name',
        title: '容器名称',
        desc: '必选，容器名称,需符合RFC 1035规范',
        must: true
    }, {
        name: 'image',
        title: '镜像名称',
        desc: '必选，容器的镜像名称',
        must: true
    }, {
        name: 'imagePullPolicy',
        title: '镜像下载策略',
        desc: '获取镜像的策略 Alawys表示下载镜像 IfNotPresent表示优先使用本地镜像,否则下载镜像，Nerver表示仅使用本地镜像',
        selects: [
            { name: 'Alawys', desc: '每次重新下载镜像' },
            { name: 'IfNotPresent', desc: '优先使用本地镜像' },
            { name: 'Never', desc: '仅使用本地镜像' }
        ],
        value: 'IfNotPresent'
    }, {
        name: 'command',
        title: '容器启动命令',
        desc: '容器的启动命令列表，如不指定，使用打包时使用的启动命令',
        type: SourceType.Array
    }, {
        name: 'args',
        title: '容器启动参数',
        desc: '容器的启动命令参数列表',
        type: SourceType.Array
    }, {
        name: 'workingDir',
        title: '容器工作目录',
        desc: '容器的工作目录'
    }, volumeMounts, containerPort, {
        name: 'env',
        title: '环境变量',
        desc: '容器运行前需设置的环境变量列表',
        type: SourceType.Array,
        items: [{
            name: 'name',
            title: '名称',
            desc: '环境变量名称'
        }, {
            name: 'value',
            title: '值',
            desc: '环境变量的值'
        }]
    }, resourceRequirements, livenessProbe, {
        name: 'restartPolicy',
        title: '重启策略',
        desc: 'Pod的重启策略，Always表示一旦不管以何种方式终止运行，kubelet都将重启，OnFailure表示只有Pod以非0退出码退出才重启，Nerver表示不再重启该Pod',
        selects: [
            { name: 'Always', desc: '一直重启' },
            { name: 'OnFailure', desc: '失败重启' },
            { name: 'Never', desc: '永不重启'}
        ]
    }, {
        name: 'nodeSelector',
        title: '节点标签选择器',
        desc: '设置NodeSelector表示将该Pod调度到包含这个label的node上，以key：value的格式指定',
        type: SourceType.Object
    }, {
        name: 'imagePullSecrets',
        title: '镜像下载密钥',
        desc: 'Pull镜像时使用的secret名称，以key：secretkey格式指定',
        items: [{
            name: 'name',
            title: '创建的密钥名称',
            desc: 'secret名称'
        }]
    }, {
        name: 'hostNetwork',
        title: '是否使用主机网络',
        desc: '是否使用主机网络模式，默认为false，如果设置为true，表示使用宿主机网络',
        checked: [
            { name: 'false', desc: '否' },
            { name: 'true', desc: '是' }
        ]
    }, volumes]
}

export const podSpec: Source = {
    name: 'spec',
    title: '详细定义',
    desc: '详细定义',
    must: true,
    items: [container]
}

export const pod = [metadata, podSpec]
