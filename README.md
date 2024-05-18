# Pic Smaller (图小小)

**Pic Smaller** is a super easy-to-use online image compression tool. Its UI is intuitive and supports compression configuration. At the same time, because it is purely local compression without any server-side logic, it is completely safe.

<br/>

<div><img src="https://txx.cssrefs.com/demo1.png"></div>
<br/>
<div><img src="https://txx.cssrefs.com/demo2.png"></div>

<br/>

## Usage

Pic smaller has been deployed to [`vercel`](https://vercel.com/), you can use it by visiting the URL [pic-smaller.vercel.app](pic-smaller.vercel.app). Due to the GFW, Chinese users can use it by visiting the URL [txx.cssrefs.com](https://txx.cssrefs.com)

## Develop

This is a pure [vite](https://vitejs.dev/) + [React](https://react.dev/) project, You have to get familiar with them first. Pic smaller uses modern browser technologies such as `OffScreenCanvas`, `WebAssembly`, and `Web Worker`. You should also be familiar with them before developing.

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

## Thanks

- [wasm-image-compressor](https://github.com/antelle/wasm-image-compressor) Provides PNG image compression implementation based on Webassembly
- [gifsicle-wasm-browser](https://github.com/renzhezhilu/gifsicle-wasm-browser) Provides Gif image compression implementation based on Webassembly
