# FROM python:alpine3.19

# # Install Git
# RUN apk update && apk add --no-cache git

# # Prevent Python from writing .pyc files, output is sent directly to the terminal
# ENV PYTHONDONTWRITEBYTECODE=1 PYTHONUNBUFFERED=1

# # Set the working directory
# WORKDIR /app

# # Upgrade pip and install dependencies (consider using multi-stage builds for efficiency)
# RUN pip install --upgrade pip
# COPY requirements.txt ./
# RUN apk add --no-cache gcc musl-dev python3-dev
# RUN pip install -r requirements.txt

# # Copy entrypoint script and certificates
# COPY entrypoint.sh /app/entrypoint.sh
# COPY certs/localhost.crt /app/localhost.crt
# COPY certs/localhost.key /app/localhost.key

# # Set executable permissions for the entrypoint script
# RUN chmod +x /app/entrypoint.sh

# # Set the entrypoint script
# ENTRYPOINT ["/app/entrypoint.sh"]

FROM python:alpine3.19

# Install Git and other necessary packages
RUN apk update && apk add --no-cache git gcc musl-dev python3-dev libffi-dev

# Prevent Python from writing .pyc files, output is sent directly to the terminal
ENV PYTHONDONTWRITEBYTECODE=1 PYTHONUNBUFFERED=1

# Set the working directory
WORKDIR /app

# Upgrade pip and install dependencies
RUN pip install --upgrade pip
COPY requirements.txt ./
RUN pip install -r requirements.txt

# Copy entrypoint script and certificates
COPY entrypoint.sh /app/entrypoint.sh
COPY certs/localhost.crt /app/localhost.crt
COPY certs/localhost.key /app/localhost.key

# Set executable permissions for the entrypoint script
RUN chmod +x /app/entrypoint.sh

# Set the entrypoint script
ENTRYPOINT ["/app/entrypoint.sh"]


