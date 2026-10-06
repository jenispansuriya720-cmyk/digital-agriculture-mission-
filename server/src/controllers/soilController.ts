import { Response } from 'express';
import { SoilReport } from '../models/SoilReport';
import { Farm } from '../models/Farm';
import { AuthRequest } from '../middleware/auth';

// @desc    Get latest soil health report
// @route   GET /api/soil
export const getSoilReports = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    let query: any = {};
    if (req.user?.role !== 'admin' || req.query.self === 'true') {
      query.userId = req.user?._id;
    }

    if (req.query.farmId) {
      query.farmId = req.query.farmId;
    }

    const reports = await SoilReport.find(query).populate('farmId', 'farmName location').sort({ reportDate: -1 });

    if (reports.length === 0) {
      // Create a default soil report for the user's farm if none exists
      let farm = await Farm.findOne({ userId: req.user?._id });
      if (!farm && req.user) {
        farm = await Farm.create({
          userId: req.user._id,
          farmName: `${req.user.name}'s Farm`,
          location: `${req.user.village}, ${req.user.district}`,
          village: req.user.village,
          district: req.user.district,
          state: req.user.state,
          area: 5,
        });
      }

      if (farm && req.user) {
        const defaultReport = await SoilReport.create({
          userId: req.user._id,
          farmId: farm._id,
          overallScore: 82,
          rating: 'Excellent',
          pH: 6.8,
          nitrogen: 280,
          phosphorus: 42,
          potassium: 310,
          moisture: 68,
          organicCarbon: 0.75,
          electricalConductivity: 0.45,
          recommendations: [
            'Maintain current organic compost application (4-5 tonnes/acre).',
            'Phosphorus levels are in optimal range; avoid unnecessary DAP overdose.',
            'Incorporate green manuring (Sunhemp/Dhaincha) before next Kharif rotation.',
            'Soil moisture retention is high; check drip lines for uniform distribution.',
          ],
        });
        res.json({ success: true, count: 1, data: [defaultReport] });
        return;
      }
    }

    res.json({ success: true, count: reports.length, data: reports });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Upload / create new soil report
// @route   POST /api/soil
export const createSoilReport = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Not authorized' });
      return;
    }

    const {
      farmId,
      pH,
      nitrogen,
      phosphorus,
      potassium,
      moisture,
      organicCarbon,
      electricalConductivity,
    } = req.body;

    let targetFarmId = farmId;
    if (!targetFarmId) {
      const farm = await Farm.findOne({ userId: req.user._id });
      if (farm) targetFarmId = farm._id;
    }

    // Calculate score & rating dynamically
    const phVal = Number(pH) || 6.8;
    const nVal = Number(nitrogen) || 280;
    const pVal = Number(phosphorus) || 40;
    const kVal = Number(potassium) || 300;
    const mVal = Number(moisture) || 65;
    const ocVal = Number(organicCarbon) || 0.7;

    let score = 80;
    if (phVal >= 6.5 && phVal <= 7.5) score += 5;
    if (ocVal >= 0.7) score += 5;
    if (nVal >= 250 && nVal <= 350) score += 5;

    let rating: 'Poor' | 'Moderate' | 'Good' | 'Excellent' = 'Good';
    if (score >= 80) rating = 'Excellent';
    else if (score >= 65) rating = 'Good';
    else if (score >= 50) rating = 'Moderate';
    else rating = 'Poor';

    const generatedRecs: string[] = [];
    if (phVal < 6.5) generatedRecs.push('Apply agricultural lime (calcium carbonate) to neutralize soil acidity.');
    if (phVal > 7.8) generatedRecs.push('Apply gypsum to reduce alkalinity and improve soil porosity.');
    if (nVal < 250) generatedRecs.push('Apply neem-coated urea and bio-fertilizer (Azotobacter) to replenish nitrogen.');
    if (pVal < 30) generatedRecs.push('Supplement with Single Super Phosphate (SSP) along with mycorrhiza.');
    if (kVal < 200) generatedRecs.push('Apply Muriate of Potash (MOP) to enhance plant disease resistance.');
    if (ocVal < 0.5) generatedRecs.push('Urgent: Increase organic matter by incorporating vermicompost or farmyard manure (FYM).');
    if (generatedRecs.length === 0) {
      generatedRecs.push('Soil nutrients are well-balanced. Continue regular soil-mulching and drip irrigation.');
      generatedRecs.push('Perform periodic micronutrient foliar spray (Zinc + Iron) during peak vegetative phase.');
    }

    const report = await SoilReport.create({
      userId: req.user._id,
      farmId: targetFarmId,
      reportDate: new Date(),
      overallScore: Math.min(score, 98),
      rating,
      pH: phVal,
      nitrogen: nVal,
      phosphorus: pVal,
      potassium: kVal,
      moisture: mVal,
      organicCarbon: ocVal,
      electricalConductivity: Number(electricalConductivity) || 0.45,
      recommendations: generatedRecs,
    });

    res.status(201).json({ success: true, message: 'Soil report saved and analyzed successfully', data: report });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
