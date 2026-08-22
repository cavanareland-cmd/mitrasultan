import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/segmentasi")({
  head: () => ({
    meta: [
      { title: "Segmentasi Jamaah — Dialihkan" },
      { name: "description", content: "Halaman Segmentasi Jamaah telah dipindah ke Manajemen Jamaah." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AlihkanSegmentasi,
});

/** URL lama /segmentasi diarahkan otomatis ke /jamaah dengan pesan yang jelas. */
function AlihkanSegmentasi() {
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
