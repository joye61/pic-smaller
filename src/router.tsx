import { createBrowserHistory } from "history";
import { normalize } from "./functions";
import { gstate } from "./global";
import { modules } from "./modules";

export const history = createBrowserHistory();

type Params = Record<string, string | number> | null;

export function goto(
  pathname: string = "/",
  params?: Params,
  type: string = "push",
) {
  pathname += buildQueryString(params);
  navigate(pathname, type);
}

function buildQueryString(params?: Params) {
  if (!params) return "";
  const search = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    search.append(key, String(value));
  });

  const query = search.toString();
  return query ? `?${query}` : "";
}

function navigate(pathname: string, type: string): void {
  if (type === "push") {
    history.push(pathname);
  } else if (type === "replace") {
    history.replace(pathname);
  } else {
    throw new Error("Error history route method");
  }
}

export function initRouter() {
  history.listen(({ location }) => {
    handleRouteChange(location.pathname);
  });
  handleRouteChange(history.location.pathname);
}

async function handleRouteChange(pathname: string) {
  gstate.pathname = normalize(pathname) || "home";
  gstate.page = await loadPageComponent(gstate.pathname);
}

async function loadPageComponent(pathname: string) {
  try {
    const importer = modules[`/src/pages/${pathname}/index.tsx`]();
    const result = await importer;
    return <result.default />;
  } catch (error) {
    const error404 = await import(`@/pages/error404/index.tsx`);
    return <error404.default />;
  }
}
