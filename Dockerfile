FROM node:16.14.2

ENV JQ_VERSION=1.6
#RUN wget --no-check-certificate https://github.com/stedolan/jq/releases/download/jq-${JQ_VERSION}/jq-linux64 -O /tmp/jq-linux64
#RUN cp /tmp/jq-linux64 /usr/bin/jq
#RUN chmod +x /usr/bin/jq
RUN apt-get update && apt-get install -y jq

WORKDIR /app
COPY . .
RUN jq 'to_entries | map_values({ (.key) : ("$" + .key) }) | reduce .[] as $item ({}; . + $item)' ./src/config.json > ./src/config.tmp.json 
RUN mv ./src/config.tmp.json ./src/config.json
RUN npm install -g pnpm
RUN pnpm install && pnpm build

FROM nginx:1.17
ENV JSFOLDER=/opt/app/assets/*.js
ENV HTMLFOLDER=/opt/app/*.html
ENV TZ=Europe/Paris
COPY ./nginx.conf /etc/nginx/nginx.conf
RUN mkdir -p /opt/app && chown -R nginx:nginx /opt/app && chmod -R 755 /opt/app
RUN chown -R nginx:nginx /var/cache/nginx && \
   chown -R nginx:nginx /var/log/nginx && \
   chown -R nginx:nginx /etc/nginx/conf.d
RUN touch /var/run/nginx.pid && \
   chown -R nginx:nginx /var/run/nginx.pid  
RUN chgrp -R root /var/cache/nginx /var/run /var/log/nginx /var/run/nginx.pid && \
   chmod -R 755 /var/cache/nginx /var/run /var/log/nginx /var/run/nginx.pid
COPY ./start-nginx.sh /usr/bin/start-nginx.sh
RUN chmod +x /usr/bin/start-nginx.sh

USER nginx
WORKDIR /opt/app
COPY --from=0 --chown=nginx /app/dist .
ENTRYPOINT [ "start-nginx.sh" ]