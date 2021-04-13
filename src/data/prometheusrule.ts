export default {
    "key": "root",
    "name": "root",
    "title": "root",
    "type": "object",
    "value": "",
    "descs": [],
    "required": [
        "apiVersion",
        "kind",
        "spec"
    ],
    "children": [
        {
            "key": "root.spec",
            "name": "spec",
            "title": "spec",
            "type": "object",
            "value": "",
            "descs": [
                {
                    "locale": "",
                    "desc": "Specification of desired alerting rule definitions for Prometheus."
                }
            ],
            "required": [],
            "children": [
                {
                    "key": "root.spec.groups",
                    "name": "groups",
                    "title": "groups",
                    "type": "array",
                    "value": "",
                    "descs": [
                        {
                            "locale": "",
                            "desc": "Content of Prometheus rule file"
                        }
                    ],
                    "required": [],
                    "children": [
                        {
                            "key": "root.spec.groups._array",
                            "name": "_array",
                            "title": "_array",
                            "type": "object",
                            "value": "",
                            "descs": [],
                            "required": [
                                "name",
                                "rules"
                            ],
                            "children": [
                                {
                                    "key": "root.spec.groups._array.interval",
                                    "name": "interval",
                                    "title": "interval",
                                    "type": "string",
                                    "value": "",
                                    "descs": [],
                                    "required": [],
                                    "children": []
                                },
                                {
                                    "key": "root.spec.groups._array.name",
                                    "name": "name",
                                    "title": "name",
                                    "type": "string",
                                    "value": "",
                                    "descs": [],
                                    "required": [],
                                    "children": []
                                },
                                {
                                    "key": "root.spec.groups._array.partial_response_strategy",
                                    "name": "partial_response_strategy",
                                    "title": "partial_response_strategy",
                                    "type": "string",
                                    "value": "",
                                    "descs": [],
                                    "required": [],
                                    "children": []
                                },
                                {
                                    "key": "root.spec.groups._array.rules",
                                    "name": "rules",
                                    "title": "rules",
                                    "type": "array",
                                    "value": "",
                                    "descs": [],
                                    "required": [],
                                    "children": [
                                        {
                                            "key": "root.spec.groups._array.rules._array",
                                            "name": "_array",
                                            "title": "_array",
                                            "type": "object",
                                            "value": "",
                                            "descs": [],
                                            "required": [
                                                "expr"
                                            ],
                                            "children": [
                                                {
                                                    "key": "root.spec.groups._array.rules._array.for",
                                                    "name": "for",
                                                    "title": "for",
                                                    "type": "string",
                                                    "value": "",
                                                    "descs": [],
                                                    "required": [],
                                                    "children": []
                                                },
                                                {
                                                    "key": "root.spec.groups._array.rules._array.labels",
                                                    "name": "labels",
                                                    "title": "labels",
                                                    "type": "object",
                                                    "value": "",
                                                    "descs": [],
                                                    "required": [],
                                                    "children": []
                                                },
                                                {
                                                    "key": "root.spec.groups._array.rules._array.record",
                                                    "name": "record",
                                                    "title": "record",
                                                    "type": "string",
                                                    "value": "",
                                                    "descs": [],
                                                    "required": [],
                                                    "children": []
                                                },
                                                {
                                                    "key": "root.spec.groups._array.rules._array.alert",
                                                    "name": "alert",
                                                    "title": "alert",
                                                    "type": "string",
                                                    "value": "",
                                                    "descs": [],
                                                    "required": [],
                                                    "children": []
                                                },
                                                {
                                                    "key": "root.spec.groups._array.rules._array.annotations",
                                                    "name": "annotations",
                                                    "title": "annotations",
                                                    "type": "object",
                                                    "value": "",
                                                    "descs": [],
                                                    "required": [],
                                                    "children": []
                                                },
                                                {
                                                    "key": "root.spec.groups._array.rules._array.expr",
                                                    "name": "expr",
                                                    "title": "expr",
                                                    "type": "",
                                                    "value": "",
                                                    "descs": [],
                                                    "required": [],
                                                    "children": []
                                                }
                                            ]
                                        }
                                    ]
                                }
                            ]
                        }
                    ]
                }
            ]
        },
        {
            "key": "root.apiVersion",
            "name": "apiVersion",
            "title": "apiVersion",
            "type": "string",
            "value": "monitoring.coreos.com/v1",
            "descs": [
                {
                    "locale": "",
                    "desc": "APIVersion defines the versioned schema of this representation of an object. Servers should convert recognized schemas to the latest internal value, and may reject unrecognized values. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#resources"
                }
            ],
            "required": [],
            "children": []
        },
        {
            "key": "root.kind",
            "name": "kind",
            "title": "kind",
            "type": "string",
            "value": "PrometheusRule",
            "descs": [
                {
                    "locale": "",
                    "desc": "Kind is a string value representing the REST resource this object represents. Servers may infer this from the endpoint the client submits requests to. Cannot be updated. In CamelCase. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#types-kinds"
                }
            ],
            "required": [],
            "children": []
        },
        {
            "key": "root.metadata",
            "name": "metadata",
            "title": "metadata",
            "type": "object",
            "value": "",
            "descs": [],
            "required": [],
            "children": []
        }
    ]
}
