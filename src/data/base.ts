import {ND, Source, SourceNode} from "../base/base";
import {pod} from "./pod";
import deployment from "./deployment";
import service from "./service";
import {sourceToNode, sourceToNodeSet, nodeSetToTreeNodeSet} from "../base";
import configMap from "./configMap";

export const kubernetesDefaultVersion: string = '1.17'

// workload
export const CronJob: string = 'CronJob'
export const DaemonSet: string = 'DaemonSet'
export const Deployment: string = 'Deployment'
export const Job: string = 'Job'
export const Pod: string = 'Pod'
export const ReplicaSet: string = 'ReplicaSet'
export const ReplicationController: string = 'ReplicationController'
export const StatefulSet: string = 'StatefulSet'

// service
export const Endpoints: string = 'Endpoints'
export const Ingress: string = 'Ingress'
export const Service: string = 'Service'

// config and storage
export const ConfigMap: string = 'ConfigMap'
export const CSIDriver: string = 'CSIDriver'
export const CSINode: string = 'CSINode'
export const Secret: string = 'Secret'
export const PersistentVolumeClaim: string = 'PersistentVolumeClaim'
export const StorageClass: string = 'StorageClass'
export const Volume: string = 'Volume'
export const VolumeAttachment: string = 'VolumeAttachment'

// metadata
export const ControllerRevision: string = 'ControllerRevision'
export const CustomResourceDefinition: string = 'CustomResourceDefinition'
export const Event: string = 'Event'
export const LimitRange: string = 'LimitRange'
export const HorizontalPodAutoscaler: string = 'HorizontalPodAutoscaler'
export const MutatingWebhookConfiguration: string = 'MutatingWebhookConfiguration'
export const ValidatingWebhookConfiguration: string = 'ValidatingWebhookConfiguration'
export const PodTemplate: string = 'PodTemplate'
export const PodDisruptionBudget: string = 'PodDisruptionBudget'
export const PriorityClass: string = 'PriorityClass'
export const PodPreset: string = 'PodPreset'
export const PodSecurityPolicy: string = 'PodSecurityPolicy'

// cluster
export const APIService: string = 'APIService'
export const AuditSink: string = 'AuditSink'
export const Binding: string = 'Binding'
export const CertificateSigningRequest: string = 'CertificateSigningRequest'
export const ClusterRole: string = 'ClusterRole'
export const ClusterRoleBinding: string = 'ClusterRoleBinding'
export const ComponentStatus: string = 'ComponentStatus'
export const Lease: string = 'Lease'
export const LocalSubjectAccessReview: string = 'LocalSubjectAccessReview'
export const Namespace: string = 'Namespace'
export const Node: string = 'Node'
export const PersistentVolume: string = 'PersistentVolume'
export const ResourceQuota: string = 'ResourceQuota'
export const Role: string = 'Role'
export const RoleBinding: string = 'RoleBinding'
export const RuntimeClass: string = 'RuntimeClass'
export const SelfSubjectAccessReview: string = 'SelfSubjectAccessReview'
export const SelfSubjectRulesReview: string = 'SelfSubjectRulesReview'
export const ServiceAccount: string = 'ServiceAccount'
export const SubjectAccessReview: string = 'SubjectAccessReview'
export const TokenReview: string = 'TokenReview'
export const NetworkPolicy: string = 'NetworkPolicy'

const sourceResources: { [index: string]: Source[] } = {pod, deployment, service, configMap}
export const resources: { [index: string]: SourceNode[] } = {}
export const treeResources: { [index: string]: SourceNode[] } = {}

for (const index in sourceResources) {
    const resourceSet = sourceToNodeSet(sourceResources[index])
    resources[index] = resourceSet
    treeResources[index] = nodeSetToTreeNodeSet(resourceSet)
}

/**
 * 根据kubernetes版本和资源类型 获取apiVersion
 * @param kubernetesVersion
 * @param kind
 * @return SourceNode
 */
export function getApiVersions(kubernetesVersion: string, kind: string): SourceNode {
    let select: ND[] = getApiVersionsND(kubernetesVersion, kind)
    if (select.length === 0 && kubernetesVersion !== kubernetesDefaultVersion) select = getApiVersionsND(kubernetesDefaultVersion, kind)
    let apiVersionNode = {...apiVersion}
    if (select.length > 0) apiVersionNode.value = select[0].name
    apiVersionNode.selects = select
    return sourceToNode(apiVersionNode)
}

function getApiVersionsND(kubernetesVersion: string, kind: string) {
    const select: ND[] = []
    const resource: { [index: string]: string[] } = versions[kubernetesVersion]
    for (const k in resource) {
        for (const v of resource[k]) {
            if (v === kind) select.push({name: k, desc: k})
        }
    }
    return select
}

const apiVersion: Source = {
    name: 'apiVersion',
    desc: '版本号，例如v1。可以用 kubectl api-versions 查询到',
    title: '版本号',
    must: true
}

export const kubernetesVersions: Source = {
    name: 'kubernetes version',
    title: 'kubernetes版本',
    desc: 'kubernetes集群安装的版本',
    selects: [{
        name: "1.17",
        desc: "1.17"
    }, {
        name: "1.16",
        desc: "1.16"
    }, {
        name: "1.15",
        desc: "1.15"
    }, {
        name: "1.14",
        desc: "1.14"
    }, {
        name: "1.13",
        desc: "1.13"
    }, {
        name: "1.12",
        desc: "1.12"
    }, {
        name: "1.11",
        desc: "1.11"
    }, {
        name: "1.10",
        desc: "1.10"
    }]
}

// TODO 完善
export const kind: Source = {
    name: 'kind',
    title: '资源类型',
    desc: '资源类型，例如Pod',
    must: true,
    selects: [
        {name: Deployment, desc: '部署应用的对象'},
        {name: Service, desc: '服务'},
        {name: Pod, desc: '应用单元'},
        {name: ConfigMap, desc: '配置清单'},
    ]
}

// 版本号 -> apiGroup -> apiVersion -> kind
const versions: { [index: string]: { [index: string]: string[] } } = {
    "1.17": {
        "v1": [Pod, ReplicationController, Endpoints, Service, ConfigMap, Secret, PersistentVolumeClaim, Volume, Event, LimitRange, PodTemplate, Binding, ComponentStatus, Namespace, Node, PersistentVolume, ResourceQuota, ServiceAccount],
        "apps/v1": [DaemonSet, Deployment, ReplicaSet, StatefulSet, ControllerRevision],
        "batch/v1": [Job],
        "batch/v1beta1": [CronJob],
        "networking.k8s.io/v1beta1": [Ingress],
        "networking.k8s.io/v1": [NetworkPolicy],
        "storage.k8s.io/v1beta1": [CSIDriver, CSINode],
        "storage.k8s.io/v1": [StorageClass, VolumeAttachment],
        "apiextensions.k8s.io/v1beta1": [CustomResourceDefinition],
        "autoscaling/v1": [HorizontalPodAutoscaler],
        "admissionregistration.k8s.io/v1beta1": [MutatingWebhookConfiguration, ValidatingWebhookConfiguration],
        "policy/v1beta1": [PodDisruptionBudget, PodSecurityPolicy],
        "scheduling.k8s.io/v1": [PriorityClass],
        "settings.k8s.io/v1alpha1": [PodPreset],
        "apiregistration.k8s.io/v1": [APIService],
        "auditregistration.k8s.io/v1alpha1": [AuditSink],
        "certificates.k8s.io/v1beta1": [CertificateSigningRequest],
        "rbac.authorization.k8s.io/v1": [ClusterRole, ClusterRoleBinding, Role, RoleBinding],
        "coordination.k8s.io/v1": [Lease],
        "authorization.k8s.io/v1": [LocalSubjectAccessReview, SelfSubjectAccessReview, SelfSubjectRulesReview, SubjectAccessReview],
        "node.k8s.io/v1beta1": [RuntimeClass],
        "authentication.k8s.io/v1": [TokenReview],
    },
    "1.16": {
        "v1beta": [Pod, Service]
    },
}
