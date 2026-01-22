// src/utils/imageUtils.js

/**
 * Process a single image string into a valid data URL
 */
export const processImageString = (imageString) => {
  if (!imageString || typeof imageString !== 'string') {
    return '';
  }
  
  // Remove any whitespace
  imageString = imageString.trim();
  
  // Case 1: Already a complete data URL
  if (imageString.startsWith('data:image/') && imageString.includes('base64,')) {
    return imageString;
  }
  
  // Case 2: It's "data:image/png" without base64 (broken from old entries)
  if (imageString.startsWith('data:image/') && !imageString.includes('base64,')) {
    // Can't fix this without the base64 data
    return '';
  }
  
  // Case 3: It's "base64,...." (other half of broken URL)
  if (imageString.startsWith('base64,')) {
    // Try to guess mime type from the base64 data
    const base64Data = imageString.substring(7); // Remove "base64," prefix
    let mimeType = 'image/jpeg';
    if (base64Data.startsWith('iVBORw0KGgo')) {
      mimeType = 'image/png';
    }
    return `data:${mimeType};${imageString}`;
  }
  
  // Case 4: Pure base64 string (correct format)
  const isBase64 = /^[A-Za-z0-9+/]+=*$/.test(imageString);
  const isPng = imageString.startsWith('iVBORw0KGgo');
  const isJpeg = imageString.startsWith('/9j/');
  
  if (isBase64 || isPng || isJpeg) {
    let mimeType = 'image/jpeg';
    if (isPng) {
      mimeType = 'image/png';
    } else if (imageString.startsWith('R0lGODlh')) {
      mimeType = 'image/gif';
    }
    return `data:${mimeType};base64,${imageString}`;
  }
  
  // Case 5: If we get here, it's an unknown format
  return '';
};

/**
 * Process an images array or string into an array of valid data URLs
 */
export const processImagesArray = (images) => {
  if (!images) return [];
  
  // Handle string input (semicolon-separated)
  if (typeof images === 'string') {
    // If it's already a complete data URL, return as single item array
    if (images.includes('data:image/') && images.includes('base64,')) {
      return [images];
    }
    
    // Split by semicolon and process each part
    const parts = images.split(';').filter(part => part.trim() !== '');
    
    // Try to repair broken data URLs (old format: "data:image/png;base64,xxx")
    if (parts.length >= 2) {
      const dataPart = parts.find(p => p.startsWith('data:image/'));
      const base64Part = parts.find(p => p.startsWith('base64,'));
      
      if (dataPart && base64Part) {
        // This is a broken data URL, fix it
        return [`${dataPart};${base64Part}`];
      }
    }
    
    // Process each part normally
    return parts.map(processImageString).filter(url => url !== '');
  }
  
  // Handle array input
  if (Array.isArray(images)) {
    return images.map(processImageString).filter(url => url !== '');
  }
  
  return [];
};

/**
 * Get the first valid image URL from an images array/string
 */
export const getFirstImageUrl = (images) => {
  const processed = processImagesArray(images);
  return processed.length > 0 ? processed[0] : '';
};