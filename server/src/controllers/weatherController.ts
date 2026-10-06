import { Request, Response } from 'express';
import { Weather } from '../models/Weather';

// @desc    Get weather data by district (or default to Ahmedabad)
// @route   GET /api/weather
export const getWeather = async (req: Request, res: Response): Promise<void> => {
  try {
    const districtQuery = (req.query.district as string) || 'Ahmedabad';

    let weather = await Weather.findOne({
      district: { $regex: new RegExp(`^${districtQuery}$`, 'i') },
    });

    if (!weather) {
      // Fallback to any weather record
      weather = await Weather.findOne();
    }

    if (!weather) {
      // Generate default if DB hasn't been seeded yet
      weather = await Weather.create({
        district: 'Ahmedabad',
        state: 'Gujarat',
        temperature: 31,
        condition: 'Sunny',
        conditionIcon: '☀️',
        humidity: 62,
        windSpeed: 14,
        rainProbability: 20,
        uvIndex: 7,
        sunrise: '06:18 AM',
        sunset: '06:45 PM',
        forecast: [
          { day: 'Mon', date: 'Oct 06', tempMax: 31, tempMin: 22, condition: 'Sunny', icon: '☀️', rainProb: 10 },
          { day: 'Tue', date: 'Oct 07', tempMax: 28, tempMin: 20, condition: 'Rain Showers', icon: '🌧️', rainProb: 75 },
          { day: 'Wed', date: 'Oct 08', tempMax: 30, tempMin: 21, condition: 'Sunny', icon: '☀️', rainProb: 15 },
          { day: 'Thu', date: 'Oct 09', tempMax: 29, tempMin: 21, condition: 'Partly Cloudy', icon: '☁️', rainProb: 30 },
          { day: 'Fri', date: 'Oct 10', tempMax: 32, tempMin: 23, condition: 'Clear', icon: '☀️', rainProb: 5 },
          { day: 'Sat', date: 'Oct 11', tempMax: 27, tempMin: 20, condition: 'Light Rain', icon: '🌧️', rainProb: 60 },
          { day: 'Sun', date: 'Oct 12', tempMax: 30, tempMin: 22, condition: 'Sunny', icon: '☀️', rainProb: 10 },
        ],
        alerts: [
          {
            type: 'warning',
            title: '⚠️ Heavy Rain Alert',
            description: 'Scattered moderate-to-heavy showers predicted for Tuesday afternoon. Secure harvested crops and check field drainage.',
            validUntil: 'Tomorrow, 08:00 PM',
          },
          {
            type: 'info',
            title: '☀️ Favorable Spraying Window',
            description: 'Wind speeds below 15 km/h on Monday morning make it optimal for scheduled foliar fertilization.',
            validUntil: 'Today, 11:30 AM',
          },
        ],
      });
    }

    res.json({ success: true, data: weather });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
