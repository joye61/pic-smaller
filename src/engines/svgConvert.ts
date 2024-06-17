import { homeState } from "@/states/home";
import { ProcessOutput } from "./ImageBase";
import { AvifImage } from "./AvifImage";
import { Mimes } from "@/mimes";

/**
 * Convert SVG type to other, SVG convert can't do in worker
 * @param input SVG compress result in worker
 * @returns
 */
export async function svgConvert(input: ProcessOutput): Promise<ProcessOutput> {
  if (!homeState.option.format.target) {
    return input;
  }
  const target = homeState.option.format.target.toLowerCase();
  const canvas = document.createElement("canvas");
  canvas.width = input.width;
  canvas.height = input.height;
  const context = canvas.getContext("2d")!;
  if (["jpg", "jpeg"].includes(target)) {
    context.fillStyle = homeState.option.format.transparentFill;
    context.fillRect(0, 0, input.width, input.height);
  }
  const svg = await new Promise<HTMLImageElement>((resolve) => {
    const img = new Image();
    img.src = input.src;
    img.onload = () => resolve(img);
  });
  context.drawImage(
    svg,
    0,
    0,
    input.width,
    input.height,
    0,
    0,
    input.width,
    input.height,
  );

  // Convert svg to target type
  let blob: Blob;
  if (target === "avif") {
    blob = await AvifImage.encode(
      context,
      input.width,
      input.height,
      homeState.option.avif.quality,
      homeState.option.avif.speed,
    );
  } else {
    blob = await new Promise<Blob>((resolve) => {
      canvas.toBlob(
        (result) => {
          resolve(result!);
        },
        Mimes[target],
        1,
      );
    });
  }
  input.blob = blob;
  input.src = URL.createObjectURL(blob);
  return input;
}
