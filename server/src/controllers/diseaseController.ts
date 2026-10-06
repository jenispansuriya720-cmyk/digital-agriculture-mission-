import { Response } from 'express';
import { DiseaseReport } from '../models/DiseaseReport';
import { AuthRequest } from '../middleware/auth';

// Realistic agronomy disease database for demonstration
const mockDiseases = [
  {
    cropName: 'Cotton',
    diseaseName: 'Cercospora Leaf Spot',
    scientificName: 'Cercospora gossypina',
    severity: 'Medium' as const,
    confidence: 89,
    symptoms: [
      'Small, circular brown spots with purplish-red borders on mature leaves',
      'Premature defoliation in lower canopy',
      'Reduced boll development if left untreated',
    ],
    recommendations: [
      'Remove and safely dispose of severely infected lower leaves.',
      'Improve intra-row ventilation and avoid overhead sprinkler wetting.',
      'Monitor crop regularly for symptom progression every 48 hours.',
      'Ensure balanced potassium fertilization to bolster natural disease resistance.',
    ],
    chemicalControl: [
      'Spray Mancozeb 75% WP @ 2.5 g/L water or Copper Oxychloride 50% WP @ 3.0 g/L water.',
      'In severe cases, spray Propiconazole 25% EC @ 1 ml/L water.',
    ],
    organicControl: [
      'Foliar spray of 5% Neem Seed Kernel Extract (NSKE).',
      'Application of Trichoderma viride bio-fungicide @ 5 g/L in root zone.',
    ],
  },
  {
    cropName: 'Wheat',
    diseaseName: 'Yellow Rust / Stripe Rust',
    scientificName: 'Puccinia striiformis',
    severity: 'High' as const,
    confidence: 94,
    symptoms: [
      'Bright yellow powdery pustules arranged in linear stripes along leaf veins',
      'Yellow dust rubs off easily on fingers or cloth',
      'Shriveled grains and reduced photosynthetic capacity',
    ],
    recommendations: [
      'Immediately isolate affected field patches.',
      'Avoid high-dose nitrogen top dressing which accelerates fungal spread.',
      'Follow recommended fungicide protocol immediately upon morning dew evaporation.',
    ],
    chemicalControl: [
      'Spray Tebuconazole 25.9% EC @ 1 ml/L or Propiconazole 25% EC @ 1 ml/L water.',
    ],
    organicControl: [
      'Sour buttermilk (Chhach) fermented solution @ 50 ml/L.',
      'Bio-control using Pseudomonas fluorescens foliar spray.',
    ],
  },
  {
    cropName: 'Tomato',
    diseaseName: 'Early Blight',
    scientificName: 'Alternaria solani',
    severity: 'Medium' as const,
    confidence: 91,
    symptoms: [
      'Concentric target-board ring patterns on older foliage',
      'Yellow chlorotic halos around lesions',
      'Stem collar rot near soil surface',
    ],
    recommendations: [
      'Prune bottom 12 inches of foliage to prevent soil splash.',
      'Stake plants to ensure proper airflow and dry leaves faster.',
      'Mulch soil surface with clean straw or plastic mulch.',
    ],
    chemicalControl: [
      'Spray Chlorothalonil 75% WP @ 2 g/L or Azoxystrobin 23% SC @ 1 ml/L.',
    ],
    organicControl: [
      'Copper hydroxide organic spray.',
      'Bacillus subtilis bio-fungicide drench.',
    ],
  },
];

// @desc    Analyze crop disease with Demo AI interface
// @route   POST /api/disease/analyze
export const analyzeCropDisease = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Not authorized' });
      return;
    }

    const { cropName, imageUrl } = req.body;

    // Pick disease based on crop or random mock
    const crop = cropName || req.user.primaryCrop || 'Cotton';
    const found = mockDiseases.find(d => d.cropName.toLowerCase() === crop.toLowerCase()) || mockDiseases[0];

    const report = await DiseaseReport.create({
      userId: req.user._id,
      cropName: found.cropName,
      diseaseName: found.diseaseName,
      scientificName: found.scientificName,
      severity: found.severity,
      confidence: found.confidence,
      imageUrl: imageUrl || 'https://images.unsplash.com/photo-1599818816949-a29d5b4e7d69?auto=format&fit=crop&q=80&w=400',
      symptoms: found.symptoms,
      recommendations: found.recommendations,
      chemicalControl: found.chemicalControl,
      organicControl: found.organicControl,
      isDemo: true, // Clearly explicitly marked
    });

    res.status(201).json({
      success: true,
      message: 'Demo AI analysis completed successfully',
      data: report,
      disclaimer: 'Demo AI Analysis: This diagnostic result is an AI simulation for demonstration and educational purposes.',
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get user disease detection history
// @route   GET /api/disease/history
export const getMyDiseaseHistory = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    let query: any = {};
    if (req.user?.role !== 'admin' || req.query.self === 'true') {
      query.userId = req.user?._id;
    }

    const reports = await DiseaseReport.find(query).sort({ createdAt: -1 });
    res.json({ success: true, count: reports.length, data: reports });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
