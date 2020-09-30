---
title: 'Handling Environment Variables with NGINX'
date: '2019-07-06T11:00:00+09:00'
---

# NGINX with docker

- 設定ファイルの中に一部環境変数を適応したい
- 環境変数を読み取るには `Lua` などで拡張することが必要
- Docker上に変更のための構造をできるだけ入れたくなかった => `envsubst` を使って置換する

## Dockerfile

- `alpine` を使っていると `bash` もなかったり `sed` もなかったりでconfを置換する方法がない
- `envsubst` を使って入れ替えてしまうことが推奨されている？

```dockerfile
FROM nginx:1.17.1-alpine
COPY ./nginx.conf /etc/nginx/nginx.conf
COPY ./conf.d/default.conf /etc/nginx/template/nginx.tpl.default.conf
COPY ./bin/docker-endpoint.sh /bin/docker-endpoint.sh
ENTRYPOINT ["bin/docker-endpoint.sh"]
```

```shell
#!/bin/ash
cat /etc/nginx/template/nginx.tpl.default.conf \
  | envsubst '$SERVER_NAME' \
  > /etc/nginx/conf.d/default.conf

echo "###############################"
echo "# SERVER_NAME=${SERVER_NAME}"
echo "###############################"

/usr/sbin/nginx -g 'daemon off;' -c /etc/nginx/nginx.conf
```

- <https://hub.docker.com/_/nginxz>
- <https://www.mpon.me/entry/2018/02/07/200000>
