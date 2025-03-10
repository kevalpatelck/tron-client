import { useState } from "react";
import { Dialog } from "@headlessui/react";

export default function TableWithPopup() {
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState("");

  return (
    <div className="p-4 relative">
      <table className="w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-200">
            <th className="border border-gray-300 p-2">Action</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="border border-gray-300 p-2 text-center">
              <button
                onClick={() => setIsOpen(true)}
                className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-indigo-600 hover:to-blue-700 text-white font-bold py-2 px-4 rounded-lg shadow-md transition-transform transform hover:scale-105"
              >
                Add
              </button>
            </td>
          </tr>
        </tbody>
      </table>

      {/* Transparent Popup */}
      {isOpen && (
        <div className="absolute top-10 left-1/2 transform -translate-x-1/2 bg-white bg-opacity-80 backdrop-blur-md p-6 rounded-lg shadow-lg w-80 border border-gray-300">
          <h2 className="text-lg font-bold mb-4">Enter Details</h2>
          <input
            type="text"
            placeholder="Enter text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-lg mb-4"
          />
          <button
            onClick={() => setIsOpen(false)}
            className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-2 rounded-lg transition-transform transform hover:scale-105"
          >
            Add to Main
          </button>
        </div>
      )}
    </div>
  );
}
