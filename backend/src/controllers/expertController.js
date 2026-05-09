const Expert = require('../models/Expert');

const getExperts = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 6;
    const skip = (page - 1) * limit;
    const filter = {};

    if (req.query.search) {
      filter.name = { $regex: req.query.search, $options: 'i' };
    }
    if (req.query.category && req.query.category !== 'All') {
      filter.category = req.query.category;
    }

    const [experts, total] = await Promise.all([
      Expert.find(filter).select('name category experience rating avatar bio').skip(skip).limit(limit).sort({ rating: -1 }),
      Expert.countDocuments(filter),
    ]);

    res.json({ success: true, data: experts, pagination: { page, limit, total, pages: Math.ceil(total / limit) } });
  } catch (error) {
    next(error);
  }
};

const getExpertById = async (req, res, next) => {
  try {
    const expert = await Expert.findById(req.params.id);
    if (!expert) {
      const error = new Error('Expert not found');
      error.statusCode = 404;
      throw error;
    }
    res.json({ success: true, data: expert });
  } catch (error) {
    next(error);
  }
};

module.exports = { getExperts, getExpertById };
