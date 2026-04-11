import { Setting } from "../model/index.js";

export const createSetting = async (req, res) => {
  try {
    const setting = await Setting.create(req.body);
    return res.status(201).json(setting);
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

export const getSettings = async (req, res) => {
  try {
    const settings = await Setting.findAll({ order: [["id", "DESC"]] });
    return res.json(settings);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const getSettingById = async (req, res) => {
  try {
    const setting = await Setting.findByPk(req.params.id);

    if (!setting) {
      return res.status(404).json({ message: "Setting not found" });
    }

    return res.json(setting);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const updateSetting = async (req, res) => {
  try {
    const setting = await Setting.findByPk(req.params.id);

    if (!setting) {
      return res.status(404).json({ message: "Setting not found" });
    }

    await setting.update(req.body);
    return res.json(setting);
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

export const deleteSetting = async (req, res) => {
  try {
    const setting = await Setting.findByPk(req.params.id);

    if (!setting) {
      return res.status(404).json({ message: "Setting not found" });
    }

    await setting.destroy();
    return res.json({ message: "Setting deleted" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
