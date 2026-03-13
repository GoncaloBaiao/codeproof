import fs from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const ROOT = process.cwd();
const SOURCE = path.join(ROOT, "src", "app", "apple-icon.png");
const OUT_DIR = path.join(ROOT, "public");
const OUT_FILE = path.join(OUT_DIR, "favicon.ico");
const SIZES = [16, 32, 48];

function createIcoFromPngBuffers(images) {
  const count = images.length;
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0); // reserved
  header.writeUInt16LE(1, 2); // type: icon
  header.writeUInt16LE(count, 4); // image count

  const directory = Buffer.alloc(count * 16);
  let offset = header.length + directory.length;

  for (let i = 0; i < count; i += 1) {
    const { size, buffer } = images[i];
    const entryOffset = i * 16;

    directory.writeUInt8(size >= 256 ? 0 : size, entryOffset + 0); // width
    directory.writeUInt8(size >= 256 ? 0 : size, entryOffset + 1); // height
    directory.writeUInt8(0, entryOffset + 2); // color count
    directory.writeUInt8(0, entryOffset + 3); // reserved
    directory.writeUInt16LE(1, entryOffset + 4); // color planes
    directory.writeUInt16LE(32, entryOffset + 6); // bits per pixel
    directory.writeUInt32LE(buffer.length, entryOffset + 8); // image size
    directory.writeUInt32LE(offset, entryOffset + 12); // image offset

    offset += buffer.length;
  }

  return Buffer.concat([header, directory, ...images.map((img) => img.buffer)]);
}

async function main() {
  try {
    await fs.access(SOURCE);
  } catch {
    throw new Error(`Source image not found: ${SOURCE}`);
  }

  const pngBuffers = await Promise.all(
    SIZES.map(async (size) => {
      const buffer = await sharp(SOURCE)
        .resize(size, size, { fit: "cover" })
        .png()
        .toBuffer();

      return { size, buffer };
    }),
  );

  const icoBuffer = createIcoFromPngBuffers(pngBuffers);
  await fs.mkdir(OUT_DIR, { recursive: true });
  await fs.writeFile(OUT_FILE, icoBuffer);

  console.log(`Generated ${OUT_FILE} with sizes: ${SIZES.join(", ")}`);
}

main().catch((error) => {
  console.error("Failed to generate favicon:", error);
  process.exit(1);
});
