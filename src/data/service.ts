import {Source, SourceType} from "../base/base";
import {metadata} from "./common";

const servicePort: Source = {
    name: 'ports',
    title: '端口列表',
    desc: 'Service需要暴露的端口列表',
    type: SourceType.Array,
    items: [{
        name: 'name',
        title: '端口名称',
        desc: '端口名称'
    }, {
        name: 'protocol',
        title: '端口协议',
        desc: '端口协议，支持TCP和UDP，默认为TCP',
        selects: [
            { name: 'TCP', desc: 'TCP' },
            { name: 'UDP', desc: 'UDP' }
        ]
    }, {
        name: 'port',
        title: '监听端口',
        desc: '服务监听的端口号',
        type: SourceType.Number
    }, {
        name: 'targetPort',
        title: '应用单元端口',
        desc: '需要转发到后端Pod的端口号',
        type: SourceType.Number
    }, {
        name: 'nodePort',
        title: '服务器端口',
        desc: '当spec.type=NodePort时，指定映射到物理机的端口号',
        type: SourceType.Number,
        with: { name: 'spec.type', value: 'NodePort' },
    }]
}

const serviceSpec: Source = {
    name: 'spec',
    title: '详细定义',
    desc: '详细定义',
    must: true,
    items: [{
        name: 'type',
        title: '类型',
        desc: 'Service的类型，指定Service的访问方式，默认为ClusterIP',
        value: 'ClusterIP',
        selects: [
            { name: 'ClusterIP', desc: '虚拟的服务IP地址，该地址用于kubernetes集群内部的Pod访问，在Node上kube-proxy通过设置的iptables规则进行转发' },
            { name: 'NodePort', desc: '使用宿主主机的端口，使能够访问各Node的外部客户端通过Node的IP地址和端口号就能访问服务' },
            { name: 'LoadBalancer', desc: '使用外接负载均衡器完成到服务的负载分发，需要在spec.status.loadBalancer字段指定外部负载均衡器的IP地址，并同时定义nodePort和clusterIP，用于公有云环境' }
        ]
    }, {
        name: 'selector',
        title: '标签选择器',
        desc: 'Label Selector配置，将选择具有指定Label标签的Pod作为管理范围',
        must: true,
        type: SourceType.Object
    }, {
        name: 'clusterIP',
        title: '虚拟IP地址',
        desc: '服务虚拟IP地址，当type=ClusterIP时，如果不指定，则系统自动分配；当type=LoadBalancer时，需要指定',
        with: { name: 'spec.type', value: 'ClusterIP' },
    }, {
        name: 'sessionAffinity',
        title: '是否支持Session',
        desc: '是否支持Session，默认为空。ClientIP表示将同一客户端（根据客户端的IP地址决定）的访问请求都转发到同一个后端Pod',
        checked: [
            { name: '', desc: '否' },
            { name: 'ClientIP', desc: 'ClientIP' }
        ]
    }, servicePort]
}

const service: Source[] = [metadata, serviceSpec]

export default service
