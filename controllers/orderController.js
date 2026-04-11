import { Order, User, OrderItem, Product } from "../model/index.js";

export const createOrder = async (req, res) => {
  try {
    const order = await Order.create(req.body);
    return res.status(201).json(order);
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

export const getOrders = async (req, res) => {
  try {
    const orders = await Order.findAll({
      include: [
        { model: User, as: "user", attributes: { exclude: ["password"] } },
        {
          model: OrderItem,
          as: "items",
          include: [{ model: Product, as: "product" }],
        },
      ],
      order: [["id", "DESC"]],
    });

    return res.json(orders);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const getOrderById = async (req, res) => {
  try {
    const order = await Order.findByPk(req.params.id, {
      include: [
        { model: User, as: "user", attributes: { exclude: ["password"] } },
        {
          model: OrderItem,
          as: "items",
          include: [{ model: Product, as: "product" }],
        },
      ],
    });

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    return res.json(order);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const updateOrder = async (req, res) => {
  try {
    const order = await Order.findByPk(req.params.id);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    await order.update(req.body);
    return res.json(order);
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

export const deleteOrder = async (req, res) => {
  try {
    const order = await Order.findByPk(req.params.id);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    await order.destroy();
    return res.json({ message: "Order deleted" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
