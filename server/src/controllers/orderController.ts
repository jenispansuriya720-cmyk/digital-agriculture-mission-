import { Response } from 'express';
import { Order } from '../models/Order';
import { AuthRequest } from '../middleware/auth';
import { Notification } from '../models/Notification';

// @desc    Create new order
// @route   POST /api/orders
export const createOrder = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Not authorized' });
      return;
    }

    const { items, subtotal, deliveryFee, totalAmount, shippingAddress, paymentMethod } = req.body;

    if (!items || items.length === 0) {
      res.status(400).json({ success: false, message: 'Cart is empty, cannot create order' });
      return;
    }

    const randomSuffix = Math.floor(10000 + Math.random() * 90000);
    const orderId = `KD-ORD-${Date.now().toString().slice(-4)}-${randomSuffix}`;

    const order = await Order.create({
      orderId,
      userId: req.user._id,
      items,
      subtotal: Number(subtotal),
      deliveryFee: Number(deliveryFee) || 0,
      totalAmount: Number(totalAmount),
      paymentMethod: paymentMethod || 'Kisan Pay / Cash on Delivery',
      paymentStatus: 'Paid',
      orderStatus: 'Confirmed',
      shippingAddress: shippingAddress || {
        fullName: req.user.name,
        phone: req.user.mobile,
        village: req.user.village,
        district: req.user.district,
        state: req.user.state,
        pincode: '382110',
      },
      trackingUpdates: [
        {
          status: 'Confirmed',
          timestamp: new Date(),
          description: 'Your agri-order has been placed and confirmed by Krishi Digital fulfillment center.',
        },
      ],
    });

    // Create notification for farmer
    await Notification.create({
      userId: req.user._id,
      title: '🛒 Order Placed Successfully',
      message: `Order #${orderId} of ₹${totalAmount.toLocaleString()} has been placed. Expected delivery in 2-3 business days.`,
      type: 'order',
      link: '/orders',
    });

    res.status(201).json({ success: true, message: 'Order placed successfully', data: order });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get logged in user orders
// @route   GET /api/orders
export const getMyOrders = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    let query: any = {};
    if (req.user?.role !== 'admin' || req.query.self === 'true') {
      query.userId = req.user?._id;
    }

    const orders = await Order.find(query).populate('userId', 'name email mobile').sort({ createdAt: -1 });
    res.json({ success: true, count: orders.length, data: orders });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get order details by orderId or Mongo ID
// @route   GET /api/orders/:id
export const getOrderById = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const order = await Order.findOne({
      $or: [{ _id: req.params.id }, { orderId: req.params.id }],
    }).populate('userId', 'name email mobile');

    if (!order) {
      res.status(404).json({ success: false, message: 'Order not found' });
      return;
    }

    if (req.user?.role !== 'admin' && order.userId._id.toString() !== req.user?._id.toString()) {
      res.status(403).json({ success: false, message: 'Not authorized to view this order' });
      return;
    }

    res.json({ success: true, data: order });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Admin update order status
// @route   PUT /api/orders/:id/status
export const updateOrderStatus = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { status, note } = req.body;
    const order = await Order.findById(req.params.id);

    if (!order) {
      res.status(404).json({ success: false, message: 'Order not found' });
      return;
    }

    order.orderStatus = status;
    order.trackingUpdates.push({
      status,
      timestamp: new Date(),
      description: note || `Order status updated to ${status}.`,
    });

    await order.save();

    // Alert user
    await Notification.create({
      userId: order.userId,
      title: `📦 Order #${order.orderId} ${status}`,
      message: note || `Your order status has changed to ${status}.`,
      type: 'order',
      link: '/orders',
    });

    res.json({ success: true, message: 'Order status updated', data: order });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
