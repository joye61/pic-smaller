# Pic Smaller (图小小)

**Pic Smaller** is a super easy-to-use online image compression tool. Simply upload your desired image(s), and Pic Smaller will automatically perform its compress functionality and provide details on the results. Users can also customize features to suite their desired output, such as setting the output format or number of output colors. It's intuitive, website and mobile friendly, and supports compression configuration. At the same time, because of purely local compression without any server-side logic, it is completely safe.

<br/>

<div><img src="./docs/demo1.png"></div>
Figure 1: Pic Smaller's landing page, where users can upload their images for compression
<br/>
<br/>
<div><img src="./docs/demo2.png"></div>
Figure 2: Example pictures uploaded for compression shown on the left, and Pic Smaller's customizable compression and editing features shown on the right
<br/>
<br/>
<div><img src="./docs/demo3.png"></div>
Figure 3: Pic Smaller's comparison tool, that the user can drag to see the difference between the original and compressed image
<br/>
<br/>

## Usage

Pic smaller has been deployed to [`vercel`](https://vercel.com/), you can use it by visiting the URL [pic-smaller.vercel.app](https://pic-smaller.vercel.app). Due to the GFW, Chinese users can use it by visiting the URL [picsmaller.com](https://picsmaller.com/)

> [picsmaller.com](https://picsmaller.com/) is a new domain that has just been applied for. The old domain [txx.cssrefs.com](https://txx.cssrefs.com/) is still accessible, but will be expired on `2025-02-22` and payment will not continue. Please use the latest domain to access the service.

## Preqrequisites

Node.js
1. Navigate to the Node.js website: https://nodejs.org/en/
2. Download the recommended version (which is currently v20.17.0).
3. Follow the steps on your computer to finish its installation.
4. To verify installation, open up the command prompt and run the following command. If the version is outputted, you have succesfully installed Node.js.
```
node -v
```

## Develop

Pic smaller is a [Vite](https://vitejs.dev/) + [React](https://react.dev/) project, you have to get familiar with them first. It uses modern browser technologies such as `OffscreenCanvas`, `WebAssembly`, and `Web Worker`. You should also be familiar with them before developing.

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

Hold control and left click the URL next to "Local:" to open the website on your local machine.

![image](https://github.com/user-attachments/assets/b82b296d-74bf-48db-8284-34f2db3b8c3f)
<br/>
Figure 4: Where to open the localhost website link


## Deploy

If you want to independently deploy this project on your own server, the following document based on Docker, and [Dockerfile](./Dockerfile) script has been tested. Within the project root directory, follow the instructions to start docker application

```bash
# Build docker image from Dockerfile
docker build -t picsmaller .

# Start a container
docker run -p 3001:3001 -d picsmaller
```

Now you can access the project via http://127.0.0.1:3001. If you want your project to be accessible to everyone, you need to prepare a domain name pointing to your local machine, and then proxy it to port 3001 of this machine, through a reverse proxy server like nginx.

## Contributing

1. Ensure all required dependency installations have been properly followed to accurately test your changes.
2. Update the README.md with information about changes to the interface, including new environment variables, important file locations, and container parameters.
4. Increase the version numbers in all example files and the README.md to reflect the new version represented by your changes.
5. Create a Pull Request with an appropriate and descriptive title and description.
6. You can reach out to other developers to review and merge the Pull Request if appropriate.

Our standards for contributions: By using welcoming and inclusive language, respecting diverse viewpoints and experiences, embracing constructive criticism, and prioritizing what’s best for the community, we can create a positive and collaborative environment for everyone.

## Project Structure

The src folder stores in all the files and components used in the react application like App.tsx.
<br/>
The tests folder includes code to test particular features during the development process.
<br/>
The docs folder includes the pictures used for this README documentation.

## License

This project is under [MIT](LICENSE) license.

## Contact

Please contact the repository owner joye61's email for any questions: 89065495@qq.com

## Thanks

- [ant-design](https://github.com/ant-design/ant-design) Provides React-based UI solutions
- [wasm-image-compressor](https://github.com/antelle/wasm-image-compressor) Provides PNG image compression implementation based on Webassembly
- [gifsicle-wasm-browser](https://github.com/renzhezhilu/gifsicle-wasm-browser) Provides GIF image compression implementation based on Webassembly
- [wasm_avif](https://github.com/packurl/wasm_avif) Provides AVIF image compression implementation based on Webassembly
- [svgo](https://github.com/svg/svgo) Provides SVG vector compression
