Docker 单机部署

```
创建 kafka、zookeeper 公用网络
docker network create kafka-net --driver bridge 
拉起 zookeeper
docker run -d --name zookeeper --network kafka-net -e ALLOW_ANONYMOUS_LOGIN=yes bitnami/zookeeper:latest
拉取 kafka。其中 192.168.31.138 为开发机在局域网中的 IP
docker run -d --name kafka-server --network kafka-net -p 9092:9092 \
  --volume /etc/localtime:/etc/localtime \
  -e ALLOW_PLAINTEXT_LISTENER=yes \
  -e KAFKA_ZOOKEEPER_CONNECT=127.0.0.1:2181 \
  -e KAFKA_AUTO_CREATE_TOPICS_ENABLE=true \
  -e KAFKA_DELETE_TOPIC_ENABLE=true \
  -e KAFKA_ADVERTISED_LISTENERS=PLAINTEXT://127.0.0.1:9092 \
  bitnami/kafka:1.1.1
拉取 kafka 可视化管理工具 kafka-manager
docker run -d -p 9009:9000 --network kafka-net -e ZK_HOSTS="zookeeper:2181" -e APPLICATION_SECRET=letmein --name kafka-manager sheepkiller/kafka-manager

```