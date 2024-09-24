#!/bin/sh
# exits if error happens
set -e

#loop checks if postgreSQL is available 
while ! nc -z $POSTGRES_HOST $POSTGRES_PORT
do
 echo 'Waiting for postgres...'
 sleep 0.5
done;

echo "cd into project directory"
cd backend
echo "Apply db migration"
python3 manage.py makemigrations django_api #detects changes in django api and creates migration files that describe these changes
python3 manage.py migrate #applies them

# makes the app accessible safely via the 8000 port with gunicorn using HTTPS
exec gunicorn -b 0.0.0.0:8000 --certfile /app/certs/localhost.crt --keyfile /app//certs/localhost.key backend.wsgi:application
