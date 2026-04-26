# Docker Setup for Invoice Generator

This Docker setup provides a complete environment for running the invoice generator with proper Puppeteer/Chrome support.

## Quick Start

### Production Mode

```bash
# Build and run
docker-compose up -d

# Access the app at http://localhost:3000
```

### Development Mode (with hot reload)

```bash
# Run in dev mode
docker-compose --profile dev up -d invoice-app-dev

# Access the app at http://localhost:3001
```

## Building Manually

```bash
# Build the Docker image
docker build -t invoice-generator .

# Run the container
docker run -p 3000:3000 -e NEXT_PUBLIC_IS_SIMPLIFIED=true invoice-generator
```

## Configuration

### Environment Variables

Create a `.env` file in the project root:

```env
# Required
NEXT_PUBLIC_IS_SIMPLIFIED=true

# Optional - for email features
NODEMAILER_EMAIL=your_email@example.com
NODEMAILER_PW=your_email_password
```

### Company Details

Edit `lib/invoice-config.ts` to set your company information:

```typescript
export const SENDER_CONFIG = {
  name: "Your Company Name",
  address: "Your Address",
  zipCode: "Your Zip",
  city: "Your City",
  country: "Your Country",
  email: "your@email.com",
  phone: "Your Phone",
};
```

## Features

### What's Included

- ✅ Chromium browser pre-installed
- ✅ All system dependencies for Puppeteer
- ✅ Production-optimized build
- ✅ Security (non-root user)
- ✅ Resource limits configured
- ✅ Health checks ready

### PDF Generation

The Docker image includes a full Chrome/Chromium installation, so PDF generation works out of the box without any additional setup.

## Troubleshooting

### Container won't start

Check logs:
```bash
docker-compose logs -f invoice-app
```

### PDF generation fails

1. Ensure the container has enough memory:
```bash
docker-compose down
docker-compose up -d --memory="2g"
```

2. Check Chrome is accessible:
```bash
docker exec invoice-generator which chromium
docker exec invoice-generator chromium --version
```

### Build fails

Clean and rebuild:
```bash
docker-compose down
docker system prune -a
docker-compose up --build -d
```

## Production Deployment

### Docker Swarm

```bash
docker stack deploy -c docker-compose.yml invoice-generator
```

### Kubernetes

See `k8s/` directory for Kubernetes manifests (if available).

### VPS/Server

```bash
# Clone repository
git clone <repo-url>
cd invoice-generator

# Edit company details
vim lib/invoice-config.ts

# Build and run
docker-compose up -d

# Setup reverse proxy (nginx/caddy) to port 3000
```

## Resource Usage

| Resource | Minimum | Recommended |
|----------|---------|-------------|
| CPU | 1 core | 2 cores |
| RAM | 1 GB | 2 GB |
| Disk | 500 MB | 1 GB |

## Security Notes

- Runs as non-root user (`nextjs:nodejs`)
- Chrome runs in sandbox mode (with necessary flags for Docker)
- `SYS_ADMIN` capability is required for Chrome sandboxing in containers
- Shared memory size set to 2GB for Chrome stability
