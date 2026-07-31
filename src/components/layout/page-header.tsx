import type { ReactNode } from "react";

/** Judul halaman standar dengan deskripsi singkat dan slot aksi. */
export function PageHeader({
  judul,
  deskripsi,
  aksi,
}: {
  judul: string;
  deskripsi: string;
  aksi?: ReactNode;
}) {
  return (
    <div className="grid grid-cols-[minmax(0,1fr)_auto] items-end gap-4 sm:flex sm:flex-wrap sm:justify-between">
      <div className="min-w-0">
        <h2 className="truncate font-display text-2xl font-semibold sm:text-3xl">{judul}</h2>
        <p className="mt-1 text-sm text-muted-foreground">{deskripsi}</p>
      </div>
      {aksi ? <div className="shrink-0">{aksi}</div> : null}
    </div>
  );
}
