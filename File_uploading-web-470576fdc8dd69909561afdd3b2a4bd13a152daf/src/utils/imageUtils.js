import imageCompression from 'browser-image-compression';

// Image compression utility
export const compressImage = async (file, options = {}) => {
  const defaultOptions = {
    maxSizeMB: 1,
    maxWidthOrHeight: 1920,
    useWebWorker: true,
    fileType: 'image/jpeg',
    ...options
  };

  try {
    console.log('🔄 Compressing image:', {
      originalSize: (file.size / 1024 / 1024).toFixed(2) + ' MB',
      name: file.name,
      type: file.type
    });

    const compressedFile = await imageCompression(file, defaultOptions);
    
    console.log('✅ Image compressed:', {
      originalSize: (file.size / 1024 / 1024).toFixed(2) + ' MB',
      compressedSize: (compressedFile.size / 1024 / 1024).toFixed(2) + ' MB',
      reduction: (((file.size - compressedFile.size) / file.size) * 100).toFixed(1) + '%'
    });

    return compressedFile;
  } catch (error) {
    console.error('❌ Image compression failed:', error);
    throw new Error('Failed to compress image');
  }
};

// Profile image specific compression
export const compressProfileImage = async (file) => {
  return await compressImage(file, {
    maxSizeMB: 0.5,
    maxWidthOrHeight: 400,
    useWebWorker: true,
    fileType: 'image/jpeg',
  });
};

// File upload compression (for general files)
export const compressUploadImage = async (file) => {
  return await compressImage(file, {
    maxSizeMB: 2,
    maxWidthOrHeight: 1920,
    useWebWorker: true,
    fileType: 'image/jpeg',
  });
};

// Validate image file
export const validateImageFile = (file) => {
  const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
  const maxSize = 10 * 1024 * 1024; // 10MB

  if (!validTypes.includes(file.type)) {
    throw new Error('Please select a valid image file (JPEG, PNG, or WebP)');
  }

  if (file.size > maxSize) {
    throw new Error('Image file size must be less than 10MB');
  }

  return true;
};

// Convert file to base64
export const fileToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });
};

// Create image preview URL
export const createImagePreview = (file) => {
  return URL.createObjectURL(file);
};

// Clean up image preview URL
export const cleanupImagePreview = (url) => {
  if (url && url.startsWith('blob:')) {
    URL.revokeObjectURL(url);
  }
};

export default {
  compressImage,
  compressProfileImage,
  compressUploadImage,
  validateImageFile,
  fileToBase64,
  createImagePreview,
  cleanupImagePreview
};
