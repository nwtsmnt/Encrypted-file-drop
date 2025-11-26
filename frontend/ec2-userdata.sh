#!/bin/bash -xe

# -------- System update & tools ----------
yum update -y
yum install -y git nginx

# Install Node.js 20 (Amazon Linux 2 via NodeSource)
curl -fsSL https://rpm.nodesource.com/setup_20.x | bash -
yum install -y nodejs

# -------- Clone your app repo ----------
cd /home/ec2-user
GITHUB_REPO_URL="https://github.com/<your-user-or-org>/Encrypted-file-drop.git"
if [ ! -d "Encrypted-file-drop" ]; then
  git clone "$GITHUB_REPO_URL" Encrypted-file-drop
fi
cd Encrypted-file-drop

# -------- Backend setup ----------
cd backend
npm install

# Determine this instance's public IP (for CORS and frontend API URL)
EC2_PUBLIC_IP="$(curl -s http://169.254.169.254/latest/meta-data/public-ipv4 || echo '127.0.0.1')"

cat > .env <<EOF
NODE_ENV=production
PORT=3000
CORS_ORIGIN=http://$EC2_PUBLIC_IP
MAX_FILE_SIZE=52428800
EOF

npm run build

# Simple systemd service for backend
cat > /etc/systemd/system/encrypted-backend.service <<EOF
[Unit]
Description=Encrypted File Drop Backend
After=network.target

[Service]
Type=simple
User=ec2-user
WorkingDirectory=/home/ec2-user/Encrypted-file-drop/backend
Environment=NODE_ENV=production
Environment=PORT=3000
Environment=CORS_ORIGIN=http://$EC2_PUBLIC_IP
Environment=MAX_FILE_SIZE=52428800
ExecStart=/usr/bin/node dist/index.js
Restart=always

[Install]
WantedBy=multi-user.target
EOF

systemctl daemon-reload
systemctl enable encrypted-backend.service
systemctl start encrypted-backend.service

# -------- Frontend setup ----------
cd /home/ec2-user/Encrypted-file-drop/frontend
npm install

# Frontend will talk to backend via public IP
cat > .env.production <<EOF
VITE_API_URL=http://$EC2_PUBLIC_IP/api
EOF

npm run build

# Copy static files to Nginx web root
rm -rf /usr/share/nginx/html/*
cp -r dist/* /usr/share/nginx/html/

# -------- Nginx config ----------
cat > /etc/nginx/conf.d/encrypted-app.conf <<EOF
server {
    listen 80;
    server_name _;

    root /usr/share/nginx/html;
    index index.html;

    # Serve frontend
    location / {
        try_files \$uri /index.html;
    }

    # Proxy API to Node backend
    location /api/ {
        proxy_pass http://127.0.0.1:3000/;
        proxy_http_version 1.1;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
    }
}
EOF

# Remove default server block if present
rm -f /etc/nginx/conf.d/default.conf || true

systemctl enable nginx
systemctl restart nginx

chown -R ec2-user:ec2-user /home/ec2-user
