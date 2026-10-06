export interface User {
  _id: string;
  name: string;
  email: string;
  mobile: string;
  role: 'farmer' | 'admin' | 'expert';
  state: string;
  district: string;
  village: string;
  landArea: number;
  primaryCrop: string;
  avatar?: string;
  isBlocked?: boolean;
  token?: string;
  createdAt?: string;
}

export interface Farm {
  _id: string;
  userId: string;
  farmName: string;
  location: string;
  state: string;
  district: string;
  village: string;
  area: number;
  soilType: string;
  irrigationType: string;
  waterSource: string;
  latitude: number;
  longitude: number;
  sensorsCount: number;
  activeStatus: boolean;
  crops?: Crop[];
  createdAt: string;
}

export type GrowthStage = 'Planting' | 'Germination' | 'Vegetative' | 'Flowering' | 'Fruiting' | 'Harvest';

export interface Crop {
  _id: string;
  userId: string;
  farmId: string | { _id: string; farmName: string; location: string };
  cropName: string;
  variety: string;
  plantingDate: string;
  expectedHarvest: string;
  growthStage: GrowthStage;
  healthScore: number;
  area: number;
  irrigationRequirement: string;
  fertilizerSchedule: Array<{
    stage: string;
    date: string;
    details: string;
    completed: boolean;
  }>;
  notes?: string;
  icon?: string;
  createdAt: string;
}

export interface SoilReport {
  _id: string;
  userId: string;
  farmId: string | { _id: string; farmName: string };
  reportDate: string;
  overallScore: number;
  rating: 'Poor' | 'Moderate' | 'Good' | 'Excellent';
  pH: number;
  nitrogen: number;
  phosphorus: number;
  potassium: number;
  moisture: number;
  organicCarbon: number;
  electricalConductivity: number;
  recommendations: string[];
  reportPdfUrl?: string;
  createdAt: string;
}

export interface WeatherData {
  district: string;
  state: string;
  temperature: number;
  condition: string;
  conditionIcon: string;
  humidity: number;
  windSpeed: number;
  rainProbability: number;
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
  updatedAt: string;
}

export interface MarketPrice {
  _id: string;
  crop: string;
  variety: string;
  market: string;
  district: string;
  state: string;
  minPrice: number;
  maxPrice: number;
  modalPrice: number;
  changePercent: number;
  trend: 'up' | 'down' | 'stable';
  date: string;
  priceHistory: Array<{
    date: string;
    modalPrice: number;
  }>;
}

export interface Product {
  _id: string;
  name: string;
  category: string;
  brand: string;
  price: number;
  originalPrice: number;
  discountPercentage: number;
  rating: number;
  reviewsCount: number;
  image: string;
  inStock: boolean;
  stockQuantity: number;
  unit: string;
  description: string;
  isFeatured?: boolean;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Order {
  _id: string;
  orderId: string;
  userId: string | { _id: string; name: string; email: string; mobile: string };
  items: Array<{
    productId: string;
    name: string;
    price: number;
    quantity: number;
    image: string;
    unit: string;
  }>;
  subtotal: number;
  deliveryFee: number;
  totalAmount: number;
  paymentMethod: string;
  paymentStatus: 'Pending' | 'Paid' | 'Failed';
  orderStatus: 'Pending' | 'Confirmed' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';
  shippingAddress: {
    fullName: string;
    phone: string;
    village: string;
    district: string;
    state: string;
    pincode: string;
    landmark?: string;
  };
  trackingUpdates: Array<{
    status: string;
    timestamp: string;
    description: string;
  }>;
  createdAt: string;
}

export interface Scheme {
  _id: string;
  title: string;
  category: 'Financial Support' | 'Crop Insurance' | 'Equipment Subsidy' | 'Irrigation' | 'Soil Health' | 'Organic Farming';
  description: string;
  eligibility: string[];
  benefits: string;
  documents: string[];
  deadline: string;
  applicationLink: string;
  applicableStates: string[];
  minLandArea?: number;
  maxLandArea?: number;
  featured: boolean;
}

export interface Expert {
  _id: string;
  name: string;
  title: string;
  specialization: string;
  rating: number;
  reviewsCount: number;
  experienceYears: number;
  qualification: string;
  avatar: string;
  languages: string[];
  isAvailable: boolean;
  consultationsDone: number;
  bio: string;
}

export interface Consultation {
  _id: string;
  userId: string | { _id: string; name: string; village: string };
  expertId?: string | Expert;
  problemTitle: string;
  category: 'Crop' | 'Soil' | 'Pest' | 'Irrigation' | 'Fertilizer';
  crop: string;
  description: string;
  imageUrl?: string;
  status: 'Pending' | 'In Progress' | 'Answered' | 'Closed';
  expertReply?: {
    expertName: string;
    advice: string;
    suggestedTreatment?: string;
    repliedAt: string;
  };
  createdAt: string;
}

export interface Article {
  _id: string;
  title: string;
  slug: string;
  category: string;
  author: string;
  authorTitle: string;
  summary: string;
  content: string;
  readTime: string;
  viewsCount: number;
  featured: boolean;
  image: string;
  tags: string[];
  createdAt: string;
}

export interface NotificationItem {
  _id: string;
  userId: string;
  title: string;
  message: string;
  type: 'weather' | 'market' | 'crop' | 'irrigation' | 'scheme' | 'order' | 'expert' | 'system';
  isRead: boolean;
  link?: string;
  createdAt: string;
}

export interface IrrigationData {
  _id: string;
  userId: string;
  farmId: string;
  farmName: string;
  zoneName: string;
  soilMoisture: number;
  requiredMoisture: number;
  status: 'Normal' | 'Irrigation Required' | 'Irrigating' | 'Completed';
  waterAmountLitres: number;
  scheduledTime: string;
  sensors: {
    soilMoisture: number;
    temperature: number;
    humidity: number;
    waterTankLevel: number;
    flowRate: number;
  };
  historyData: Array<{
    time: string;
    moisture: number;
  }>;
}

export interface DiseaseReport {
  _id: string;
  cropName: string;
  diseaseName: string;
  scientificName?: string;
  severity: 'Low' | 'Medium' | 'High' | 'Critical';
  confidence: number;
  imageUrl: string;
  symptoms: string[];
  recommendations: string[];
  chemicalControl?: string[];
  organicControl?: string[];
  isDemo: boolean;
  createdAt: string;
}
