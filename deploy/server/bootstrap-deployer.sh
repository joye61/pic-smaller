#!/usr/bin/env bash
set -Eeuo pipefail

[[ $EUID -eq 0 ]] || { echo "Run this script as root." >&2; exit 1; }
[[ $# -eq 1 ]] || { echo "Usage: $0 /path/to/deployer.pub" >&2; exit 1; }

readonly PUBLIC_KEY_FILE="$1"
readonly SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
readonly DEPLOY_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"

[[ -f "$PUBLIC_KEY_FILE" ]] || { echo "Public key file not found: $PUBLIC_KEY_FILE" >&2; exit 1; }
read -r public_key < "$PUBLIC_KEY_FILE"
[[ "$public_key" =~ ^ssh-(ed25519|rsa)[[:space:]] ]] || { echo "Unsupported SSH public key." >&2; exit 1; }

if ! id deployer >/dev/null 2>&1; then
  useradd --create-home --shell /bin/bash deployer
fi
passwd --lock deployer >/dev/null 2>&1 || true

install -d -m 0700 -o deployer -g deployer /home/deployer/.ssh
printf 'restrict %s\n' "$public_key" > /home/deployer/.ssh/authorized_keys
chown deployer:deployer /home/deployer/.ssh/authorized_keys
chmod 0600 /home/deployer/.ssh/authorized_keys

install -d -m 0755 /srv/images/image-tool
install -d -m 0750 -o deployer -g deployer /srv/images/image-tool/incoming
install -d -m 0755 /srv/apps/image-tool/deploy

if [[ -f /srv/apps/image-tool/deploy/compose.yaml ]]; then
  cp -a /srv/apps/image-tool/deploy/compose.yaml "/srv/apps/image-tool/deploy/compose.yaml.before-lunepic-v1"
fi
install -m 0644 "$DEPLOY_DIR/compose.yaml" /srv/apps/image-tool/deploy/compose.yaml
if [[ ! -f /srv/apps/image-tool/deploy/.env ]]; then
  install -m 0600 "$DEPLOY_DIR/.env.example" /srv/apps/image-tool/deploy/.env
fi

install -m 0750 -o root -g root "$SCRIPT_DIR/deploy-image-tool" /usr/local/sbin/deploy-image-tool

printf '%s\n' \
  'deployer ALL=(root) NOPASSWD: /usr/local/sbin/deploy-image-tool *' \
  > /etc/sudoers.d/image-tool-deployer
chmod 0440 /etc/sudoers.d/image-tool-deployer
visudo -cf /etc/sudoers.d/image-tool-deployer

printf '%s\n' \
  'Match User deployer' \
  '    PubkeyAuthentication yes' \
  '    AuthenticationMethods publickey' \
  '    PasswordAuthentication no' \
  '    KbdInteractiveAuthentication no' \
  '    PermitTTY no' \
  '    DisableForwarding yes' \
  > /etc/ssh/sshd_config.d/90-image-tool-deployer.conf

sshd -t
systemctl reload ssh.service 2>/dev/null || true

echo "Deployer account is ready. Test its SSH key before ending the current root session."
