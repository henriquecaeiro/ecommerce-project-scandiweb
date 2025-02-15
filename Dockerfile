FROM php:8.1-apache

# Instale extensões que sua aplicação precisar (exemplo com mysqli e PDO MySQL)
RUN docker-php-ext-install mysqli pdo pdo_mysql

# Copie os arquivos da aplicação para o diretório padrão do Apache
COPY . /var/www/html/

# Exponha a porta que o Apache usará
EXPOSE 80
