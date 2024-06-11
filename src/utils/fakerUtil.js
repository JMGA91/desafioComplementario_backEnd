import { fakerEN_US } from "@faker-js/faker";

export const generateProduct = () => {
  return {
    id: fakerEN_US.string.uuid(),
    title: fakerEN_US.commerce.productName(),
    description: fakerEN_US.commerce.productDescription(),
    code: fakerEN_US.string.alphanumeric(6),
    price: fakerEN_US.commerce.price(),
    status: fakerEN_US.datatype.boolean(0.5),
    stock: fakerEN_US.number.int({ min: 0, max: 100 }),
    category: fakerEN_US.commerce.productAdjective(),
    thumbnail: fakerEN_US.image.url({ height: 100, width: 100 }),
  };
};

export const generateProducts = (num = 50) => {
  const products = [];
  for (let i = 0; i < num; i++) {
    products.push(generateProduct());
  }
  return products;
};