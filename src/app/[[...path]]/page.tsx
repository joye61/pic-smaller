import ClientPage from "../ClientPage";

export function generateStaticParams() {
  return [{ path: [] }];
}

export default function Page() {
  return <ClientPage />;
}