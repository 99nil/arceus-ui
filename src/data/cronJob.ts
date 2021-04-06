import {metadata, selector} from "./common";

const JobSpec = {
    "name": "spec",
    "desc": "详细定义",
    "items": [{
        "name": "activeDeadlineSeconds",
        "desc": "指定相对于startTime的持续时间（以秒为单位）",
        "type": "number"
    }, {
        "name": "backoffLimit",
        "desc": "指定标记此Job失败之前的重试次数。默认为6",
        "type": "number",
        "value": "6"
    }, {
        "name": "completions",
        "desc": "指定成功完成的Pod数量，标志Job成功",
        "type": "number"
    }, {
        "name": "manualSelector",
        "desc": "控制容器标签和容器选择器的生成。除非您确定自己在做什么，否则请不要设置。设置为false或未设置时，系统会选择此作业唯一的标签，并将这些标签附加到窗格模板。如果为true，则用户负责选择唯一标签并指定选择器。未能选择唯一标签可能会导致此作业和其他作业无法正常运行",
        "type": "boolean"
    }, {
        "name": "parallelism",
        "desc": "指定Job在任何给定时间应运行的Pod的最大期望数目",
        "type": "number"
    }, selector]
}

const CronJobSpec = [{
    "name": "jobTemplate",
    "desc": "Job模板",
    "items": [metadata, ]
}, {
    "name": "schedule",
    "desc": "时间格式，如 '*/1 * * * *'"
}, {
    "name": "concurrencyPolicy",
    "desc": "指定如何处理并发执行",
    "value": "Allow",
    "tips": [{
        "name": "Allow",
        "desc": "允许同时运行"
    }, {
        "name": "Forbid",
        "desc": "禁止并行运行，如果之前的运行尚未完成，则跳过下一个运行"
    }, {
        "name": "Replace",
        "desc": "取消当前正在运行的Job，并将其替换为新Job"
    }]
}, {
    "name": "failedJobsHistoryLimit",
    "desc": "保留的已失败的Job数，默认为1",
    "type": "number",
    "value": "1"
}, {
    "name": "startingDeadlineSeconds",
    "desc": "如果由于某种原因错过了计划的时间，则延长的开始工作截止日期（以秒为单位）。错过的作业执行将被计为失败的Job",
    "type": "number"
}, {
    "name": "successfulJobsHistoryLimit",
    "desc": "要保留的成功Job数。默认为3",
    "type": "number",
    "value": "3"
}, {
    "name": "suspend",
    "desc": "设置为true，后续所有执行被挂起, 默认为false",
    "type": "boolean",
    "value": "false"
}]

const CronJob = [metadata]
export default CronJob
