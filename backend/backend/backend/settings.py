"""
Django settings for backend project.

Generated by 'django-admin startproject' using Django 4.2.9.

For more information on this file, see
https://docs.djangoproject.com/en/4.2/topics/settings/

For the full list of settings and their values, see
https://docs.djangoproject.com/en/4.2/ref/settings/
"""

from pathlib import Path
from datetime import timedelta
import os

# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = Path(__file__).resolve().parent.parent

# Quick-start development settings - unsuitable for production
# See https://docs.djangoproject.com/en/4.2/howto/deployment/checklist/

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = os.environ.get("SECRET_KEY")

# SECURITY WARNING: don't run with debug turned on in production!
# workaround debug only accepts bool
DEBUG = True

# allowed host django can serve
ALLOWED_HOSTS = ['*']

# Application definition

# all the apps that are enabled in this Django instance
INSTALLED_APPS = [
    'django.contrib.auth', # authentication framework and user management
    'django.contrib.contenttypes', # allows track and manage objects in the database
    'django.contrib.sessions', # framewrok for session data management 
    'django.contrib.messages', # framework for cookies and session based messaging
    'django.contrib.staticfiles', # manages serving static files (js, images)
    'django_api.apps.DjangoApiConfig', # custom made, corresponds to the game
    'rest_framework', # REST framework for building APIs
    'rest_framework.authtoken', # token based auth
    'oauth2_provider', # OAuth2
    'django_extensions', # management commands, admin extensions etc..
]

# preprocessing or postprocessing, sits between the request and the view (for exemple allows to request logging, user auth etc..)
MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware', # adds security to the request/response cycle + enforces https
    'django.contrib.sessions.middleware.SessionMiddleware', # manages session data
    'django.middleware.common.CommonMiddleware', # url normalization (appends www. /  etc)
    'django.middleware.csrf.CsrfViewMiddleware', # cross site request forgery protection (anti vol en gros)
    'django.contrib.auth.middleware.AuthenticationMiddleware', # associates user with requests (ensure that only authenticated users can access certain views.)
    'django.contrib.messages.middleware.MessageMiddleware', # enables cookies and session based messaging (stores messages for the user to retrieve later)
    'django.middleware.clickjacking.XFrameOptionsMiddleware', # protection against clickjacking (anti vol en gros)
]

# python module that contains the url for the project
ROOT_URLCONF = 'backend.urls'

# templates engines and their configs (tells django how to load and render the templates)
TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

# path for wsgi 
WSGI_APPLICATION = 'backend.wsgi.application'

# Database
# https://docs.djangoproject.com/en/4.2/ref/settings/#databases

# define multiple database configs 
# using environ.get allows to retrieve the value of an env variable
DATABASES = {
    'default': {
        'ENGINE': os.environ.get('DATABASE_ENGINE'),
        'NAME': os.environ.get('POSTGRES_DB'),
        'USER': os.environ.get('POSTGRES_USER'),
        'PASSWORD': os.environ.get('POSTGRES_PASSWORD'),
        'HOST': os.environ.get('POSTGRES_HOST'),
        'PORT': os.environ.get('POSTGRES_PORT'),
    }
}

# Password validation
# https://docs.djangoproject.com/en/4.2/ref/settings/#auth-password-validators

AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
    },
]

# Internationalization
# https://docs.djangoproject.com/en/4.2/topics/i18n/

LANGUAGE_CODE = 'en-us'

TIME_ZONE = 'Europe/Paris'

#translation system
USE_I18N = True

#timewone aware or not 
USE_TZ = False

# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/4.2/howto/static-files/

STATIC_URL = 'static/'

# Default primary key field type
# https://docs.djangoproject.com/en/4.2/ref/settings/#default-auto-field

# header/value combination to know if a request is secure
SECURE_PROXY_SSL_HEADER = ('HTTP_X_FORWARDED_PROTO', 'https')

# some django bs that i didnt really understood but what I got from it is that its important
DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

# provides infos about the state and health of the app (useful for debugging)
LOGGING = {
    'version': 1,
    'disable_existing_loggers': False,
    'handlers': {
        'console': {
            'class': 'logging.StreamHandler',
        },
    },
    'root': {
        'handlers': ['console'],
        'level': 'INFO',
    },
}

# custom user model to use instead of the default 
AUTH_USER_MODEL = 'auth.User'

# all the different authentication methods that r allowed
REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': (
        'rest_framework.authentication.SessionAuthentication',
        'rest_framework.authentication.BasicAuthentication',
        'rest_framework_simplejwt.authentication.JWTAuthentication',
    ),
}

# json web token config
SIMPLE_JWT = {
    "ACCESS_TOKEN_LIFETIME": timedelta(minutes=120),
    # The lifetime of the access token. After this period, the token will be considered expired.
    "REFRESH_TOKEN_LIFETIME": timedelta(days=1),
    # The lifetime of the refresh token. After this period, the token will be considered expired.
    "ALGORITHM": "HS512",  # Use HS512 algorithm
    "SIGNING_KEY": SECRET_KEY,  # Use your own secret key
}

def generate_local_ip_addresses():
    trusted_ip = [
        'https://localhost',
        'https://localhost:4430',
    ]
    for x in range(1, 5): # x ranges from 1 to 4
        for y in range(1, 14): # y ranges from 1 to 13
            for z in range(1, 9): # z ranges from 1 to 8
                ip_address = f'https://z{x}r{y}p{z}:4430'
                trusted_ip.append(ip_address)
    return trusted_ip

CSRF_TRUSTED_ORIGINS = generate_local_ip_addresses()

AUTH_USER_MODEL = 'django_api.User'

MEDIA_URL = '/media_back/'
MEDIA_ROOT = os.path.join(BASE_DIR, 'media_back/')