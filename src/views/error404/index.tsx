import { goto } from "@/router";
import style from "./index.module.scss";
import { observer } from "mobx-react-lite";
import { gstate } from "@/global";

const Error404 = observer(() => {
  return (
    <main className={style.container}>
      <div><span>404</span><h1>{gstate.locale?.error404.description}</h1><button type="button" className="button buttonPrimary" onClick={() => goto("/", null, "replace")}>{gstate.locale?.error404.backHome}</button></div>
    </main>
  );
});

export default Error404;
