import {Source, SourceType} from "../base/base";

export const metadata: Source = {
    name: 'metadata',
    title: '元数据',
    desc: "元数据",
    must: true,
    items: [{
        name: 'name',
        title: '名称',
        desc: '名称，命名空间内唯一',
        must: true
    }, {
        name: 'namespace',
        title: '命名空间',
        desc: '所属的命名空间,默认为default',
        value: 'default'
    }, {
        name: 'labels',
        title: '标签',
        desc: '自定义标签',
        type: SourceType.Object
    }, {
        name: 'annotations',
        title: '注释',
        desc: '自定义注释',
        type: SourceType.Object
    }]
}

export const selector: Source = {
    name: 'selector',
    title: '标签选择器',
    desc: '标签选择器',
    items: [{
        name: 'matchLabels',
        title: '标签匹配',
        desc: '标签k/v键值对',
        type: SourceType.Object
    }, {
        name: 'matchExpressions',
        title: '匹配规则',
        desc: '匹配规则',
        type: SourceType.Array,
        items: [{
            name: 'key',
            title: '键值',
            desc: '标签键值',
            must: true
        }, {
            name: 'operator',
            title: '运算符',
            desc: '运算符表示键与一组值的关系。有效的运算符为In，NotIn，Exists和DidNotExist',
            must: true,
            selects: [
                { name: 'In', desc: '包含' },
                { name: 'NotIn', desc: '不包含' },
                { name: 'Exists', desc: '存在' },
                { name: 'DoesNotExist', desc: '不存在' }
            ]
        }, {
            name: 'values',
            title: '标签值集合',
            desc: '标签值集合。如果运算符为In或NotIn，则values数组必须为非空。如果运算符为“Exists”或“DoesNotExist”，则values数组必须为空',
            type: SourceType.Array
        }]
    }]
}
