const express = require('express');
const router = express.Router();
const Settings = require('../models/settings');
const { protect } = require('../middleware/auth');

// Get user settings
router.get('/', protect, async (req, res) => {
  try {
    let settings = await Settings.findOne({ userId: req.user._id });
    
    // If no settings exist, create default settings
    if (!settings) {
      settings = new Settings({ userId: req.user._id });
      await settings.save();
    }
    
    res.json(settings);
  } catch (error) {
    console.error('Error fetching settings:', error);
    res.status(500).json({ message: 'Error fetching settings' });
  }
});

// Update settings
router.put('/', protect, async (req, res) => {
  try {
    const allowedFields = [
      'notifications',
      'privacy',
      'appearance',
      'accessibility',
      'language',
      'security'
    ];

    // Filter out any fields that aren't in allowedFields
    const updateData = Object.keys(req.body)
      .filter(key => allowedFields.includes(key))
      .reduce((obj, key) => {
        obj[key] = req.body[key];
        return obj;
      }, {});

    const settings = await Settings.findOneAndUpdate(
      { userId: req.user._id },
      { $set: updateData },
      { new: true, upsert: true, runValidators: true }
    );

    res.json(settings);
  } catch (error) {
    console.error('Error updating settings:', error);
    res.status(500).json({ message: 'Error updating settings' });
  }
});

// Reset settings to default
router.post('/reset', protect, async (req, res) => {
  try {
    await Settings.findOneAndDelete({ userId: req.user._id });
    const settings = new Settings({ userId: req.user._id });
    await settings.save();
    res.json(settings);
  } catch (error) {
    console.error('Error resetting settings:', error);
    res.status(500).json({ message: 'Error resetting settings' });
  }
});

module.exports = router;
