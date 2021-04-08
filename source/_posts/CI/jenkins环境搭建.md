---
title: jenkins环境搭建
date: 2020-10-14 16:27:27
tags:
---

![alt](/images/jenkins.png)

<!-- more -->

# **1.普通搭建**
1. 获取安装列表
yum -y list java*
2. 安装JDK环境
yum -y install java
3. 测试JDK是否安装成功
Java -version
4. 下载Jenkins和maven
查看版本 http://pkg.jenkins-ci.org/redhat-stable/
wget http://repos.fedorapeople.org/repos/dchen/apache-maven/epel-apache-maven.repo -O /etc/yum.repos.d/epel-apache-maven.repo
wget http://pkg.jenkins-ci.org/redhat-stable/jenkins-2.7.3-1.1.noarch.rpm
5. 安装maven
yum -y install apache-maven
6. 安装Jenkins
rpm -ivh jenkins-2.7.3-1.1.noarch.rpm
7. 修改启动端口
vim /etc/sysconfig/jenkins
8. 重启服务
service jenkins restart
9. 查看jenkins密码并复制
vim /var/lib/jenkins/secrets/initialAdminPassword

# **2. 基于Docker安装Jenkins环境**

1. 使用docker 安装jenkins

```sh
docker run -it --name jenkins -e TZ=Asia/Shanghai \
	-p 8080:8080 -p 50000:50000 \
	-v ~/mnt/jenkins/jenkins_home:/var/jenkins_home \
	jenkins/jenkins
```

# **3.使用tomcat，jenkins.war包安装jenkins**
1. 下载安装 tomcat
2. 下载 jenkins.war 文件
3. 将 jenkins.war 文件复制到 webapps 文件下
4. 部署war包到Tomcat根目录访问
   ```sh
   # docBase 改成 jenkins.war 文件的绝对路径
   vi tomcat/conf/server.xml;
   <Context path="" docBase="/usr/local/src/apache-tomcat-7.0.106/webapps/pm" debug="0" privileged="true" reloadable="true"/>
   ```
5. Jenkins修改默认目录 /root/.jenkins ( 需要时修改)
   ```sh
   # linux下安装Jenkins（jenkins的war包，tomcat启动）后，默认目录为：/root/.jenkins
   # 1. 打开tomcat的bin目录，编辑catalina.sh文件。 
   # 2. 在 OS specific support. $var must be set to either true or false. 上面添加:
   export JENKINS_HOME="xxxx/xxxx"
   # 3. 修改linux系统环境变量 profile文件
   vim /etc/profile
     # 加入
     export JENKINS_HOME=/xxx/xx/xx
   # 4. 立即生效
   source /etc/profile
   # 5. 重启tomcat
   ```
6. jenkins添加全局凭证-ssh拉取git代码
   ```sh
   cd ~/.ssh
   # 如果没有文件则，需要新生成ssh秘钥
   ssh-keygen -t rsa -C “登录gitlab的邮箱”
   # id_rsa.pub：公钥，复制到gitlab平台配置ssh-key
   # id_rsa：私钥，复制到jenkins平台配置jenkins凭据
   ```
7. jenkins域名地址配置
   ```sh
   # 系统管理/系统配置/Jenkins URL
   ```

# **4. Jenkins插件**

1. 汉化插件：[Localization: Chinese (Simplified)](https://wiki.jenkins-ci.org/display/JENKINS/Localization+zh+cn+Plugin) 
2. 用户权限插件：Role-based
3. 测试报告插件：Allure
   1. 安装完成后需要配置maven下载