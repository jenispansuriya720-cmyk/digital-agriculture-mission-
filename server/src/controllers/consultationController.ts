import { Response } from 'express';
import { Consultation } from '../models/Consultation';
import { Expert } from '../models/Expert';
import { Notification } from '../models/Notification';
import { AuthRequest } from '../middleware/auth';

// @desc    Submit question to an expert
// @route   POST /api/consultations
export const createConsultation = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Not authorized' });
      return;
    }

    const { problemTitle, category, crop, description, imageUrl, expertId } = req.body;

    if (!problemTitle || !category || !crop || !description) {
      res.status(400).json({ success: false, message: 'Please provide problem title, category, crop, and description' });
      return;
    }

    let assignedExpert = expertId;
    let expertName = 'Dr. Patel (Senior Agronomist)';

    if (expertId) {
      const exp = await Expert.findById(expertId);
      if (exp) expertName = exp.name;
    }

    const consultation = await Consultation.create({
      userId: req.user._id,
      expertId: assignedExpert,
      problemTitle,
      category,
      crop,
      description,
      imageUrl: imageUrl || '',
      status: 'In Progress',
      expertReply: {
        expertName,
        advice: `Based on your description for ${crop} (${category} advisory), our diagnostic center has received your query. Immediate recommendation: Inspect the underside of leaves for early nymph populations, maintain optimum soil moisture, and avoid nitrogen excess. A full personalized chemical/organic schedule will follow shortly.`,
        suggestedTreatment: 'Neem Oil Spray (1500 PPM) @ 3ml/L water as early bio-control measure.',
        repliedAt: new Date(),
      },
    });

    // Notify farmer
    await Notification.create({
      userId: req.user._id,
      title: '👨‍🔬 Expert Query Submitted',
      message: `Your question "${problemTitle}" has been received by ${expertName}. Preliminary advisory is ready.`,
      type: 'expert',
      link: '/experts',
    });

    res.status(201).json({ success: true, message: 'Advisory query submitted successfully', data: consultation });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get user consultations
// @route   GET /api/consultations
export const getMyConsultations = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    let query: any = {};
    if (req.user?.role !== 'admin' || req.query.self === 'true') {
      query.userId = req.user?._id;
    }

    const consultations = await Consultation.find(query)
      .populate('userId', 'name email mobile village')
      .populate('expertId', 'name title specialization avatar')
      .sort({ createdAt: -1 });

    res.json({ success: true, count: consultations.length, data: consultations });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Expert or Admin reply to consultation
// @route   PUT /api/consultations/:id/reply
export const replyConsultation = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { advice, suggestedTreatment, expertName } = req.body;
    const consultation = await Consultation.findById(req.params.id);

    if (!consultation) {
      res.status(404).json({ success: false, message: 'Consultation query not found' });
      return;
    }

    consultation.status = 'Answered';
    consultation.expertReply = {
      expertName: expertName || req.user?.name || 'Dr. Patel',
      advice,
      suggestedTreatment,
      repliedAt: new Date(),
    };

    await consultation.save();

    await Notification.create({
      userId: consultation.userId,
      title: '👨‍🔬 Expert Replied to Your Query',
      message: `${consultation.expertReply.expertName} answered your question on ${consultation.crop}.`,
      type: 'expert',
      link: '/experts',
    });

    res.json({ success: true, message: 'Reply sent to farmer', data: consultation });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
