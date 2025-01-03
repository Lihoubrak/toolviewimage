import React from "react";
import Modal from "react-modal";
import { FaTimes } from "react-icons/fa";

const ImageModalComponent = ({
  isModalOpen,
  onClose,
  selectedImages,
}) => (
  <Modal
    isOpen={isModalOpen}
    onRequestClose={onClose}
    style={{
      content: {
        top: "0%",
        left: "0%",
        right: "0%",
        bottom: "0%",
        margin: 0,
        padding: 0,
        transform: "none",
        width: "100%",
        height: "100%",
        backgroundColor: "#000",
      },
      overlay: { backgroundColor: "rgba(0, 0, 0, 0.9)" },
    }}
  >
    <div className="relative w-full h-full">
      <button
        onClick={onClose}
        className="absolute top-2 right-2 text-white bg-red-500 rounded-full p-2 hover:bg-red-600 z-10"
      >
        <FaTimes />
      </button>
      <div className="flex flex-wrap justify-center gap-4 p-4 overflow-y-auto w-full h-full">
        {selectedImages.length > 0 ? (
          selectedImages.map((url, idx) => (
            <div key={idx} className="w-1/3 p-2">
              <img
                src={`https://drive.google.com/thumbnail?id=${
                  url.split("id=")[1]
                }`}
                alt={`Thumbnail ${idx + 1}`}
                onClick={() => window.open(url, "_blank")}
                className="cursor-pointer border border-gray-300 rounded shadow-md w-full h-auto object-contain"
              />
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500">No images available</p>
        )}
      </div>
    </div>
  </Modal>
);

export default ImageModalComponent;
