import * as React from "react";

export const ArrayNode = '-'

export enum SourceType {
    String = 'string',      // 字符串
    Number = 'number',      // 数值
    Boolean = 'boolean',    // 布尔
    Object = 'object',      // 对象
    Array = 'array',        // 数组
}

export interface KV {
    key: string
    value: string
}

export interface ND {
    name: string
    desc: string
}

export interface WithNV {
    name: string
    value: string
}

/*
    默认类型为string，当items存在时默认为Object
    指定类型为array时，当items存在时为arrayObject
 */
export interface Source {
    name: string            // 名称
    title: string           // 标题
    desc: string            // 描述
    value?: string          // 默认值
    with?: WithNV           // 关联项，默认顶级查找spec.type
    selects?: ND[]          // 选择项，第一个为默认
    checked?: ND[]          // 判断项，第一个为默认
    must?: boolean          // 是否必须存在，默认false
    type?: SourceType       // 值类型，默认string
    arrayType?: SourceType  // 数组子项类型
    items?: Source[]        // 子项
}

export interface SourceNode {
    name: string            // 名称
    title: string           // 标题
    desc: string            // 描述
    value: string           // 默认值
    must: boolean           // 是否必须存在，默认false
    type: SourceType        // 值类型，默认string
    selects: ND[]           // 选择项，第一个为默认
    checked: ND[]           // 判断项，第一个为默认
    items: SourceNode[]     // 子项
    with?: WithNV           // 关联项，默认顶级查找spec.type
}

export interface TNode {
    key: string,            // 全局唯一，格式为 index.path 如 pod.spec.containers.0.name
    name: string,
    title: React.ReactNode,
    type: SourceType,
    value: string,
    children: TNode[],
}
