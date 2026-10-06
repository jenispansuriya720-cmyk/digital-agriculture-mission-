import mongoose, { Document, Schema } from 'mongoose';

export interface IWeather extends Document {
  district: string;
  state: string;
  temperature: number; // Celsius
  condition: string; // Sunny, Cloudy, Rainy, etc.
  conditionIcon: string;
  humidity: number; // %
  windSpeed: number; // km/h
  rainProbability: number; // %
  uvIndex: number;
  sunrise: string;
  sunset: string;
  forecast: Array<{
    day: string;
    date: string;
    tempMax: number;
    tempMin: number;
    condition: string;
    icon: string;
    rainProb: number;
  }>;
  alerts: Array<{
    type: 'warning' | 'info' | 'danger';
    title: string;
    description: string;
    validUntil: string;
  }>;
  updatedAt: Date;
}

const WeatherSchema = new Schema<IWeather>(
  {
    district: { type: String, required: true, unique: true },
    state: { type: String, required: true, default: 'Gujarat' },
    temperature: { type: Number, required: true, default: 31 },
    condition: { type: String, required: true, default: 'Sunny' },
    conditionIcon: { type: String, default: '☀️' },
    humidity: { type: Number, required: true, default: 62 },
    windSpeed: { type: Number, required: true, default: 14 },
    rainProbability: { type: Number, required: true, default: 20 },
    uvIndex: { type: Number, default: 7 },
    sunrise: { type: String, default: '06:18 AM' },
    sunset: { type: String, default: '06:45 PM' },
    forecast: [
      {
        day: String,
        date: String,
        tempMax: Number,
        tempMin: Number,
        condition: String,
        icon: String,
        rainProb: Number,
      },
    ],
    alerts: [
      {
        type: { type: String, enum: ['warning', 'info', 'danger'], default: 'info' },
        title: String,
        description: String,
        validUntil: String,
      },
    ],
  },
  { timestamps: true }
);

export const Weather = mongoose.model<IWeather>('Weather', WeatherSchema);
