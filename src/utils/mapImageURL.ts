export const mapImageURL = <T extends { image: string }>(items: T[], baseUrl: string): T[] =>
  items.map((item) => ({
    ...item,
    image: `${baseUrl}${item.image}`,
  }));
