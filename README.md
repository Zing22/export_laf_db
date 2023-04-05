# 从Laf 0.8下载数据库

## 使用前
1. 在Laf 0.8后台，创建云函数`exportRecords`，代码在`exportRecords.ts`文件中
2. 发布云函数
3. 复制调用链接，一般为：`https://xxx.lafyun.com/exportRecords`，其中`xxx`是Laf App ID

## 使用方法1（源码启动）
1. 安装Nodejs 18.x
2. 下载本项目代码包，运行`npm install`，再运行`node main.js`
3. 根据提示输入`exportRecords`函数调用地址
4. 等待下载完成

## 使用方法2（使用exe）
1. Release页面下载exe文件
2. 双击执行
3. 根据提示输入`exportRecords`函数调用地址
4. 等待下载完成

## 其他
1. 下载完成后，会把文件保存在`./out`文件夹下
2. 重复执行，会按照`config.js`中的配置运行，如果需要修改调用地址，请修改该文件
