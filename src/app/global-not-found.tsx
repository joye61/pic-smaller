import "@/main.scss";

export default function GlobalNotFound() {
  return (
    <html lang="en-US">
      <body>
        <main className="globalNotFound">
          <strong>404</strong>
          <h1>Page not found</h1>
          <p>The page you requested does not exist.</p>
          <a className="button buttonPrimary" href="/en-US/">
            Back to PicSmaller
          </a>
        </main>
      </body>
    </html>
  );
}
