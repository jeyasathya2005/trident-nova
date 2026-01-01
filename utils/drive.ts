/**
 * Converts a Google Drive sharing link to a direct image link.
 */
export const convertDriveLink = (url: string): string => {
  if (!url || typeof url !== 'string') return 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=800';
  
  // If it's already a direct image link or not from Google Drive, return it
  if (!url.includes('drive.google.com')) return url;

  let fileId = '';

  // Extract ID using a robust regex that covers common Drive sharing formats
  // Handles: /file/d/[ID]/view, ?id=[ID], etc.
  const regex = /[-\w]{25,}/;
  const match = url.match(regex);
  
  if (match) {
    fileId = match[0];
  }

  if (fileId) {
    /**
     * The thumbnail endpoint with sz=s0 is the most reliable way to 
     * embed Google Drive images in external web apps without auth headers.
     */
    return `https://drive.google.com/thumbnail?id=${fileId}&sz=s0`;
  }

  return url;
};