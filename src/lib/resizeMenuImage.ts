import { ImageManipulator, SaveFormat } from "expo-image-manipulator";

import { sizing } from "@/theme";
import type { MenuPage } from "@/types";

export async function resizeMenuImage(page: MenuPage): Promise<string> {
  const context = ImageManipulator.manipulate(page.uri);
  try {
    if (Math.max(page.width, page.height) > sizing.imageLongEdge) {
      context.resize(
        page.width >= page.height
          ? { width: sizing.imageLongEdge }
          : { height: sizing.imageLongEdge },
      );
    }
    const image = await context.renderAsync();
    try {
      const saved = await image.saveAsync({ format: SaveFormat.JPEG, compress: 0.85 });
      return saved.uri;
    } finally {
      image.release();
    }
  } finally {
    context.release();
  }
}
