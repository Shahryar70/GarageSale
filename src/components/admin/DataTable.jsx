// src/components/admin/DataTable.jsx
export default function DataTable({ columns, data, actions }) {
  return (
    <div className="overflow-x-auto border rounded-lg">
      <table className="w-full text-left">
        <thead className="bg-gray-100">
          <tr>
            {columns.map((c) => (
              <th key={c} className="p-3 text-sm font-semibold">{c}</th>
            ))}
            {actions && <th className="p-3 text-sm font-semibold">Actions</th>}
          </tr>
        </thead>
        <tbody>
          {data.map((row) => (
            <tr key={row.id} className="border-b hover:bg-gray-50">
              {columns.map((c) => (
                <td key={c} className="p-3 text-sm">{row[c.toLowerCase()]}</td>
              ))}
              {actions && (
                <td className="p-3 text-sm flex gap-2">{actions(row)}</td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
