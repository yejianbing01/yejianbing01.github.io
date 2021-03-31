# linux环境安装

linux学习笔记
<!-- more -->
## 网络配置
1. 虚拟机网络设置-桥接
2. dhclient-自动分配网络地址
	```sh
	dhclient
	```
3. 网络配置 vim /etc/sysconfig/network-scripts/ifcfg-xxx
	```
	BOOTPROTO=static 
	ONBOOT=yes
	IPADDR=192.168.X.XX     IP地址
	NETMASK=255.255.255.0   子网掩码
	GATEWAY=192.168.X.1     网关
	DNS1=119.29.29.29       公网DNS地址
	```
4. 重启网卡 
	```sh
	systemctl restart network.service
	```
5. 检查配置结果
6. 开启端口
	```sh
	/sbin/iptables -I INPUT -p tcp --dport 80 -j ACCEPT
	```

## 设置时间同步
```
ntpdate 0.centos.pool.ntp.org
```