import { useState, useRef, useCallback, useEffect } from "react";
import ReactCrop from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
import imageCompression from "browser-image-compression";

const ProfileImageCropper = ({
  isOpen,
  onClose,
  onCropComplete,
  initialImage,
}) => {
  const [crop, setCrop] = useState({
    unit: "%",
    width: 80,
    height: 80,
    x: 10,
    y: 10,
    aspect: 1, // Square aspect ratio for profile images
  });
  const [completedCrop, setCompletedCrop] = useState(null);
  const [imageSrc, setImageSrc] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const imgRef = useRef(null);
  const previewCanvasRef = useRef(null);

  // Set image source when initialImage changes
  useEffect(() => {
    if (initialImage) {
      setImageSrc(initialImage);
      console.log("🖼️ Image loaded in cropper:", initialImage);
    }
  }, [initialImage]);

  // Handle image load
  const onImageLoad = useCallback((img) => {
    imgRef.current = img;
    console.log("📐 Image loaded for cropping:", {
      width: img.naturalWidth,
      height: img.naturalHeight,
      complete: img.complete,
    });

    // Set initial crop after image loads
    if (img.complete && img.naturalWidth && img.naturalHeight) {
      // Trigger initial crop completion
      setTimeout(() => {
        setCompletedCrop({
          unit: "px",
          x: img.width * 0.1,
          y: img.height * 0.1,
          width: img.width * 0.8,
          height: img.height * 0.8,
        });
      }, 100);
    }
  }, []);

  // Update preview canvas when crop changes (debounced)
  useEffect(() => {
    const updateCanvas = () => {
      if (completedCrop && imgRef.current && previewCanvasRef.current) {
        const image = imgRef.current;
        const canvas = previewCanvasRef.current;
        const crop = completedCrop;

        // Validate image is properly loaded
        if (!image.complete || !image.naturalWidth || !image.naturalHeight) {
          console.warn("⚠️ Image not fully loaded yet, skipping canvas update");
          return;
        }

        // Additional validation for HTMLImageElement
        if (!(image instanceof HTMLImageElement)) {
          console.error("❌ Invalid image element type");
          return;
        }

        try {
          const scaleX = image.naturalWidth / image.width;
          const scaleY = image.naturalHeight / image.height;
          const ctx = canvas.getContext("2d");
          const pixelRatio = window.devicePixelRatio || 1;

          canvas.width = crop.width * pixelRatio * scaleX;
          canvas.height = crop.height * pixelRatio * scaleY;

          ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
          ctx.imageSmoothingQuality = "high";

          ctx.drawImage(
            image,
            crop.x * scaleX,
            crop.y * scaleY,
            crop.width * scaleX,
            crop.height * scaleY,
            0,
            0,
            crop.width * scaleX,
            crop.height * scaleY
          );

          console.log("🎨 Canvas updated successfully");
        } catch (error) {
          console.error("❌ Canvas drawing error:", error);
        }
      }
    };

    // Debounce canvas updates
    const timeoutId = setTimeout(updateCanvas, 100);
    return () => clearTimeout(timeoutId);
  }, [completedCrop]);

  // Generate cropped image
  const getCroppedImg = useCallback(async () => {
    if (!completedCrop || !imgRef.current || !previewCanvasRef.current) {
      console.warn("⚠️ Missing required elements for cropping");
      return null;
    }

    const image = imgRef.current;
    const canvas = previewCanvasRef.current;
    const crop = completedCrop;

    // Validate image is properly loaded
    if (!image.complete || !image.naturalWidth || !image.naturalHeight) {
      console.error("❌ Image not properly loaded for cropping");
      return null;
    }

    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;
    const ctx = canvas.getContext("2d");
    const pixelRatio = window.devicePixelRatio;

    canvas.width = crop.width * pixelRatio * scaleX;
    canvas.height = crop.height * pixelRatio * scaleY;

    ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
    ctx.imageSmoothingQuality = "high";

    ctx.drawImage(
      image,
      crop.x * scaleX,
      crop.y * scaleY,
      crop.width * scaleX,
      crop.height * scaleY,
      0,
      0,
      crop.width * scaleX,
      crop.height * scaleY
    );

    return new Promise((resolve) => {
      canvas.toBlob(
        (blob) => {
          if (!blob) {
            console.error("Canvas is empty");
            return;
          }
          resolve(blob);
        },
        "image/jpeg",
        0.9
      );
    });
  }, [completedCrop]);

  // Handle crop and compress
  const handleCropComplete = async () => {
    if (!completedCrop) return;

    setIsProcessing(true);
    try {
      const croppedBlob = await getCroppedImg();
      if (!croppedBlob) {
        throw new Error("Failed to crop image");
      }

      // Compress the cropped image
      const options = {
        maxSizeMB: 1,
        maxWidthOrHeight: 400,
        useWebWorker: true,
        fileType: "image/jpeg",
      };

      const compressedFile = await imageCompression(croppedBlob, options);

      // Create a File object with proper name
      const finalFile = new File([compressedFile], "profile-image.jpg", {
        type: "image/jpeg",
      });

      onCropComplete(finalFile);
      onClose();
    } catch (error) {
      console.error("Error processing image:", error);
      alert("Failed to process image. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-auto">
        <div className="p-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Crop & Adjust Your Profile Image
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                Drag to move, resize corners to adjust, or drag edges to resize
                the crop area
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 ml-4"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          {imageSrc && (
            <div className="space-y-4">
              <div className="flex justify-center">
                <ReactCrop
                  crop={crop}
                  onChange={(_, percentCrop) => {
                    setCrop(percentCrop);
                    console.log("🔄 Crop changed:", percentCrop);
                  }}
                  onComplete={(c) => {
                    setCompletedCrop(c);
                    console.log("✅ Crop completed:", c);
                  }}
                  aspect={1}
                  circularCrop
                  ruleOfThirds
                  style={{ maxWidth: "100%" }}
                >
                  <img
                    ref={imgRef}
                    alt="Crop preview"
                    src={imageSrc}
                    style={{ maxHeight: "400px", maxWidth: "100%" }}
                    onLoad={(e) => onImageLoad(e.target)}
                    onError={(e) => {
                      console.error("❌ Image failed to load:", e);
                      alert("Failed to load image. Please try again.");
                    }}
                    crossOrigin="anonymous"
                  />
                </ReactCrop>
              </div>

              {/* Preview */}
              {completedCrop && (
                <div className="flex justify-center">
                  <div className="text-center">
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                      Preview:
                    </p>
                    <canvas
                      ref={previewCanvasRef}
                      className="border border-gray-300 dark:border-gray-600 rounded-full"
                      style={{
                        width: Math.round(completedCrop?.width ?? 0),
                        height: Math.round(completedCrop?.height ?? 0),
                        maxWidth: "150px",
                        maxHeight: "150px",
                      }}
                    />
                  </div>
                </div>
              )}

              <div className="flex justify-end space-x-3 pt-4">
                <button
                  onClick={onClose}
                  className="px-4 py-2 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700"
                  disabled={isProcessing}
                >
                  Cancel
                </button>
                <button
                  onClick={handleCropComplete}
                  disabled={!completedCrop || isProcessing}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                >
                  {isProcessing ? (
                    <>
                      <svg
                        className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Processing...
                    </>
                  ) : (
                    "Crop & Save"
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfileImageCropper;
