FROM php:8.1-apache

RUN docker-php-ext-install mysqli pdo pdo_mysql

RUN echo "display_errors = On\nerror_reporting = E_ALL" > /usr/local/etc/php/conf.d/errors.ini

COPY . /var/www/html/

EXPOSE 80
