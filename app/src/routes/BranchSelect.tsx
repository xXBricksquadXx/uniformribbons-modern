import { Link } from "react-router-dom";
import { BRANCHES } from "../data/branches";

export default function BranchSelect() {
  return (
    <div style={{ padding: 16 }}>
      <h1>Ribbon Checker</h1>
      <p>Select a branch.</p>

      <ul>
        {BRANCHES.map((b) => (
          <li key={b.id}>
            <Link to={`/branch/${b.id}`}>{b.label}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
