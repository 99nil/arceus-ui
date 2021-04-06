import {Source} from "../base/base";
import {podSpec} from "./pod";
import {metadata} from "./common";

export const podTemplateSpec: Source = {
    name: 'template',
    title: '应用单元模板',
    desc: 'Pod模板',
    must: true,
    items: [podSpec]
}

const podTemplate: Source[] = [metadata, podTemplateSpec]

export default podTemplate
