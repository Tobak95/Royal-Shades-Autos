import { useState } from "react";
import { useFieldArray, type Control, type FieldErrors } from "react-hook-form";
import { ArrowUpToLine, ImagePlus, X } from "lucide-react";
import { CarImage } from "@/components/car/CarImage";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { cn } from "@/lib/utils";
import type { CarFormValues } from "./carFormSchema";

interface ImageUrlsFieldProps {
  control: Control<CarFormValues>;
  errors: FieldErrors<CarFormValues>["images"];
}

const VALID_URL = /^(https?:\/\/\S+|\/\S+)$/;

/**
 * Photos as a list of URLs with previews. The first photo is the main one.
 * (Uploads go to Cloudinary through the backend later; for now paste a URL or a /cars/ path.)
 */
export function ImageUrlsField({ control, errors }: ImageUrlsFieldProps) {
  const { fields, append, remove, move } = useFieldArray({ control, name: "images" });
  const [draft, setDraft] = useState("");
  const [draftError, setDraftError] = useState<string>();

  function add() {
    const url = draft.trim();
    if (!VALID_URL.test(url)) {
      setDraftError("Use a full image URL (https://…) or a path like /cars/photo.jpg");
      return;
    }
    if (fields.some((f) => f.url === url)) {
      setDraftError("That photo is already in the list");
      return;
    }
    append({ url });
    setDraft("");
    setDraftError(undefined);
  }

  const listError = errors?.message ?? errors?.root?.message;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-start gap-3">
        <Input
          label="Photo URL"
          containerClassName="min-w-0 flex-[1_1_280px]"
          placeholder="https://… or /cars/photo.jpg"
          value={draft}
          error={draftError}
          hint="The first photo is the main one on cards and the car page."
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              add();
            }
          }}
        />
        <Button type="button" variant="outline" onClick={add} className="mt-[26px]">
          <ImagePlus aria-hidden="true" className="size-4" /> Add photo
        </Button>
      </div>

      {fields.length > 0 ? (
        <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {fields.map((field, index) => (
            <li
              key={field.id}
              className={cn("overflow-hidden rounded-card border bg-surface", index === 0 ? "border-gold" : "border-line")}
            >
              <CarImage src={field.url} alt={`Photo ${index + 1}`} className="aspect-[4/3]" />
              <div className="flex items-center gap-1 p-1.5">
                <span className={cn("flex-1 truncate px-1.5 text-xs", index === 0 ? "font-bold text-gold-text" : "text-muted")}>
                  {index === 0 ? "Main photo" : `Photo ${index + 1}`}
                </span>
                {index > 0 && (
                  <button
                    type="button"
                    onClick={() => move(index, 0)}
                    aria-label={`Make photo ${index + 1} the main photo`}
                    className="flex size-11 items-center justify-center rounded-control text-muted hover:bg-navy/5 hover:text-ink"
                  >
                    <ArrowUpToLine aria-hidden="true" className="size-4" />
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => remove(index)}
                  aria-label={`Remove photo ${index + 1}`}
                  className="flex size-11 items-center justify-center rounded-control text-muted hover:bg-sold-tint hover:text-sold"
                >
                  <X aria-hidden="true" className="size-4" />
                </button>
              </div>
              {errors?.[index]?.url && (
                <p role="alert" className="px-3 pb-2 text-xs font-medium text-sold">
                  {errors[index]?.url?.message}
                </p>
              )}
            </li>
          ))}
        </ul>
      ) : (
        <p className="rounded-card border border-dashed border-line-strong px-4 py-8 text-center text-sm text-muted">No photos yet.</p>
      )}
      {listError && (
        <p role="alert" className="text-xs font-medium text-sold">
          {listError}
        </p>
      )}
    </div>
  );
}
