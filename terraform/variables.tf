variable "do_token" {
  description = "DigitalOcean API token"
  type        = string
  sensitive   = true
}
variable "cluster_name" {
  type        = string
  description = "Name of the cluster"
}
variable "cluster_region" {
  description = "Region"
  type        = string
}
variable "cluster_version" {
  description = "Cluster version"
  type        = string
}
variable "node_pool_name" {
  description = "The name of the node pool"
  type        = string 
}
variable "node_pool_size" {
  description = "The DO machine tag"
  type        = string 
}
variable "node_pool_count" {
  description = "Number of nodes in the pool"
  type        = string 
}

variable "nginx_ingress_release_name" {
  description = "Name of the Helm release for the NGINX Ingress Controller"
  type        = string
}

variable "nginx_ingress_repo_url" {
  description = "Helm repository URL for the NGINX Ingress Controller"
  type        = string
}

variable "nginx_ingress_chart_name" {
  description = "Helm chart name for the NGINX Ingress Controller"
  type        = string
}

variable "nginx_ingress_namespace" {
  description = "Namespace to install the NGINX Ingress Controller into"
  type        = string
}

variable "prometheus_release_name" {
  description = "Name of the Helm release for Prometheus"
  type        = string
}
variable "prometheus_repo_url" {
  description = "Helm repository URL for Prometheus"
  type        = string
} 
variable "prometheus_chart_name" {
  description = "Helm chart name for Prometheus"
  type        = string
}
variable "prometheus_namespace" {
  description = "Namespace to install Prometheus into"
  type        = string
} 
variable "prometheus_version" {
  description = "Version of the Prometheus Helm chart"
  type        = string
}

