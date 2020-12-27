---
title: Docker学习笔记
date: 2020-12-27 15:33:57
tags:
---


<!-- more -->

## Docker基本组成

---

![alt](/images/docker架构.png)

- 仓库(repository):

    用于存放镜像，分为公有仓库和私有仓库。例如DockerHub

- 镜像(images)：

    docker镜像就好比是一个模板，可以通过模板来创建容器服务。通过这个镜像可以创建多个容器

- 容器(container):

    通过镜像创建得到，可以部署应用。容器中包含了linux系统基本文件，和需要的应用


## Docker安装
---

> 基于CentOS7安装, [docker官方文档](https://docs.docker.com/engine/install/centos/)

```shell
# 1. 卸载旧的版本
    yum remove docker \
                docker-client \
                docker-client-latest \
                docker-common \
                docker-latest \
                docker-latest-logrotate \
                docker-logrotate \
                docker-engine

# 2. 需要的安装包
    yum install -y yum-utils

# 3. 设置镜像仓库
    yum-config-manager \
        --add-repo \
        https://mirrors.aliyun.com/docker-ce/linux/centos/docker-ce.repo

# 4. 更新yum软件包索引
    yum makecache fast

# 5. 安装docker(docker-ce社区版)
    yum install docker-ce docker-ce-cli containerd.io -y

# 6. 检查安装结果
    docker version

# 7. 启动docker
    systemctl start docker

# 8. docker更换国内镜像源
    vi /etc/docker/daemon.json
    {
        "registry-mirrors": ["https://2l5j7ihl.mirror.aliyuncs.com"]
    }
    
    systemctl daemon-reload
    systemctl restart docker

# 8. 运行hello-world测试
    docker run hello-world

# 9. 卸载docker 
    yum remove docker-ce docker-ce-cli containerd.io

    rm -rf /var/lib/docker
```

## 