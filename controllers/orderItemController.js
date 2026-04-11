import { OrderItem, Order, Product } from "../model/index.js";

export const createOrderItem = async (req, res) => {
  try {
    const orderItem = await OrderItem.create(req.body);
    return res.status(201).json(orderItem);
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

export const getOrderItems = async (req, res) => {
  try {
    const orderItems = await OrderItem.findAll({
      include: [
        { model: Order, as: "order" },
        { model: Product, as: "product" },
      ],
      order: [["id", "DESC"]],
    });

    return res.json(orderItems);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const getOrderItemById = async (req, res) => {
  try {
    const orderItem = await OrderItem.findByPk(req.params.id, {
      include: [
        { model: Order, as: "order" },
        { model: Product, as: "product" },
      ],
    });

    if (!orderItem) {
      return res.status(404).json({ message: "Order item not found" });
    }

    return res.json(orderItem);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const updateOrderItem = async (req, res) => {
  try {
    const orderItem = await OrderItem.findByPk(req.params.id);

    if (!orderItem) {
      return res.status(404).json({ message: "Order item not found" });
    }

    await orderItem.update(req.body);
    return res.json(orderItem);
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

export const deleteOrderItem = async (req, res) => {
  try {
    const orderItem = await OrderItem.findByPk(req.params.id);

    if (!orderItem) {
      return res.status(404).json({ message: "Order item not found" });
    }

    await orderItem.destroy();
    return res.json({ message: "Order item deleted" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
