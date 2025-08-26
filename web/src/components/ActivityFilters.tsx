export default function ActivityFilters({
  type,
  from,
  to,
  onType,
  onFrom,
  onTo,
  onClear,
  show,
  onToggle,
}: {
  type: string;
  from: string;
  to: string;
  onType: (v: string) => void;
  onFrom: (v: string) => void;
  onTo: (v: string) => void;
  onClear: () => void;
  show: boolean;
  onToggle: () => void;
}) {
  return (
    <>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 12,
        }}>
        <h2 style={{ margin: 0 }}>Activity</h2>
        <button
          type="button"
          onClick={onToggle}
          style={{
            background: "transparent",
            border: "1px solid #ddd",
            padding: "6px 10px",
            borderRadius: 6,
          }}>
          {show ? "Hide filters" : "Show filters"}
        </button>
      </div>
      {show && (
        <div
          style={{
            border: "1px solid #eee",
            borderRadius: 10,
            padding: 12,
            background: "#fff",
            marginTop: 12,
          }}>
          <div
            style={{
              display: "flex",
              gap: 8,
              alignItems: "center",
              flexWrap: "wrap",
            }}>
            <label>
              Type{" "}
              <select value={type} onChange={(e) => onType(e.target.value)}>
                <option>All</option>
                <option>Note</option>
                <option>Call</option>
                <option>Interview</option>
                <option>Email</option>
                <option>Other</option>
              </select>
            </label>
            <label>
              From{" "}
              <input
                placeholder="YYYY-MM-DD or ISO"
                value={from}
                onChange={(e) => onFrom(e.target.value)}
              />
            </label>
            <label>
              To{" "}
              <input
                placeholder="YYYY-MM-DD or ISO"
                value={to}
                onChange={(e) => onTo(e.target.value)}
              />
            </label>
            <button
              type="button"
              onClick={onClear}
              style={{
                background: "transparent",
                border: "1px solid #ddd",
                padding: "6px 10px",
                borderRadius: 6,
              }}>
              Clear
            </button>
          </div>
        </div>
      )}
    </>
  );
}
