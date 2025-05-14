pip install libxml2 pip install libxslt -i https://pypi.tuna.tsinghua.edu.cn/simple

pip install -r requirements.txt -i https://pypi.tuna.tsinghua.edu.cn/simple

pip install lxml==4.9.2 -i https://pypi.tuna.tsinghua.edu.cn/simple

pip install --upgrade pip setuptools wheel -i https://pypi.tuna.tsinghua.edu.cn/simple


```shell
# TEST
ssh suwenuser@139.159.157.172 
# SERVICE
ssh suwenuser@116.205.128.219
# SERVICE MIDDLE
ssh suwenuser@121.37.234.58
# PLATFORM
ssh suwenuser@139.159.239.166
# PLATFORM
ssh suwenuser@124.71.61.247
```


修改 nginx 中对应的前端文件目录
```shell
sudo nginx -t 校验配置
sudo nginx -s reload 加载配置
```