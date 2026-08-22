import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { toast } from "sonner";

const judulMeta = "Segmentasi Jamaah — Dialihkan";
const deskripsiMeta = "Halaman Segmentasi Jamaah telah dipindah ke Manajemen Jamaah.";

export const metaAlihkan = () => ({
  meta: [
    { title: judulMeta },
    { name: "description", content: deskripsiMeta },
    { name: "robots", content: "noindex" },
  ],
});

/** Komponen alih yang dipakai semua varian URL /segmentasi lama. */
export function AlihkanSegmentasi() {
  const navigate = useNavigate();

  useEffect(() => {
    toast.info("Segmentasi Jamaah kini tersedia di dalam halaman Manajemen Jamaah", {
      description: "Mengalihkan Anda ke halaman tersebut…",
    });
    navigate({ to: "/jamaah", replace: true });
  }, [navigate]);

  return (
    <div className="mx-auto max-w-7xl px-6 py-20 text-center">
      <p className="text-sm font-medium text-foreground">
        Menu Segmentasi Jamaah telah dipindah.
      </p>
      <p className="mt-1 text-sm text-muted-foreground">
        Mengalihkan Anda ke halaman Manajemen Jamaah…
      </p>
    </div>
  );
}

export const Route = createFileRoute("/_authenticated/segmentasi")({
  head: metaAlihkan,
  component: AlihkanSegmentasi,
});
