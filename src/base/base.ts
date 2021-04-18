import * as React from "react";

export const ArrayNode = '-'

export enum SourceType {
    String = 'string',      // 字符串
    Number = 'number',      // 数值
    Boolean = 'boolean',    // 布尔
    Object = 'object',      // 对象
    Array = 'array',        // 数组
}

export interface ND {
    name: string
    desc: string
}

export interface TNode {
    key: string,            // 全局唯一，格式为 index.path 如 pod.spec.containers.0.name
    name: string,
    title: React.ReactNode,
    type: SourceType,
    value: string,
    children: TNode[],
}
