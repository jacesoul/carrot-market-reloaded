import ListProduct from "@/components/list-product";
import prisma from "@/lib/db";

async function getProducts() {
  const products = await prisma.product.findMany({
    select: {
      id: true,
      title: true,
      price: true,
      created_at: true,
      photo: true,
    },
  });

  return products;
}

export default async function Products() {
  const products = await getProducts();

  console.log(products);

  return (
    <div className="p-5 flex flex-col gap-5">
      {products.map((product) => (
        <ListProduct key={product.id} {...product} />
      ))}
    </div>
  );
}
