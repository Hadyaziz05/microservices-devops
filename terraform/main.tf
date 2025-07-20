terraform {
    cloud { 
      organization = "my-hc-org" 

      workspaces { 
        name = "my-backend-workspace" 
      } 
    } 
  required_providers {
    digitalocean = {
      source  = "digitalocean/digitalocean"
      version = "~> 2.0"
    }
    helm = {
      source  = "hashicorp/helm"
      version = "~> 3.0"
    }
    kubernetes = {
      source  = "hashicorp/kubernetes"
      version = "~> 2.20"
    }
  }
}

provider "digitalocean" {
  token = var.do_token
}

resource "digitalocean_kubernetes_cluster" "my-k8s-cluster" {
  name    = var.cluster_name
  region  = var.cluster_region
  version = var.cluster_version

  node_pool {
    name       = var.node_pool_name
    size       = var.node_pool_size
    node_count = var.node_pool_count
  }
}

# Kubernetes provider using the generated kubeconfig
provider "kubernetes" {
  host                   = digitalocean_kubernetes_cluster.my-k8s-cluster.endpoint
  token                  = digitalocean_kubernetes_cluster.my-k8s-cluster.kube_config[0].token
  cluster_ca_certificate = base64decode(digitalocean_kubernetes_cluster.my-k8s-cluster.kube_config[0].cluster_ca_certificate)
}

provider "helm" {
  kubernetes = {
    host                   = digitalocean_kubernetes_cluster.my-k8s-cluster.endpoint
    token                  = digitalocean_kubernetes_cluster.my-k8s-cluster.kube_config[0].token
    cluster_ca_certificate = base64decode(digitalocean_kubernetes_cluster.my-k8s-cluster.kube_config[0].cluster_ca_certificate)
  }
}

# Prometheus installation
resource "helm_release" "prometheus" {
  name       = var.prometheus_release_name
  namespace  = var.prometheus_namespace
  repository = var.prometheus_repo_url
  chart      = var.prometheus_chart_name
  version    = var.prometheus_version
  create_namespace = true
  #custom values
  # values = [file("${path.module}/prometheus-values.yaml")]
}

output "kubeconfig" {
  value     = digitalocean_kubernetes_cluster.my-k8s-cluster.kube_config[0].raw_config
  sensitive = true
}
