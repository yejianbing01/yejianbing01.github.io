---
title: jenkins环境搭建
date: 2020-10-14 16:27:27
tags:
---

# 搭建



# **1.普通搭建**
一、 获取安装列表
yum -y list java*
二、 安装JDK环境
yum -y install java
三、 测试JDK是否安装成功
Java -version
四、 下载Jenkins和maven
查看版本 http://pkg.jenkins-ci.org/redhat-stable/
wget http://repos.fedorapeople.org/repos/dchen/apache-maven/epel-apache-maven.repo -O /etc/yum.repos.d/epel-apache-maven.repo
wget http://pkg.jenkins-ci.org/redhat-stable/jenkins-2.7.3-1.1.noarch.rpm
五、 安装maven
yum -y install apache-maven
六、 安装Jenkins
rpm -ivh jenkins-2.7.3-1.1.noarch.rpm
七、 修改启动端口
vim /etc/sysconfig/jenkins
八、 重启服务
service jenkins restart
九、 查看jenkins密码并复制
vim /var/lib/jenkins/secrets/initialAdminPassword
十、 新建凭据
新建一个凭据，凭据的作用就是让系统于安装的Jenkins形成信任关系，Jenkins才有权限操作本地的项目。
![](https://cdn.nlark.com/yuque/0/2020/jpeg/467788/1586258245369-880bf670-1110-483d-8e5e-a5e08871645c.jpeg#align=left&display=inline&height=550&originHeight=550&originWidth=640&size=0&status=done&style=none&width=640)图 1
![](https://cdn.nlark.com/yuque/0/2020/jpeg/467788/1586258245369-1ed9df19-960c-42d7-91b2-1b0ac7db9819.jpeg#align=left&display=inline&height=286&originHeight=286&originWidth=640&size=0&status=done&style=none&width=640)图 2
十一、 新建任务
填写任务名，选择构建一个自由风格的软件项目，选择OK
![](https://cdn.nlark.com/yuque/0/2020/jpeg/467788/1586258245400-8132ffdc-62cc-49df-9568-51364e5fc123.jpeg#align=left&display=inline&height=457&originHeight=457&originWidth=640&size=0&status=done&style=none&width=640)图 3
十二、 添加Gitlab公钥
填写公钥处可参考第五章，利用其生成的公钥字符串填在此处即可。
![](https://cdn.nlark.com/yuque/0/2020/jpeg/467788/1586258245377-ec2c2f16-53a5-43d7-b1a9-68d7e8bd170b.jpeg#align=left&display=inline&height=329&originHeight=329&originWidth=640&size=0&status=done&style=none&width=640)图4
![](https://cdn.nlark.com/yuque/0/2020/jpeg/467788/1586258245399-da8e95db-b72a-47a2-a46e-597007ecfa90.jpeg#align=left&display=inline&height=261&originHeight=261&originWidth=640&size=0&status=done&style=none&width=640)图 5


# **2.基于Docker安装Jenkins环境**
# 
 
1.使用docker 安装jenkins

| docker run -p 8080:8080 -p 50000:50000 -v jenkins_data:/var/jenkins_home jenkinsci/blueocean |
| --- |

2.访问jenkins地址 8080
![](https://cdn.nlark.com/yuque/0/2020/png/467788/1586258170046-777b7890-ed1c-464a-a9eb-21dae4ac334a.png#align=left&display=inline&height=175&originHeight=175&originWidth=366&size=0&status=done&style=none&width=366)
 
注意：第一次启动的时候正在加载jenkins大概会等待3-10分钟。
3.解锁jenkins
![](https://cdn.nlark.com/yuque/0/2020/png/467788/1586258170036-cb857c21-66d3-48ad-9176-46af553eee7f.png#align=left&display=inline&height=372&originHeight=372&originWidth=583&size=0&status=done&style=none&width=583)
 
![](https://cdn.nlark.com/yuque/0/2020/png/467788/1586258170053-73ee0041-9212-4bcd-a7b6-b0e62eb9b66b.png#align=left&display=inline&height=489&originHeight=489&originWidth=693&size=0&status=done&style=none&width=693)
 
docker exec -it 7f485bd95c3b  /bin/bash 进入jenkins容器
cat /var/jenkins_home/secrets/initialAdminPassword
![](https://cdn.nlark.com/yuque/0/2020/png/467788/1586258170028-d3105681-153d-47c9-914a-5a92f9eed907.png#align=left&display=inline&height=448&originHeight=448&originWidth=693&size=0&status=done&style=none&width=693)
大概需要等待3-10分钟
创建新的用户
![](https://cdn.nlark.com/yuque/0/2020/png/467788/1586258170131-1d1bd675-a954-4414-81dd-9669298fdb9b.png#align=left&display=inline&height=475&originHeight=475&originWidth=693&size=0&status=done&style=none&width=693)
 
![](https://cdn.nlark.com/yuque/0/2020/png/467788/1586258170042-6632243e-01cc-4017-9519-2bd102e48766.png#align=left&display=inline&height=375&originHeight=375&originWidth=693&size=0&status=done&style=none&width=693)
 
 
 
 
## **Jenkins全局工具配置**
进入到jenkins容器中 echo $JAVA_HOME 获取java环境安装地址
 
### **JDK环境安装**
![](https://cdn.nlark.com/yuque/0/2020/png/467788/1586258170058-6d044725-8a4f-4ff0-b5fd-4a32c96f2fe7.png#align=left&display=inline&height=218&originHeight=218&originWidth=693&size=0&status=done&style=none&width=693)
 
 
### **Maven环境安装**
![](https://cdn.nlark.com/yuque/0/2020/png/467788/1586258170037-54eec896-3353-4187-8824-b5a919ef0b21.png#align=left&display=inline&height=289&originHeight=289&originWidth=693&size=0&status=done&style=none&width=693)
 
 
### **安装Jenkins对应Maven插件**
找到 “系统管理“ - “安装插件” ，点击 “可选插件”，找到如下maven插件的版本  
插件名称 [Maven Integration](https://plugins.jenkins.io/maven-plugin)
![](https://cdn.nlark.com/yuque/0/2020/png/467788/1586258170114-a7f2cbe9-1ef3-4db5-9545-0409dd4f570e.png#align=left&display=inline&height=308&originHeight=308&originWidth=693&size=0&status=done&style=none&width=693)
![](https://cdn.nlark.com/yuque/0/2020/png/467788/1586258170059-8100ceb5-3a98-4b8b-a78d-98ad75e8ac66.png#align=left&display=inline&height=488&originHeight=488&originWidth=693&size=0&status=done&style=none&width=693)
 
 
## **Jenkins实现Springboot项目自动部署**

1. 新建一个发布任务

![](https://cdn.nlark.com/yuque/0/2020/png/467788/1586258170102-9bdeff47-e41b-4483-a763-2ce964bb8b58.png#align=left&display=inline&height=318&originHeight=318&originWidth=454&size=0&status=done&style=none&width=454)
 

1. 配置任务git账号密码

![](https://cdn.nlark.com/yuque/0/2020/png/467788/1586258170057-1a89b2cb-16e2-4f00-9478-b6f1c1650b5f.png#align=left&display=inline&height=270&originHeight=270&originWidth=693&size=0&status=done&style=none&width=693)
 
 
   3.项目打包
![](https://cdn.nlark.com/yuque/0/2020/png/467788/1586258170167-8324ff25-ec86-40fa-a0c3-f4bfae684945.png#align=left&display=inline&height=200&originHeight=200&originWidth=693&size=0&status=done&style=none&width=693)
 
 
   clean install

1. 点击立即构建

![](https://cdn.nlark.com/yuque/0/2020/png/467788/1586258170119-c0fbd773-eaf2-4556-a94b-007913000b28.png#align=left&display=inline&height=326&originHeight=326&originWidth=693&size=0&status=done&style=none&width=693)
 
第一次构建可能耗时比较长，因为需要下载一些相关依赖jar包
 
## **Jenkins启动成功之后执行shll脚本
| #!/bin/bash
#服务名称
SERVER_NAME=springboot
# 源jar路径,mvn打包完成之后，target目录下的jar包名称，也可选择成为war包，war包可移动到Tomcat的webapps目录下运行，这里使用jar包，用java -jar 命令执行  
JAR_NAME=springboot-0.0.1-SNAPSHOT
# 源jar路径  
#/usr/local/jenkins_home/workspace--->jenkins 工作目录
#demo 项目目录
#target 打包生成jar包的目录
JAR_PATH=/var/jenkins_home/workspace/springboot/target
# 打包完成之后，把jar包移动到运行jar包的目录--->work_daemon，work_daemon这个目录需要自己提前创建
JAR_WORK_PATH=/var/jenkins_home/workspace/springboot/target
 
echo "查询进程id-->$SERVER_NAME"
PID=`ps -ef | grep "$SERVER_NAME" | awk '{print $2}'`
echo "得到进程ID：$PID"
echo "结束进程"
for id in $PID
do
	kill -9 $id  
	echo "killed $id"  
done
echo "结束进程完成"
 
#复制jar包到执行目录
echo "复制jar包到执行目录:cp $JAR_PATH/$JAR_NAME.jar $JAR_WORK_PATH"
cp $JAR_PATH/$JAR_NAME.jar $JAR_WORK_PATH
echo "复制jar包完成"
cd $JAR_WORK_PATH
#修改文件权限
chmod 755 $JAR_NAME.jar
 
Nohub  java -jar $JAR_NAME.jar |
| --- |

加**nohub 指的是后台运行**，或者使用**nohub &**
# **容器映射8081端口**
1. 重启容器
systemctl restart  docker  
 2. 清空未运行的容器
docker rm $(sudo docker ps -a -q)

| docker run -p 8080:8080   -p 8081:8081   -p 50000:50000 -v jenkins_data:/var/jenkins_home jenkinsci/blueocean |
| --- |

docker安装需要很多依赖，第一次安装报错信息
Error: Package: 3:docker-ce-19.03.8-3.el7.x86_64 (docker-ce-stable)
Requires: systemd
Error: Package: 3:docker-ce-19.03.8-3.el7.x86_64 (docker-ce-stable)
Requires: libsystemd.so.0(LIBSYSTEMD_209)(64bit)
Error: Package: 3:docker-ce-19.03.8-3.el7.x86_64 (docker-ce-stable)
Requires: libseccomp.so.2()(64bit)
Error: Package: 3:docker-ce-19.03.8-3.el7.x86_64 (docker-ce-stable)
Requires: container-selinux >= 2:2.74
Error: Package: 3:docker-ce-19.03.8-3.el7.x86_64 (docker-ce-stable)
Requires: libseccomp >= 2.3
Error: Package: containerd.io-1.2.13-3.1.el7.x86_64 (docker-ce-stable)
Requires: systemd
Error: Package: 3:docker-ce-19.03.8-3.el7.x86_64 (docker-ce-stable)
Requires: libsystemd.so.0()(64bit)
Error: Package: containerd.io-1.2.13-3.1.el7.x86_64 (docker-ce-stable)
Requires: container-selinux >= 2:2.74
You could try using --skip-broken to work around the problem
You could try running: rpm -Va --nofiles --nodigest

