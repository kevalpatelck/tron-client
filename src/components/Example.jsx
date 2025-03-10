import { useState } from "react";

export default function TableWithPopup() {
  const [openRow, setOpenRow] = useState(null);

  const togglePopup = (rowId) => {
    setOpenRow(openRow === rowId ? null : rowId);
  };

  return (
    <div className="overflow-x-auto max-h-64 border rounded-lg shadow p-4">
      <table className="min-w-full border-collapse">
        <thead className="bg-gray-200">
          <tr>
            <th className="px-4 py-2 border">#</th>
            <th className="px-4 py-2 border">Name</th>
            <th className="px-4 py-2 border">Score</th>
            <th className="px-4 py-2 border">View</th>
          </tr>
        </thead>
        <tbody className="bg-white">
          {[
            { id: 1, name: "John", score: 95 },
            { id: 2, name: "Doe", score: 88 },
            { id: 3, name: "Smith", score: 76 },
          ].map((row) => (
            <tr key={row.id} className="relative">
              <td className="px-4 py-2 border">{row.id}</td>
              <td className="px-4 py-2 border">{row.name}</td>
              <td className="px-4 py-2 border">{row.score}</td>
              <td className="px-4 py-2 border text-center relative">
                {/* Eye Icon */}
                <button onClick={() => togglePopup(row.id)}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="2"
                    stroke="currentColor"
                    className="w-6 h-6 text-blue-500 cursor-pointer"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 4.5c-4.75 0-8.5 4-8.5 7.5s3.75 7.5 8.5 7.5 8.5-4 8.5-7.5-3.75-7.5-8.5-7.5z"
                    ></path>
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 9a3 3 0 100 6 3 3 0 000-6z"
                    ></path>
                  </svg>
                </button>

                {/* Popup Box */}
                {openRow === row.id && (
                  <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 w-40 bg-black text-white text-sm rounded-lg px-3 py-2 shadow-lg">
                    Viewing details for <b>{row.name}</b>
                  </div>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
