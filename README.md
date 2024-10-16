# Onlybags Ecommerce integration - Project Setup Guide

This document provides a step-by-step guide to set up the project in both development and production environments.

## Prerequisites

- **Docker**: Ensure Docker is installed on your system.
- **AWS CLI**: Configure the AWS CLI with your credentials.
- **Node.js & npm**: Install Node.js for development.
- **Python**: Install Python if you need to run `Dockerfile.py`.
- **nx**: You can use `nx.json` for task management in the workspace.

## Table of Contents

1. [Environment Configuration](#environment-configuration)
2. [Development Setup](#development-setup)
3. [Production Setup](#production-setup)
4. [Docker Usage](#docker-usage)
5. [Nx Workspace Tasks](#nx-workspace-tasks)
6. [Generating Cryptographic Keys](#generating-cryptographic-keys)

---

## Environment Configuration

Create a `.env` file (if not already present) to store sensitive variables.

**Example `.env` structure:**

```bash
  cp .env.example .env
```

```
AWS_ACCESS_KEY_ID=your_aws_access_key
AWS_SECRET_ACCESS_KEY=your_aws_secret_key
S3_BUCKET_NAME=your_bucket_name
NODE_ENV=development
# Many other variables...
```

Place the `.env` in the project root or modify `docker-compose` files to reference it correctly.

All processed images will be stored in the S3 bucket.

---

## Development Setup

1. Install dependencies:

   ```bash
   npm install
   ```

2. Start the development environment with Docker:

   ```bash
   docker-compose -env-file .env.dev -f docker-compose.dev.yml up --build
   ```

   Or

   ```bash
   npm run start:dev
   ```

3. Access the application:
   - Open a browser at `http://localhost:3000` (or the defined port).

---

## Production Setup

### Dockerfile.prod Summary:

- **Base Image**: Optimized for production with minimal layers.
- **Dependencies**: Copies only necessary files to avoid large image sizes.
- **Command**: Runs the production server with all necessary configurations.

1. Create a .env.prod file with production variables:

   ```bash
   cp .env .env.prod
   ```

2. Update the `.env.prod` file with production variables.

3. Run the command

   ```bash
      npm run start:d
   ```

   This will start the container in detached mode. Ready for production.

   Or

   ```bash
      npm run start
   ```

   If you want to start attached and see the logs.

---

## Docker Usage

- **Development Dockerfile**: Use `docker-compose.dev.yml` for hot-reloading.
- **Debug Dockerfile**: Use `docker-compose.debug.yml` for remote debug, port 9229 exposed.
- **Production Dockerfile**: Use `Dockerfile.prod` for optimized production builds.

---

## Nx Workspace Tasks

The `nx.json` file provides task management configurations. Example commands:

- **Build all**:
  ```bash
  npx nx run-many --target=build --all
  ```
- **Test**:
  ```bash
  npx nx test
  ```
  For more info go to [Nx Documentation](https://nx.dev/getting-started/intro).

---

## Generating Cryptographic Keys

To generate secure AES-256 keys, use the `generateCryptoKeys.js` script:

```bash
node generateCryptoKeys.js
```

Example output:

```
key: <randomly_generated_key>
iv: <randomly_generated_iv>
```

The generated `key` and `iv` should be added to the `.env` file for proper encryption functionality.
The recommended encryption algorithm is `aes-256-cbc`.

---

## Contact

For further assistance, reach out to the project maintainer: cuentaparavtv[at]gmail[dot]com.
