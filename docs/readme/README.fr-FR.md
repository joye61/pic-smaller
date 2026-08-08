# Pic Smaller (图小小)

[English](../../README.md) · [简体中文](README.zh-CN.md) · [繁體中文](README.zh-TW.md) · [日本語](README.ja-JP.md) · [한국어](README.ko-KR.md) · [Français](README.fr-FR.md) · [Español](README.es-ES.md) · [فارسی](README.fa-IR.md) · [Türkçe](README.tr-TR.md)

> [!IMPORTANT]
> ### Pic Smaller Desktop — L'Édition Phare
> **La puissance native sans compromis, au-delà du navigateur.**
>
> Élevez votre flux de travail avec l'édition phare Pic Smaller Desktop. Une application native dédiée, conçue pour les professionnels qui refusent les compromis — elle manipule avec aisance les fichiers volumineux et les bibliothèques entières de dossiers, prend en charge plus de 16 formats d'image et offre des performances de traitement supérieures. Complétez l'expérience avec une suite avancée d'outils IA : suppression d'arrière-plan, suppression de filigrane et upscaling haute fidélité.
>
> [![Découvrir Pic Smaller Desktop](https://img.shields.io/badge/Explore_Pic_Smaller_Desktop-00876c?style=for-the-badge)](https://desktop.picsmaller.com/)

Pic Smaller est un compresseur d'images par lot gratuit et open source qui s'exécute
entièrement dans le navigateur. Les images sont traitées localement avec les
Web Workers, WebAssembly, Canvas et les codecs du navigateur. Les fichiers ne sont
jamais téléversés vers un serveur applicatif.

Utilisez l'application hébergée sur [picsmaller.com](https://picsmaller.com/) ou
[www.picsmaller.com](https://www.picsmaller.com/).

## Fonctionnalités

- Compresser des images JPEG, PNG, WebP, GIF, SVG et AVIF par lot.
- Décoder localement les fichiers HEIC et HEIF et les exporter en JPEG, PNG, WebP ou AVIF.
- Convertir les formats, redimensionner, recadrer et contrôler les options de qualité par encodeur.
- Ajouter des fichiers via le sélecteur, le sélecteur de dossier, le glisser-déposer ou le collage.
- Comparer l'image originale et l'image compressée avec une vue fractionnée interactive.
- Télécharger les résultats individuellement ou sauvegarder le lot complet en archive ZIP.
- Préservez votre confidentialité : le traitement reste sur votre appareil.

## Capture d'écran

![Espace de travail Pic Smaller](../demo1.png)

L'espace de travail principal intègre l'entrée par lot, les résultats de compression,
les paramètres de sortie et les actions de téléchargement dans une seule vue.

## Développement

Prérequis :

- Node.js 22 LTS ou plus récent
- npm 10 ou plus récent

```bash
git clone https://github.com/joye61/pic-smaller.git
cd pic-smaller
npm ci
npm run dev
```

Commandes utiles :

```bash
npm test            # Lancer la suite de tests
npm run lint        # Lancer ESLint
npm run build       # Construire le serveur Node.js autonome
npm run build:pages # Exporter le site statique Cloudflare Pages vers out/
```

## Déploiement

### Cloudflare Pages

Le site public utilise Cloudflare Pages avec l'intégration du dépôt GitHub.
Cloudflare construit et déploie le site automatiquement avec ces paramètres :

| Paramètre | Valeur |
| --- | --- |
| Branche de production | `master` |
| Branche de prévisualisation | `develop` |
| Commande de build | `npm run build:pages` |
| Répertoire de sortie | `out` |
| Version de Node.js | `22` |

Les poussées vers `master` mettent à jour la production. Les poussées vers `develop`
créent des déploiements de prévisualisation. Les autres branches ne sont pas
déployées automatiquement.

Le build Pages supprime le fichier `404.html` de premier niveau généré par Next.js,
permettant à Cloudflare Pages d'appliquer son repli natif pour application monopage.

### Docker

L'image Docker est une alternative pour les déploiements privés ou auto-hébergés.
Elle utilise la sortie autonome de Next.js, s'exécute en tant qu'utilisateur non
privilégié `node`, gère les signaux via `tini` et inclut un contrôle de santé.

```bash
docker build --pull -t pic-smaller:latest .

docker run -d \
  --name pic-smaller \
  --restart unless-stopped \
  --read-only \
  --tmpfs /tmp:rw,noexec,nosuid,size=64m \
  --cap-drop ALL \
  --security-opt no-new-privileges \
  -p 127.0.0.1:3000:3000 \
  pic-smaller:latest
```

Ouvrez `http://127.0.0.1:3000`. Pour un accès public, placez le conteneur derrière
un proxy inverse avec terminaison TLS tel que Caddy, nginx ou Traefik.
Ne retirez le préfixe de liaison `127.0.0.1:` que si l'exposition réseau est
intentionnelle.

### Secrets et configuration

L'application web ne nécessite pas de clés API. Ne commitez jamais
d'identifiants, de jetons Cloudflare, de fichiers `.env`, `.dev.vars`,
de clés privées ou d'état Wrangler local. Les règles d'ignorance du dépôt
excluent ces fichiers. Si une future fonctionnalité nécessite des secrets,
stockez-les dans le gestionnaire de secrets de la plateforme de déploiement
et ne fournissez que des noms de substitution documentés dans un fichier
`.env.example`.

## Structure du projet

- `src/app/` : points d'entrée de l'application Next.js.
- `src/components/` : composants d'interface réutilisables.
- `src/engines/` : codecs navigateur, workers, transformations et file de compression.
- `src/locales/` : traductions.
- `src/views/` : vues de l'application.
- `public/` : codecs navigateur et ressources WebAssembly préparés lors des builds.
- `scripts/` : préparation des codecs et scripts d'aide au déploiement.
- `tests/` : suite de tests Node.js.

## Contribuer

1. Créez une branche à partir de `develop`.
2. Exécutez `npm test`, `npm run lint` et le build de production approprié.
3. Mettez à jour la documentation et les captures d'écran en cas de changement.
4. Ouvrez une Pull Request ciblée avec une description claire et des notes de vérification.

## Licence

Pic Smaller est disponible sous la [licence MIT](./LICENSE).

## Remerciements

- [Squoosh Kit](https://github.com/bnowak008/squoosh-kit) pour les codecs AVIF, ImageQuant et OxiPNG.
- [heic-to](https://github.com/hoppergee/heic-to) pour le décodage HEIC/HEIF côté navigateur.
- [SVGO](https://github.com/svg/svgo) pour l'optimisation SVG.
- [gifsicle-wasm-browser](https://github.com/renzhezhilu/gifsicle-wasm-browser) pour la compression GIF.
