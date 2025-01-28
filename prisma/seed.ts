import { PrismaClient } from "@prisma/client";
import { dataProducts } from "./data/products";

const prisma = new PrismaClient();

async function main() {
  for (const categoryData of dataProducts) {
    const category = await prisma.category.upsert({
      where: { name: categoryData.name },
      update: {},
      create: {
        name: categoryData.name,
        imageUrl: categoryData.imageURL,
      },
    });

    for (const productData of categoryData.products) {
      await prisma.product.upsert({
        where: { slug: productData.slug },
        update: {},
        create: {
          ...productData,
          category: {
            connect: {
              id: category.id,
            },
          },
        },
      });
    }
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
