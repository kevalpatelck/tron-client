import React from 'react'
import Sliderimage from '../slider/Sliderimage';


function Examplecompo() {
    const [isOpen, setIsOpen] = useState(false); // State to control modal visibility
    const selectedAccount = { privateKey: 'your-private-key-here' }; // Example data

    const copyToClipboard = () => {
        navigator.clipboard.writeText(selectedAccount?.privateKey);
        setIsOpen(true); // Open the slider modal
      };
    
      const closeModal = () => {
        setIsOpen(false);
      };
  return (
    <div>
       <div className="relative">
      <button
        onClick={copyToClipboard}
        className="px-4 py-2 bg-blue-500 text-white rounded-md"
      >
        Copy Key & Open Slider
      </button>

      {/* Modal Popup */}
      {isOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          {/* Modal background (blur effect) */}
          <div
            className="absolute inset-0 bg-black opacity-50 backdrop-blur-sm"
            onClick={closeModal}
          ></div>

          {/* Modal content (Slider with close button) */}
          <div className="relative bg-white p-4 rounded-lg shadow-lg z-10">
            <button
              onClick={closeModal}
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-800"
            >
              Close
            </button>
            <Sliderimage />
          </div>
        </div>
      )}
    </div>
    </div>
  )
}

export default Examplecompo
