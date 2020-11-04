---
title: jmeter分布式环境搭建
date: 2020-10-14 19:31:39
tags: jmeter
---

# jmeter分布式环境搭建

<!-- more -->

# 1.环境搭建


- 安装java环境
```
vim /etc/profile

export JAVA_HOME=/usr/lib/jvm/jdk1.8.0_131

export JRE_HOME=${JAVA_HOME}/jre 

export CLASSPATH=.:${JAVA_HOME}/lib:${JRE_HOME}/lib

export  PATH=${JAVA_HOME}/bin:$PATH

source /etc/profile

java –version
```

- [下载安装jmeter](https://jmeter.apache.org/download_jmeter.cgi)
```
1.将下载好的jmeter解压到目录/usr/local或其他目录

vi /etc/profile

export PATH=/usr/local/apache-jmeter-3.2/bin/:$PATH

source /etc/profile

jmeter -v

2.也可不加入环境变量设置软连接

ln -s /usr/local/jmeter/apache-jmeter-5.0/bin/jmeter.sh /usr/local/bin/jmeter

ln -s /usr/local/jmeter/apache-jmeter-5.0/bin/jmeter-server /usr/local/bin/jmeter-server
```

- jmeter命令行选项
```
-t, --testfile {argument}  # 要运行的jmeter脚本

-j, --jmeterlogfile {argument} # 指定记录jmeter log的文件，默认为jmeter.log

-l, --logfile {argument} # 记录采样器Log的文件 指定生成测试结果的保存文件， jtl 文件格式

-n, --nongui  # 以nongui模式运行jmeter

-s, --server # 运行JMeter server 

-L, --loglevel {argument}={value} # 定义日志等级

-r, --runremote (non-GUI only)  #启动远程server（在jmeter property中定义好的remote_hosts），公在non-gui模式下此参数才生效

-R, --remotestart server1,... (non-GUI only) # 启动远程server（如果使用此参数，将会忽略jmeter property中定义的remote_hosts）

-d, --homedir {argument} # Jmeter运行的主目录

-X, --remoteexit # 测试结束时，退出（在non-gui模式下）

-e : 测试结束后，生成测试报告

-o : 指定测试报告的存放位置 指定的文件及文件夹，必须不存在 ，否则执行会失败，对应上面的命令就是resultReport文件夹必须不存在否则报错
```


我们这次使用的是: jmeter -n -t $WORKSPACE/jmeter/ss/pre/dresDetail.jmx -r -l /usr/local/jmeter/ss/dresDetail_result/dresDetail.jtl -e -o /usr/local/jmeter/ss/dresDetail_report
- jmeter 分布式server设置
   - 主控机
      - 在主控机的jmeter的bin目录找到配置文件 jmeter.properties
      - 找到里面的remote_hosts部分，修改内容为：remote_hosts=xx，xx代表的是压力机的ip。如果是多个压力机，之间使用[,]分隔
      - 修改jmeter.properties中的 server.rmi.ssl.disable=true
   - 压力机
      - 压力机控制机在同一局域网内,也就是可以互相访问
      - 压力机也要安装jmeter
      - jmeter的bin目录找到配置文件 jmeter.properties中找修改 server_port=1099
      - jmeter的bin目录找到配置文件 jmeter.properties中找修改 server.rmi.localport=1099
- jenkins-jmeter持续集成
   - 控制机中添加压力机的ssh公钥，使ssh链接不需要密码```
ssh-keygen -t rsa  # 一直回车,在用户家目录下生成 ~/.ssh/id_rsa.pub 公钥

复制压力机 ~/.ssh/id_rsa.pub 中的内容存入控制机authorized_keys文件中
```shell

   <!-- - 多个压测任务执行的时候开始前先重启jmeter-server``` -->
#!/bin/bash
ps -A -o pid,cmd | grep jmeter | grep -v 'grep' | awk '{print $1}' | xargs kill -9
cd /usr/local/jmeter/apache-jmeter-5.0/bin
nohup ./jmeter-server > xx.log 2>&1 &
echo "192.168.0.23 setup jmeter finished!"

ssh root@192.168.0.152 -p 9231 > /dev/null 2>&1 << eeooff
ps -A -o pid,cmd | grep jmeter | grep -v 'grep' | awk '{print $1}' | xargs kill -9
cd /root/apache-jmeter-5.0/bin
nohup ./jmeter-server > xx.log 2>&1 &
exit
eeooff
echo "192.168.0.152 setup jmeter finished!"
```

- jmeter脚本
   - BeanShell取样器设置分阶段保存聚合报告
```java
    import org.apache.jmeter.threads.JMeterContextService;

    int num = JMeterContextService.getNumberOfThreads();

    System.out.println("当前线程数"+num);

    if(num<=10){
    System.out.println("线程区间1-10");
    vars.put("thread","线程数1-10");
    }
    else if(num>=11&&num<=20){
    System.out.println("线程区间11-20");
    vars.put("thread","线程数11-20");
    }
```

   - JSR223预处理器修改随机hashKey
```java
var jsonParam = JSON.parse(vars.get("jsonParam"));
jsonParam.orders[0].main.hashKey = '${__time(,)}${__Random(10000,99999,)}';
vars.put("jsonParam",JSON.stringify(jsonParam));
```


！！！取消勾选【如果可用，缓存编译脚本】![image.png](https://cdn.nlark.com/yuque/0/2020/png/467798/1585726547607-7f977cbd-d937-4a86-9782-3a62f07bd6bb.png#align=left&display=inline&height=448&name=image.png&originHeight=896&originWidth=1600&size=439175&status=done&style=none&width=800)
   - BeanShell断言
```java
    String response = "";
    String Str = "{\"code\":0";
    String Str2 = "\"isSuccess\":1";

    response = prev.getResponseDataAsString();
    if(response == ""){
        Failure = true;
        FailureMessage = "系统无响应，获取不到响应数据！";
        log.info(FailureMessage);
        }
    else if(response.contains(Str) == false && response.contains(Str2) == false){
        Failure = true;
        String Msg = "\n 期望与实际不符！";
        FailureMessage = Msg + "\n" + "期望结果:\n" + Str + Str2 + "响应内容: \n" + response + "\n";
        log.info(FailureMessage);
        }
```


