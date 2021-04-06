import {metadata} from "./common";
import {SourceType} from "../base/base";

const configMap = [metadata, {
    name: "data",
    title: "配置数据",
    desc: "机密k/v键值对数据。每个键必须由字母数字字符“-”，“ _”或“。”组成",
    type: SourceType.Object,
    must: true
}]

export default configMap
