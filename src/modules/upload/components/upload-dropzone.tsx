import { useState } from 'react';
import { useUploadFiles } from '@better-upload/client';
import { UploadDropzone } from '@/components/ui/upload-dropzone';

export function ImageUploaderWithPreview() {
  const [uploadedUrl, setUploadedUrl] = useState<string | null>(null);

  const { control } = useUploadFiles({
    api: '/api/uploads',
    route: 'images',
    onUploadComplete: ({ files }) => {
      if (files && files.length > 0) {
        const file = files[0];
        const url = `https://cdn.saifulalom.com/${file.objectInfo.key}`;
        setUploadedUrl(url);
      }
    },
  });

  return (
    <div className="space-y-4">
      <UploadDropzone control={control} accept="image/*" />

      {/* Show the uploaded image preview */}
      {uploadedUrl && (
        <div className="mt-4">
          <p className="text-sm font-medium mb-2">Uploaded Preview:</p>
          <img
            src={uploadedUrl}
            alt="Uploaded preview"
            className="w-48 h-48 object-cover rounded-lg border"
          />
        </div>
      )}
    </div>
  );
}