# LunePic production deployment

LunePic is built on GitHub Actions and runs as a prebuilt AMD64 image. The production server never compiles the Next.js application.

## 1. Create the deployment key

Run this on a trusted workstation, not on the server:

```bash
ssh-keygen -t ed25519 -C "lunepic-github-actions" -f lunepic_deploy
```

Keep `lunepic_deploy` private. Upload only `lunepic_deploy.pub`, the `deploy` directory, and this repository's deployment files to a temporary root-owned directory on the server.

## 2. Bootstrap the server

While keeping the existing root SSH session open, run on the server:

```bash
chmod +x deploy/server/bootstrap-deployer.sh
sudo deploy/server/bootstrap-deployer.sh /path/to/lunepic_deploy.pub
```

The script creates `deployer` without Docker-group or general sudo access. It can upload releases and invoke only `/usr/local/sbin/deploy-image-tool`. Test the key before closing the root session:

```bash
ssh -i lunepic_deploy deployer@39.105.122.140 'printf ready'
```

Copy `deploy/nginx/image-tool.conf.example` over the existing virtual-host configuration only after comparing it with Certbot's current file. Then run:

```bash
nginx -t && systemctl reload nginx
```

## 3. Configure GitHub

Create a GitHub Environment named `production` and add these secrets:

| Secret            | Value                                                                                        |
| ----------------- | -------------------------------------------------------------------------------------------- |
| `SERVER_HOST`     | `39.105.122.140`                                                                             |
| `SERVER_USER`     | `deployer`                                                                                   |
| `SSH_PRIVATE_KEY` | Entire contents of `lunepic_deploy`                                                          |
| `SSH_KNOWN_HOSTS` | Output of `ssh-keyscan -H 39.105.122.140` after verifying its fingerprint against the server |

Protect `master`, require the CI workflow, and merge the LunePic pull request before creating a production tag.

## 4. Release

Create and push a SemVer tag only from the intended production commit:

```bash
git tag -a v1.0.0 -m "LunePic v1.0.0"
git push origin v1.0.0
```

The release workflow validates source, builds `linux/amd64`, uploads a checksum-protected image, invokes the deployment script, and verifies the public health endpoint. On a failed health check the server restores the prior `IMAGE_TAG` automatically.

## 5. Monitoring and logs

Create an UptimeRobot HTTPS monitor with a five-minute interval:

- URL: `https://img.arcanelune.top/api/health`
- Expected status: `200`
- Expected keyword: `"status":"ok"`
- Alert contact: the certificate-renewal email
- Enable SSL certificate expiry alerts

The application does not include front-end analytics. Inspect traffic on demand with:

```bash
goaccess /var/log/nginx/image-tool.access.log --log-format=COMBINED
```

Nginx's standard logrotate integration rotates the per-site logs. Application logs remain capped by Docker Compose at 10 MB × 3 files.

## 6. Manual checks and rollback

```bash
curl -fsS https://img.arcanelune.top/api/health
cd /srv/apps/image-tool/deploy
docker compose ps
docker compose logs --tail=100
docker stats --no-stream
```

To roll back, choose one of the retained tags from `docker image ls local/image-tool`, update `IMAGE_TAG` in `.env`, and run:

```bash
docker compose up -d --no-build
curl -fsS http://127.0.0.1:13001/api/health
```

For the first release, `local/image-tool:initial` is the fallback. Its health endpoint did not exist, so validate that fallback at `http://127.0.0.1:13001/` instead. After later releases, the deployment script retains the live image and the two most recent rollback images.
