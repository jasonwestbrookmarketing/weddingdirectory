"use client";

import { useCallback, useRef, useState } from "react";
import { Upload, X, Image as ImageIcon } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

const ACCEPTED_TYPES = ["image/jpeg", "image/png", "image/webp"];
const MAX_SIZE = 10 * 1024 * 1024;
const BUCKET = "venue-images";

interface ImageUploaderProps {
  venueId: string;
  coverImageUrl: string | null;
  galleryImages: string[];
  onCoverChange: (url: string | null) => void;
  onGalleryChange: (urls: string[]) => void;
}

interface UploadProgress {
  file: string;
  progress: number;
}

export function ImageUploader({
  venueId,
  coverImageUrl,
  galleryImages,
  onCoverChange,
  onGalleryChange,
}: ImageUploaderProps) {
  const [coverUploading, setCoverUploading] = useState(false);
  const [galleryUploading, setGalleryUploading] = useState(false);
  const [uploads, setUploads] = useState<UploadProgress[]>([]);
  const [error, setError] = useState<string | null>(null);
  const coverInputRef = useRef<HTMLInputElement>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);

  const validateFile = (file: File): string | null => {
    if (!ACCEPTED_TYPES.includes(file.type)) {
      return `${file.name}: Only JPEG, PNG, and WebP images are accepted`;
    }
    if (file.size > MAX_SIZE) {
      return `${file.name}: File size must be under 10MB`;
    }
    return null;
  };

  const uploadFile = async (
    file: File,
    folder: "cover" | "gallery"
  ): Promise<string | null> => {
    const supabase = createClient();
    const timestamp = Date.now();
    const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
    const path = `venues/${venueId}/${folder}/${timestamp}-${safeName}`;

    setUploads((prev) =>
      prev.map((u) => (u.file === file.name ? { ...u, progress: 50 } : u))
    );

    const { error: uploadError } = await supabase.storage
      .from(BUCKET)
      .upload(path, file, { contentType: file.type, upsert: true });

    if (uploadError) throw new Error(uploadError.message);

    setUploads((prev) =>
      prev.map((u) => (u.file === file.name ? { ...u, progress: 100 } : u))
    );

    const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);
    return data.publicUrl;
  };

  const handleCoverUpload = useCallback(
    async (files: FileList | null) => {
      if (!files || files.length === 0) return;
      setError(null);

      const file = files[0];
      const validationError = validateFile(file);
      if (validationError) {
        setError(validationError);
        return;
      }

      setCoverUploading(true);
      setUploads([{ file: file.name, progress: 0 }]);

      try {
        const url = await uploadFile(file, "cover");
        onCoverChange(url);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Upload failed");
      } finally {
        setCoverUploading(false);
        setUploads([]);
      }
    },
    [venueId, onCoverChange]
  );

  const handleGalleryUpload = useCallback(
    async (files: FileList | null) => {
      if (!files || files.length === 0) return;
      setError(null);

      const fileArray = Array.from(files);
      const errors: string[] = [];
      for (const file of fileArray) {
        const validationError = validateFile(file);
        if (validationError) errors.push(validationError);
      }
      if (errors.length > 0) {
        setError(errors.join(". "));
        return;
      }

      setGalleryUploading(true);
      setUploads(fileArray.map((f) => ({ file: f.name, progress: 0 })));

      try {
        const urls: string[] = [];
        for (const file of fileArray) {
          const url = await uploadFile(file, "gallery");
          if (url) urls.push(url);
        }
        onGalleryChange([...galleryImages, ...urls]);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Upload failed");
      } finally {
        setGalleryUploading(false);
        setUploads([]);
      }
    },
    [venueId, galleryImages, onGalleryChange]
  );

  const removeCover = () => onCoverChange(null);
  const removeGalleryImage = (index: number) => {
    onGalleryChange(galleryImages.filter((_, i) => i !== index));
  };

  const handleDrop = (
    e: React.DragEvent,
    handler: (files: FileList | null) => void
  ) => {
    e.preventDefault();
    e.stopPropagation();
    handler(e.dataTransfer.files);
  };

  const preventDefaults = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  return (
    <div className="space-y-10">
      {error && (
        <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
          {error}
        </div>
      )}

      {/* Cover Image */}
      <div>
        <h3 className="text-lg font-semibold text-stone-900 mb-1">
          Cover Image
        </h3>
        <p className="text-sm text-stone-500 mb-4">
          This is the main photo visitors see first. Choose your best shot.
        </p>

        {coverImageUrl ? (
          <div className="relative group rounded-2xl overflow-hidden aspect-[16/9] bg-stone-100">
            <img
              src={coverImageUrl}
              alt="Cover"
              className="w-full h-full object-cover"
            />
            <button
              type="button"
              onClick={removeCover}
              className="absolute top-3 right-3 rounded-full bg-black/60 p-2 text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/80"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        ) : (
          <div
            onDrop={(e) => handleDrop(e, handleCoverUpload)}
            onDragOver={preventDefaults}
            onDragEnter={preventDefaults}
            onClick={() => coverInputRef.current?.click()}
            className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-stone-300 bg-stone-50 aspect-[16/9] cursor-pointer hover:border-stone-400 hover:bg-stone-100 transition-colors"
          >
            {coverUploading ? (
              <UploadProgressDisplay uploads={uploads} />
            ) : (
              <>
                <Upload className="h-8 w-8 text-stone-400 mb-3" />
                <p className="text-sm font-medium text-stone-600">
                  Drag & drop or click to upload
                </p>
                <p className="text-xs text-stone-400 mt-1">
                  JPEG, PNG, or WebP · Max 10MB
                </p>
              </>
            )}
          </div>
        )}
        <input
          ref={coverInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          className="hidden"
          onChange={(e) => handleCoverUpload(e.target.files)}
        />
      </div>

      {/* Gallery Images */}
      <div>
        <h3 className="text-lg font-semibold text-stone-900 mb-1">
          Gallery Images
        </h3>
        <p className="text-sm text-stone-500 mb-4">
          Add photos that showcase your venue — ceremony spots, reception areas,
          details.
        </p>

        {galleryImages.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-4">
            {galleryImages.map((url, i) => (
              <div
                key={url}
                className="relative group rounded-xl overflow-hidden aspect-square bg-stone-100"
              >
                <img
                  src={url}
                  alt={`Gallery ${i + 1}`}
                  className="w-full h-full object-cover"
                />
                <button
                  type="button"
                  onClick={() => removeGalleryImage(i)}
                  className="absolute top-2 right-2 rounded-full bg-black/60 p-1.5 text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/80"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
            ))}
          </div>
        )}

        <div
          onDrop={(e) => handleDrop(e, handleGalleryUpload)}
          onDragOver={preventDefaults}
          onDragEnter={preventDefaults}
          onClick={() => galleryInputRef.current?.click()}
          className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-stone-300 bg-stone-50 py-12 cursor-pointer hover:border-stone-400 hover:bg-stone-100 transition-colors"
        >
          {galleryUploading ? (
            <UploadProgressDisplay uploads={uploads} />
          ) : (
            <>
              <ImageIcon className="h-8 w-8 text-stone-400 mb-3" />
              <p className="text-sm font-medium text-stone-600">
                Drag & drop or click to add gallery photos
              </p>
              <p className="text-xs text-stone-400 mt-1">
                JPEG, PNG, or WebP · Max 10MB each
              </p>
            </>
          )}
        </div>
        <input
          ref={galleryInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          multiple
          className="hidden"
          onChange={(e) => handleGalleryUpload(e.target.files)}
        />
      </div>
    </div>
  );
}

function UploadProgressDisplay({ uploads }: { uploads: UploadProgress[] }) {
  return (
    <div className="w-full max-w-xs space-y-3 px-6">
      {uploads.map((u) => (
        <div key={u.file}>
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs text-stone-600 truncate max-w-[180px]">
              {u.file}
            </span>
            <span className="text-xs text-stone-500">{u.progress}%</span>
          </div>
          <div className="h-1.5 w-full rounded-full bg-stone-200 overflow-hidden">
            <div
              className="h-full rounded-full bg-stone-900 transition-all duration-300"
              style={{ width: `${u.progress}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
