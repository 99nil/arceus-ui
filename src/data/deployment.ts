import {Source, SourceType} from '../base/base';
import {metadata, selector} from "./common";
import {podTemplateSpec} from "./podTemplate";

const deploymentSpec: Source = {
    name: 'spec',
    title: '详细定义',
    desc: '详细定义',
    must: true,
    items: [{
        name: 'minReadySeconds',
        title: '准备就绪时间(s)',
        desc: '新创建的容器应准备就绪的最小秒数,默认值为0(准备就绪认为pod可用)',
        value: '0',
        type: SourceType.Number
    }, {
        name: 'paused',
        title: '是否暂停部署',
        desc: '是否暂停部署',
        checked: [
            { name: 'false', desc: '否' },
            { name: 'true', desc: '是' },
        ],
        type: SourceType.Boolean
    }, {
        name: 'progressDeadlineSeconds',
        title: '部署最长时间(s)',
        desc: '部署进行进度的最长时间（以秒为单位），否则部署失败，默认为600s',
        value: '600',
        type: SourceType.Number
    }, {
        name: 'replicas',
        title: '应用单元数量',
        desc: '所需pod数量，默认为1',
        value: '1',
        type: SourceType.Number
    }, {
        name: 'revisionHistoryLimit',
        title: '保留旧副本数量(回滚)',
        desc: '要保留以允许回滚的旧ReplicaSet的数量，默认为10',
        value: '10',
        type: SourceType.Number
    }, selector, {
        name: 'strategy',
        title: '部署策略',
        desc: '用于用新的Pod替换现有Pod的部署策略',
        items: [{
            name: 'type',
            title: '类型',
            desc: '类型',
            selects: [
                { name: 'RollingUpdate', desc: '滚动更新' },
                { name: 'Recreate', desc: '重新创建' }
            ]
        }, {
            name: 'rollingUpdate',
            title: '滚动更新配置',
            desc: '滚动更新配置参数',
            with: { name: 'spec.strategy.type', value: 'RollingUpdate' },
            items: [{
                name: 'maxSurge',
                title: '最大单元数量',
                desc: '可以在所需的Pod数量之上安排的最大Pod数量，可以是数值（5）也可以是百分比（10%），默认为25％。如果maxUnavailable为0则不能为0',
                value: '25%'
            }, {
                name: 'maxUnavailable',
                title: '异常单元数量',
                desc: '更新期间可能不可用的Pod的最大数量，可以是数值（5）也可以是百分比（10%），默认为25％。如果maxSurge为0则不能为0',
                value: '25%'
            }]
        }]
    }, podTemplateSpec]
}

const deployment: Source[] = [metadata, deploymentSpec]

export default deployment
