#!/bin/bash
set -e

echo "=== Encrypted File Drop - EC2 Deployment Script ==="

# Get EC2 public IP
EC2_IP="$(curl -s http://169.254.169.254/latest/meta-data/public-ipv4 || echo 'localhost')"
echo "Detected public IP: $EC2_IP"

REPO_URL="https://github.com/nwtsmnt/Encrypted-file-drop.git"
APP_DIR="/home/ec2-user/Encrypted-file-drop"

echo "=== Installing Docker ==="
if ! command -v docker &> /dev/null; then
  sudo yum install -y docker
  sudo systemctl enable docker
  sudo systemctl start docker
  sudo usermod -aG docker ec2-user
  echo "Docker installed. You may need to log out and back in for group changes to take effect."
else
  echo "Docker already installed"
fi

echo "=== Installing Docker Compose ==="
if ! command -v docker-compose &> /dev/null; then
  sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
  sudo chmod +x /usr/local/bin/docker-compose
  echo "Docker Compose installed"
else
  echo "Docker Compose already installed"
fi

echo "=== Cloning/updating repository ==="
cd /home/ec2-user
if [ ! -d "$APP_DIR" ]; then
  git clone "$REPO_URL" "$APP_DIR"
else
  cd "$APP_DIR"
  git pull --rebase || true
fi
cd "$APP_DIR"

echo "=== Creating .env file for docker-compose ==="
cat > .env <<EOF
# Server configuration
CORS_ORIGIN=http://$EC2_IP
VITE_API_URL=http://$EC2_IP/api

# AWS S3 Configuration
# Option 1: Use IAM role (recommended for EC2)
# Leave AWS_ACCESS_KEY_ID and AWS_SECRET_ACCESS_KEY empty to use IAM role
AWS_REGION=${AWS_REGION:-us-east-1}
S3_BUCKET_NAME=${S3_BUCKET_NAME}

# Option 2: Use access keys (if not using IAM role)
# AWS_ACCESS_KEY_ID=your-access-key-id
# AWS_SECRET_ACCESS_KEY=your-secret-access-key
EOF

echo "=== Building and starting containers ==="
docker-compose down || true  # Stop any existing containers
docker-compose up -d --build

echo "=== Waiting for services to be ready ==="
sleep 5

echo "=== Checking service status ==="
docker-compose ps

echo "=== Testing backend health endpoint ==="
curl -sS http://localhost:3000/api/health || echo "Backend health check failed (may need a moment to start)"

echo ""
echo "=== Deployment complete! ==="
echo "Your app should be accessible at: http://$EC2_IP"
echo ""
echo "To view logs:"
echo "  docker-compose logs -f"
echo ""
echo "To stop services:"
echo "  docker-compose down"
echo ""
echo "To update and redeploy:"
echo "  cd $APP_DIR"
echo "  git pull"
echo "  docker-compose up -d --build"

