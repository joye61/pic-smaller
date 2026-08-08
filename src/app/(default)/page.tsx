import ClientPage from "../ClientPage";
import RootLocaleRedirect from "../RootLocaleRedirect";
import enUS from "@/locales/en-US";

export default function Page() {
  return (
    <>
      <ClientPage lang="en-US" locale={enUS} />
      <RootLocaleRedirect />
    </>
  );
}
