import { useQuery } from "@tanstack/react-query";

import { createFileRoute } from "@tanstack/react-router";

type User = {
  id: string;
  username: string;
  email: string;
};

async function getDropboxFolders() {
  const res = await fetch("/api/dropbox/dropbox-folder");
  if (!res.ok) throw new Error("Failed to fetch folders");
  return res.json();
}
export const Route = createFileRoute("/demo/start/api-request")({
  component: Home,
});

function Home() {
  const { data: folders = [] } = useQuery({
    queryKey: ["dropbox-folders"],
    queryFn: getDropboxFolders,
  });

  return (
    <ul>
      {folders.map((f: any) => (
        <li key={f.id}>{f.name}</li>
      ))}
    </ul>
  );
}
