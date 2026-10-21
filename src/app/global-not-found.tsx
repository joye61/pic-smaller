import "@/main.scss";

export default function GlobalNotFound() {
  return (
    <html lang="zh-CN">
      <body>
        <main className="globalNotFound">
          <strong>404</strong>
          <h1>页面不存在</h1>
          <p>你访问的页面不存在或已经移动。</p>
          <a className="button buttonPrimary" href="/zh-CN">
            返回 LunePic
          </a>
        </main>
      </body>
    </html>
  );
}
