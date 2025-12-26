import { Link } from "react-router-dom";

export default function About() {
  return (
    <div className="app-shell">
      <div className="topbar">
        <h2>About</h2>
        <div className="controls">
          <Link className="btn" to="/catalog">Back</Link>
        </div>
      </div>

      <div className="ribbon-list" style={{ padding: 16 }}>
        <h3 style={{ marginTop: 0 }}>Uniform Ribbons (Modern)</h3>
        <p>
          A modernized port of a legacy ribbon checker / rack builder style project.
          Built to preserve legacy imagery paths and regulation/reference links while
          making the UI modular and easier to extend.
        </p>
        <p className="ribbon-sub">
          Notes: images live in <code>app/public/image</code>. Device selections persist in localStorage.
        </p>
      </div>
    </div>
  );
}
