import { observer } from "mobx-react-lite";
import { gstate } from "./global";
import { Loading } from "./components/Loading";

export const App = observer(() => {
  return (
    <>
      {gstate.page}
      {gstate.loading && <Loading />}
    </>
  );
});
