export function ReportTable({ headers = [], rows = [] }) {
  return (
    <table style={tableStyle}>
      <thead>
        <tr>
          {headers.map((h, i) => (
            <th key={i} style={thStyle}>
              {h}
            </th>
          ))}
        </tr>
      </thead>

      <tbody>
        {rows.map((row, i) => (
          <tr key={i}>
            {row.map((cell, j) => (
              <td key={j} style={tdStyle}>
                {cell}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

const tableStyle = {
  width: "100%",
  borderCollapse: "collapse",
  marginTop: "20px",
  fontSize: "14px",
};

const thStyle = {
  borderBottom: "2px solid #000",
  padding: "8px",
  textAlign: "left",
};

const tdStyle = {
  borderBottom: "1px solid #000",
  padding: "8px",
};
