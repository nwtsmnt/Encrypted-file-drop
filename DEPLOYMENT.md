# Deployment Guide - Encrypted File Drop

This guide explains how to deploy the Encrypted File Drop application to AWS EC2 using Docker.

## Prerequisites

1. **AWS Account** with:
   - EC2 instance running Amazon Linux 2
   - S3 bucket for encrypted file storage
   - IAM role with S3 permissions (recommended) OR AWS access keys

2. **EC2 Instance Requirements:**
   - t3.micro or larger
   - Security group allowing:
     - Port 22 (SSH)
     - Port 80 (HTTP)
   - Public IP address

## Step 1: Create S3 Bucket

Create an S3 bucket for storing encrypted files:

```bash
aws s3 mb s3://your-encrypted-files-bucket --region us-east-1
```

**Important:** Enable versioning and lifecycle policies if needed:

```bash
aws s3api put-bucket-versioning \
  --bucket your-encrypted-files-bucket \
  --versioning-configuration Status=Enabled
```

## Step 2: Set Up IAM Permissions (Recommended)

### Option A: IAM Role (Recommended for EC2)

1. Create an IAM role with S3 access:
   ```json
   {
     "Version": "2012-10-17",
     "Statement": [
       {
         "Effect": "Allow",
         "Action": [
           "s3:PutObject",
           "s3:GetObject",
           "s3:DeleteObject",
           "s3:HeadObject"
         ],
         "Resource": "arn:aws:s3:::your-encrypted-files-bucket/*"
       },
       {
         "Effect": "Allow",
         "Action": [
           "s3:ListBucket"
         ],
         "Resource": "arn:aws:s3:::your-encrypted-files-bucket"
       }
     ]
   }
   ```

2. Attach the role to your EC2 instance

### Option B: Access Keys

If not using IAM role, set environment variables:
```bash
export AWS_ACCESS_KEY_ID=your-access-key-id
export AWS_SECRET_ACCESS_KEY=your-secret-access-key
```

## Step 3: Deploy to EC2

### SSH into your EC2 instance:

```bash
ssh -i your-key.pem ec2-user@YOUR_EC2_IP
```

### Run the deployment script:

```bash
# Download the deployment script
curl -o deploy-ec2.sh https://raw.githubusercontent.com/nwtsmnt/Encrypted-file-drop/main/deploy-ec2.sh
chmod +x deploy-ec2.sh

# Set your S3 bucket name
export S3_BUCKET_NAME=your-encrypted-files-bucket
export AWS_REGION=us-east-1  # Change to your bucket's region

# Run deployment
./deploy-ec2.sh
```

Or manually:

```bash
# Install Docker
sudo yum install -y docker
sudo systemctl enable docker
sudo systemctl start docker
sudo usermod -aG docker ec2-user

# Install Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Clone repository
cd /home/ec2-user
git clone https://github.com/nwtsmnt/Encrypted-file-drop.git
cd Encrypted-file-drop

# Create .env file
cat > .env <<EOF
CORS_ORIGIN=http://$(curl -s http://169.254.169.254/latest/meta-data/public-ipv4)
VITE_API_URL=http://$(curl -s http://169.254.169.254/latest/meta-data/public-ipv4)/api
AWS_REGION=us-east-1
S3_BUCKET_NAME=your-encrypted-files-bucket
EOF

# Build and start
docker-compose up -d --build
```

## Step 4: Verify Deployment

1. Check containers are running:
   ```bash
   docker-compose ps
   ```

2. Check backend health:
   ```bash
   curl http://localhost:3000/api/health
   ```

3. Open in browser:
   ```
   http://YOUR_EC2_PUBLIC_IP
   ```

## Step 5: Update Application

To update the application:

```bash
cd /home/ec2-user/Encrypted-file-drop
git pull
docker-compose up -d --build
```

## Troubleshooting

### Containers not starting

Check logs:
```bash
docker-compose logs backend
docker-compose logs frontend
```

### S3 access errors

- Verify IAM role is attached to EC2 instance
- Check S3 bucket name is correct in `.env`
- Verify bucket region matches `AWS_REGION`

### Port conflicts

If port 80 or 3000 are already in use:
- Stop conflicting services
- Or modify ports in `docker-compose.yml`

## Security Notes

1. **S3 Bucket:** Keep bucket private (default)
2. **IAM Role:** Prefer IAM roles over access keys
3. **HTTPS:** Set up SSL/TLS with ALB or CloudFront for production
4. **Security Groups:** Restrict access to necessary IPs only

## Environment Variables

See `.env.example` for all available configuration options.

