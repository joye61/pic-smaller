# Pic Smaller (图小小)

**Pic Smaller** is a super easy-to-use online image compression tool. Its UI is intuitive and supports compression configuration. At the same time, because it is purely local compression without any server-side logic, it is completely safe.

<br/>

<div><img src="./docs/demo1.png"></div>
<br/>
<div><img src="./docs/demo2.png"></div>
<br/>
<div><img src="./docs/demo3.png"></div>

<br/>

## Usage

Pic smaller has been deployed to [`vercel`](https://vercel.com/), you can use it by visiting the URL [pic-smaller.vercel.app](https://pic-smaller.vercel.app). Due to the GFW, Chinese users can use it by visiting the URL [picsmaller.com](https://picsmaller.com/)

> [picsmaller.com](https://picsmaller.com/) is a new domain that has just been applied for. The old domain [txx.cssrefs.com](https://txx.cssrefs.com/) is still accessible, but will be expired on `2025-02-22` and payment will not continue. Please use the latest domain to access the service.

## Develop

This is a pure [Vite](https://vitejs.dev/) + [React](https://react.dev/) project, You have to get familiar with them first. Pic smaller uses modern browser technologies such as `OffscreenCanvas`, `WebAssembly`, and `Web Worker`. You should also be familiar with them before developing.

```bash
# Clone the repo
git clone https://github.com/joye61/pic-smaller.git

# Change cwd
cd ./pic-smaller

# Install dependences
npm install

# Start to develop
npm run dev
```

## Deployment

If you are not a front-end development engineer and want to independently deploy this purely static project on your own server, the following is an independent deployment document based on Docker


There is a [Dockerfile](./Dockerfile) script in the project root directory that has been tested and can be deployed independently. After entering the project root directory, follow the instructions below to start the independent docker application. The default listening port is `3001`


```bash
# Build docker image from Dockerfile
docker build -t picsmaller .

# Start a container
docker run -p 3001:3001 -d picsmaller
```

At this point, you can already access the project via **http://127.0.0.1:3001**. If you want your project to be accessible to everyone, you need to prepare a domain name pointing to your local machine that is accessible from the public network. You may also need an SSL certificate, and then proxy it to port 3001 of this machine through a reverse proxy server like nginx. 


## Thanks

- [ant-design](https://github.com/ant-design/ant-design) Provides React-based UI solutions
- [wasm-image-compressor](https://github.com/antelle/wasm-image-compressor) Provides PNG image compression implementation based on Webassembly
- [gifsicle-wasm-browser](https://github.com/renzhezhilu/gifsicle-wasm-browser) Provides GIF image compression implementation based on Webassembly
- [wasm_avif](https://github.com/packurl/wasm_avif) Provides AVIF image compression implementation based on Webassembly
- [svgo](https://github.com/svg/svgo) Provides SVG vector compression
