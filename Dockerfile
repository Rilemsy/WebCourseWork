FROM php:8.1-apache

RUN docker-php-ext-install mysqli pdo pdo_mysql && docker-php-ext-enable mysqli

COPY ./src/ /var/www/html/

EXPOSE 80
