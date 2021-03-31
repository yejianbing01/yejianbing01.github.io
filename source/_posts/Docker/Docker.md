---
title: Docker学习笔记
date: 2020-12-27 15:33:57
tags:
---

## Docker基本组成
- 仓库(repository):

    用于存放镜像，分为公有仓库和私有仓库。例如DockerHub

- 镜像(images)：

    docker镜像就好比是一个模板，可以通过模板来创建容器服务。通过这个镜像可以创建多个容器

- 容器(container):

    通过镜像创建得到，可以部署应用。容器中包含了linux系统基本文件，和需要的应用

<!-- more -->

![alt](/images/docker架构.png)
## Docker安装
> 基于CentOS7安装, [docker官方文档](https://docs.docker.com/engine/install/centos/)
```sh
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

## Docker基本命令
---
### 帮助命令

```sh
docker version              # 显示docker的版本信息
docker info                 # 显示docker的系统信息，包括镜像和容器的数量
docker 命令 --help          # 帮助命令
```

### 镜像命令

docker images  查看本机上的docker镜像
```sh
docker images [OPTIONS] [REPOSITORY[:TAG]]
Options:
  -a, --all             Show all images 
  -q, --quiet           Only show image IDs
```

docker search 在docker仓库中搜索镜像
```sh
docker search [OPTIONS] TERM
Options:
  -f, --filter filter   Filter output based 
```

docker pull 下载镜像
```sh
docker pull [OPTIONS] NAME[:TAG|@DIGEST]
Options:
  -a, --all-tags                Download all 
  -q, --quiet                   Suppress verbose output
```

docker rmi 删除 镜像
```sh
docker rmi [OPTIONS] IMAGE [IMAGE...]
Options:
  -f, --force      Force removal of the image

Exp:
docker rmi -f $(docker images -aq)  # 删除所有镜像
```

### 容器命令

docker run 启动容器
```sh
docker run [OPTIONS] IMAGE [COMMAND] [ARG...]
Options:
  --name="name"                 容器名称，用来区分容器
  -d, --quiet                   后台方式运行，**启动后如果没有前台应用就会停止容器**
  -it                           使用交互方式运行，进入容器查看内容
  -p                            指定容器端口 1122:8080 主机端口号:容器端口号

Exp:
docker run -it centos /bin/bash
```

docker rename 容器重命名
```sh
docker rename CONTAINER NEW_NAME
```

docker update 更新容器
```sh
docker update [OPTIONS] CONTAINER [CONTAINER...]
Options:
  -m, --memory bytes               Memory limit
      --restart string             Restart policy to apply when a container exits
```

docker ps 列出所有运行的容器
```sh
docker ps [OPTIONS]
Options:
  -a, --all             列出所有运行过的容器
  -n, --last int        列出最近创建的容器
  -q, --quiet           只显示容器id
  -s, --size            Display total file sizes
```

exit 退出容器
```sh
exit                    退出并停止容器
Ctrl + P + Q            容器不停止退出
```

docker rm 删除容器
```sh
docker rm [OPTIONS] CONTAINER [CONTAINER...]
Options:
  -f, --force     强制删除

Exp:
docker rm -f $(docker ps -aq)   删除所有容器
```

启动和停止容器
```sh
docker start 容器id                     启动容器
docker restart 容器id                   重启容器
docker stop 容器id                      停止当前运行的容器
docker kill 容器id                      强制停止当前运行的容器
```

docker logs
```sh
docker logs [OPTIONS] CONTAINER
Options:
  -f, --follow         Follow log output
  -n, --tail string    Number of lines to show from the end of the logs
                       (default "all")
  -t, --timestamps     Show timestamps
```

docker top 查看容器内部的进程信息
```sh
docker top CONTAINER [ps OPTIONS]
```

docker inspect 查看容器元数据
```sh
docker inspect [OPTIONS] NAME|ID [NAME|ID...]
Options:
  -f, --format string   Format the output using the given Go template
  -s, --size            Display total file sizes if the type is container
```

**docker exec** 进入当前正在运行的容器,开启新的终端
```sh
docker exec [OPTIONS] CONTAINER COMMAND [ARG...]
Options:
  -d, --detach               Detached mode: run command 
  -e, --env list             Set environment variables
  -i, --interactive          Keep STDIN open even if not attached
  -t, --tty                  Allocate a pseudo-TTY

Exp:
docker exec -it 9010942b00ff /bin/bash
```

**docker attach** 进入当前正在运行的容器，进入正在执行的终端
```sh
 docker attach [OPTIONS] CONTAINER
```

docker cp 容器文件复制
```sh
docker cp [OPTIONS] CONTAINER:SRC_PATH DEST_PATH|-
docker cp [OPTIONS] SRC_PATH|- CONTAINER:DEST_PATH

```

### 练习： 部署 ES + kibana

```sh
# es十分消耗内存
docker run -d --name elasticsearch --net somenetwork -p 9200:9200 -p 9300:9300 -e "discovery.type=single-node" elasticsearch:tag

# 增加内存限制，修改配置文件 -e 环境配置修改
docker run -d --name elasticsearch  -p 9200:9200 -p 9300:9300 -e "discovery.type=single-node"  -e ES_JAVA_OPTS="-xms64m -Xmx512m" elasticsearch:tag

# docker stats 查看docker机器状态
```

## docker镜像
---

### commit镜像
```sh
docker commit 提交容器成为一个新的版本

# 命令和git原理类似
docker  commit -m="提交的描述信息" -a="作者" 容器id 目标镜像名:[TAG]
```

## 容器数据卷
---
将容器内的文件，挂载到宿主机上，实现容器的持久化和同步操作，容器间也可以数据共享

### 使用数据卷
> 方法一：直接使用命令挂载 -v
```sh
docker run -it -v 主机目录:容器目录

# 容器停止后主机修改了挂载目录的数据，容器内的数据也会同步。
```

### 安装MySQL
```sh
docker pull mysql:5.7

docker run -d -p 3306:3306 -v E:\docker\mysq\confl:/etc/mysql/conf.d -v E:\docker\mysql\data:/var/lib/mysql -e MYSQL_ROOT_PASSWORD=123456 --name mysql01 mysql:5.7

# -v 目录挂载 主机目录:容器目录
# -e 环境配置 mysql root用户密码
```

### 安装mongoDB
```sh
docker pull mongo

docker run --name mongodb -p 27017:27017 -v mongo:/data/db -d mongo --auth

# --auth 开启权限认证
# -v mongo:/data/db 具名挂载

```
### 安装jenkins
```sh
docker run -it --name jenkins -e TZ=Asia/Shanghai \
	-p 8080:8080 -p 50000:50000 \
	-v ~/mnt/jenkins/jenkins_home:/var/jenkins_home \
	jenkins/jenkins
```

### 具名挂载和匿名挂载
- 匿名挂载
    ```sh
    # -v 容器内路径
    docker run -d -P --name nginx01 -v /etc/nginx nginx

    # 查看所有的volume情况
    docker volume

    docker volume COMMAND
    Commands:
    create      Create a volume
    inspect     Display detailed information on one or more volumes
    ls          List volumes
    prune       Remove all unused local volumes
    rm          Remove one or more volumes
    ```

- 具名挂载
    ```sh
     -v 卷名:容器内路径
    ```

- 拓展
    ```sh
    docker run -d -P --name nginx01 -v test-nginx:/etc/nginx:ro nginx

    docker run -d -P --name nginx01 -v test-nginx:/etc/nginx:ro nginx

    ro    readonly  # 只读
    rw    readwrite # 可读可写
    ```

> 方式二：Dockerfile


## DockerFile
---

## Docker 网络
---

## Docker Compose

## Docker Swarm

## CI/CD 