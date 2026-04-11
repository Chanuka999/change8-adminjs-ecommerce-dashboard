import User from "./user.js";
import Category from "./category.js";
import Product from "./product.js";
import Order from "./order.js";
import OrderItem from "./orderItem.js";
import Setting from "./setting.js";

Category.hasMany(Product, {
  foreignKey: "categoryId",
  as: "products",
});
Product.belongsTo(Category, {
  foreignKey: "categoryId",
  as: "category",
});

User.hasMany(Order, {
  foreignKey: "userId",
  as: "orders",
});
Order.belongsTo(User, {
  foreignKey: "userId",
  as: "user",
});

Order.hasMany(OrderItem, {
  foreignKey: "orderId",
  as: "items",
  onDelete: "CASCADE",
});
OrderItem.belongsTo(Order, {
  foreignKey: "orderId",
  as: "order",
});

Product.hasMany(OrderItem, {
  foreignKey: "productId",
  as: "orderItems",
});
OrderItem.belongsTo(Product, {
  foreignKey: "productId",
  as: "product",
});

export { User, Category, Product, Order, OrderItem, Setting };
