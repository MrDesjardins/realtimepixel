{{/*
Expand the name of the chart.
*/}}
{{- define "realtimepixel.name" -}}
{{- default .Chart.Name .Values.nameOverride | trunc 63 | trimSuffix "-" }}
{{- end }}

{{/*
Create a default fully qualified app name.
We truncate at 63 chars because some Kubernetes name fields are limited to this (by the DNS naming spec).
If release name contains chart name it will be used as a full name.
*/}}
{{- define "realtimepixel.fullname" -}}
{{- if .Values.fullnameOverride }}
{{- .Values.fullnameOverride | trunc 63 | trimSuffix "-" }}
{{- else }}
{{- $name := default .Chart.Name .Values.nameOverride }}
{{- if contains $name .Release.Name }}
{{- .Release.Name | trunc 63 | trimSuffix "-" }}
{{- else }}
{{- printf "%s-%s" .Release.Name $name | trunc 63 | trimSuffix "-" }}
{{- end }}
{{- end }}
{{- end }}

{{/*
Create chart name and version as used by the chart label.
*/}}
{{- define "realtimepixel.chart" -}}
{{- printf "%s-%s" .Chart.Name .Chart.Version | replace "+" "_" | trunc 63 | trimSuffix "-" }}
{{- end }}

{{/*
Common labels
*/}}
{{- define "realtimepixel.labels" -}}
helm.sh/chart: {{ include "realtimepixel.chart" . }}
{{ include "realtimepixel.backend.selectorLabels" . }}
{{- if .Chart.AppVersion }}
app.kubernetes.io/version: {{ .Chart.AppVersion | quote }}
{{- end }}
app.kubernetes.io/managed-by: {{ .Release.Service }}
{{- end }}

{{/*
Selector labels
*/}}
{{- define "realtimepixel.redis.selectorLabels" -}}
app: {{ .Values.redisContainerName | quote  }}
{{- end }}

{{/*
Selector labels
*/}}
{{- define "realtimepixel.backend.selectorLabels" -}}
app: {{ .Values.backendContainerName | quote  }}
{{- end }}

{{/*
Selector labels
*/}}
{{- define "realtimepixel.frontend.selectorLabels" -}}
app: {{ .Values.frontendContainerName | quote  }}
{{- end }}


{{/*
Create the name of the service account to use
*/}}
{{- define "realtimepixel.serviceAccountName" -}}
{{- if .Values.serviceAccount.create }}
{{- default (include "realtimepixel.fullname" .) .Values.serviceAccount.name }}
{{- else }}
{{- default "default" .Values.serviceAccount.name }}
{{- end }}
{{- end }}
