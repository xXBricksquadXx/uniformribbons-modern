import { Link, useParams } from "react-router-dom";
import { useRibbons } from "../data/useRibbons";

export default function RibbonDetail() {
  const { ribbonId } = useParams();
  const { ribbons, error } = useRibbons();

  if (error) return <div style={{ padding: 16 }}>Error loading ribbons: {error}</div>;
  const r = ribbons.find((x) => x.id === ribbonId);

  if (!r) {
    return (
      <div style={{ padding: 16 }}>
        <p>Ribbon not found: {ribbonId}</p>
        <Link to="/catalog">Back</Link>
      </div>
    );
  }

  return (
    <div style={{ padding: 16 }}>
      <Link to="/catalog">Back to catalog</Link>
      <h2>{r.name}</h2>

      <img
        src={r.image.legacyPath}
        alt={r.name}
        title={r.name}
        style={{ width: 240, height: "auto" }}
        onError={(e) => {
          (e.currentTarget as HTMLImageElement).src = "/image/missing.svg";
        }}
      />

      <div style={{ marginTop: 12 }}>
        <div>
          <strong>ID:</strong> {r.id}
        </div>
        <div>
          <strong>Precedence:</strong> {r.precedence}
        </div>
      </div>

      {r.links?.detailHref ? (
        <div style={{ marginTop: 12 }}>
          <strong>Legacy link preserved:</strong>{" "}
          <a href={r.links.detailHref} target="_blank" rel="noreferrer">
            {r.links.detailHref}
          </a>
        </div>
      ) : null}
    </div>
  );
}
