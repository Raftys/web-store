# Use PHP CLI image (because you want php -S built-in server)
FROM php:8.3-cli

# Install mysqli and pdo_mysql extensions
RUN docker-php-ext-install mysqli pdo pdo_mysql

# Set the working directory for the build process
WORKDIR /app

# Copy project files
COPY . .

# Verify that the directory exists
RUN ls -la /app

# Command to run the application using air
CMD ["php", "-S", "0.0.0.0:8080", "-t", "."]