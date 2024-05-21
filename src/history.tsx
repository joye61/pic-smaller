import { createBrowserHistory } from "history";
import { normalize } from "./functions";
import { gstate } from "./global";
import { modules } from "./modules";

export const history = createBrowserHistory();

export function goto(
  pathname: string = "/",
  params?: Record<string, string | number> | null,
  type: string = "push",
) {
  let query = "";
  if (params) {
    const search = new URLSearchParams();
    for (const key in params) {
      search.append(key, String(params[key]));
    }
    query = search.toString();
  }
  if (query) {
    pathname += "?" + query;
  }

  if (type === "push") {
    history.push(pathname);
  } else if (type === "replace") {
    history.replace(pathname);
  } else {
    throw new Error("Error history route method");
  }
}

export function initHistoryLogic() {
  history.listen(({ location }) => {
    showPageByPath(location.pathname);
  });
  showPageByPath(history.location.pathname);
}

export async function showPageByPath(pathname: string) {
  pathname = normalize(pathname);
  if (!pathname) {
    pathname = "home";
  }
  gstate.pathname = pathname;
  try {
    type ModuleResult = { default: React.FunctionComponentFactory<object> };
    const importer = modules[`/src/pages/${pathname}/index.tsx`]();
    const result: ModuleResult = (await importer) as ModuleResult;
    gstate.page = <result.default />;
  } catch (error) {
    const error404 = await import(`@/pages/error404/index.tsx`);
    gstate.page = <error404.default />;
  }
}
