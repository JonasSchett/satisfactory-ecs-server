FROM wolveix/satisfactory-server:latest

RUN apt-get update && apt-get install -y awscli
RUN apt-get install -y supervisor
RUN mkdir -p /var/log/supervisor
COPY supervisord.conf /etc/supervisor/conf.d/supervisor.conf
COPY sync.sh /sync.sh
RUN chmod +x /sync.sh
ENTRYPOINT [ "/usr/bin/supervisord" ]