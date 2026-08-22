import { createFileRoute } from "@tanstack/react-router";
import { AlihkanSegmentasi, metaAlihkan } from "./segmentasi";

// Menangkap semua varian /segmentasi/* (mis. /segmentasi/foo, /segmentasi/bar/x)
// dan mengalihkannya ke /jamaah dengan pesan yang sama.
export const Route = createFileRoute("/_authenticated/segmentasi/$")({
  head: metaAlihkan,
  component: AlihkanSegmentasi,
});
