import { observer } from "mobx-react-lite";
import { gstate } from "./global";
import { Analytics } from "@vercel/analytics/react";
import { Loading } from "./components/Loading";

export const App = observer(() => {
  const enableAnalytics =
    process.env.NODE_ENV === "production" &&
    !["localhost", "127.0.0.1"].includes(window.location.hostname);

  return (
    <>
      {enableAnalytics && <Analytics />}
      {gstate.page}
      {gstate.loading && <Loading />}
    </>
  );
});
