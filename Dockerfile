FROM php:8.1-apache

RUN echo "ServerName localhost" >> /etc/apache2/apache2.conf

RUN docker-php-ext-install mysqli pdo pdo_mysql

COPY . /var/www/html/

EXPOSE 80