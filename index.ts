
import express from 'express';
import dotenv from 'dotenv';
import { setupStaticServing } from './static-serve.js';
import { db } from './database/connection.js';
import { geminiAI } from './services/geminiService.js';

dotenv.config();

const app = express();

// Body parsing middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS middleware
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
    return;
  }
  next();
});

// Dashboard Overview API
app.get('/api/dashboard', async (req, res) => {
  try {
    console.log('Fetching dashboard data...');
    
    const stores = await db.selectFrom('stores').selectAll().execute();
    const totalShelves = await db.selectFrom('shelves').select(db.fn.count('id').as('count')).executeTakeFirst();
    const activeAlerts = await db.selectFrom('theft_alerts').where('status', '=', 'active').select(db.fn.count('id').as('count')).executeTakeFirst();
    const recentEvents = await db.selectFrom('inventory_events')
      .leftJoin('shelves', 'inventory_events.shelf_id', 'shelves.id')
      .leftJoin('products', 'inventory_events.product_id', 'products.id')
      .select([
        'inventory_events.id',
        'inventory_events.event_type',
        'inventory_events.quantity_change',
        'inventory_events.timestamp',
        'shelves.shelf_code',
        'products.name as product_name'
      ])
      .orderBy('inventory_events.timestamp', 'desc')
      .limit(10)
      .execute();

    res.json({
      stores: stores.length,
      shelves: totalShelves?.count || 0,
      activeAlerts: activeAlerts?.count || 0,
      recentEvents
    });
  } catch (error) {
    console.error('Dashboard API error:', error);
    res.status(500).json({ error: 'Failed to fetch dashboard data' });
  }
});

// Stores API
app.get('/api/stores', async (req, res) => {
  try {
    console.log('Fetching stores...');
    const stores = await db.selectFrom('stores').selectAll().execute();
    res.json(stores);
  } catch (error) {
    console.error('Stores API error:', error);
    res.status(500).json({ error: 'Failed to fetch stores' });
  }
});

// Shelves API
app.get('/api/shelves', async (req, res) => {
  try {
    console.log('Fetching shelves...');
    const shelves = await db.selectFrom('shelves')
      .leftJoin('stores', 'shelves.store_id', 'stores.id')
      .select([
        'shelves.id',
        'shelves.shelf_code',
        'shelves.location',
        'shelves.category',
        'shelves.current_stock',
        'shelves.max_capacity',
        'shelves.last_updated',
        'stores.name as store_name'
      ])
      .execute();
    res.json(shelves);
  } catch (error) {
    console.error('Shelves API error:', error);
    res.status(500).json({ error: 'Failed to fetch shelves' });
  }
});

// Theft Alerts API
app.get('/api/alerts', async (req, res) => {
  try {
    console.log('Fetching theft alerts...');
    const alerts = await db.selectFrom('theft_alerts')
      .leftJoin('shelves', 'theft_alerts.shelf_id', 'shelves.id')
      .leftJoin('stores', 'shelves.store_id', 'stores.id')
      .select([
        'theft_alerts.id',
        'theft_alerts.alert_type',
        'theft_alerts.severity',
        'theft_alerts.description',
        'theft_alerts.ai_recommendation',
        'theft_alerts.status',
        'theft_alerts.created_at',
        'shelves.shelf_code',
        'stores.name as store_name'
      ])
      .orderBy('theft_alerts.created_at', 'desc')
      .execute();
    res.json(alerts);
  } catch (error) {
    console.error('Alerts API error:', error);
    res.status(500).json({ error: 'Failed to fetch alerts' });
  }
});

// Simulate Vision Detection Event
app.post('/api/vision/detect', async (req, res) => {
  try {
    const { shelfId, eventType, confidenceScore, description } = req.body;
    console.log('Processing vision detection:', { shelfId, eventType, confidenceScore });

    // Get shelf and product info
    const shelf = await db.selectFrom('shelves').where('id', '=', shelfId).selectAll().executeTakeFirst();
    if (!shelf) {
      res.status(404).json({ error: 'Shelf not found' });
      return;
    }

    // Get a random product for demo
    const product = await db.selectFrom('products').selectAll().limit(1).executeTakeFirst();
    if (!product) {
      res.status(404).json({ error: 'No products found' });
      return;
    }

    // Generate AI analysis
    const aiAnalysis = await geminiAI.analyzeInventoryEvent({
      eventType,
      productName: product.name,
      quantityChange: eventType === 'pickup' ? -1 : 1,
      timestamp: new Date().toISOString(),
      shelfLocation: shelf.location,
      confidenceScore
    });

    // Insert inventory event
    await db.insertInto('inventory_events').values({
      shelf_id: shelfId,
      product_id: product.id,
      event_type: eventType,
      quantity_change: eventType === 'pickup' ? -1 : 1,
      confidence_score: confidenceScore,
      ai_analysis: aiAnalysis
    }).execute();

    // Update shelf stock
    const newStock = eventType === 'pickup' ? shelf.current_stock - 1 : shelf.current_stock + 1;
    await db.updateTable('shelves').set({ 
      current_stock: Math.max(0, newStock),
      last_updated: new Date().toISOString()
    }).where('id', '=', shelfId).execute();

    // Create theft alert if suspicious
    if (eventType === 'theft' || confidenceScore < 0.7) {
      const alertRecommendation = await geminiAI.generateTheftAlert({
        shelfLocation: shelf.location,
        suspiciousActivity: description || 'Suspicious item removal detected',
        productCategory: shelf.category,
        timeOfDay: new Date().toLocaleTimeString()
      });

      await db.insertInto('theft_alerts').values({
        shelf_id: shelfId,
        alert_type: eventType === 'theft' ? 'theft_detected' : 'suspicious_activity',
        severity: confidenceScore < 0.5 ? 'HIGH' : 'MEDIUM',
        description: description || 'AI vision system detected suspicious activity',
        ai_recommendation: alertRecommendation
      }).execute();
    }

    res.json({ success: true, aiAnalysis });
  } catch (error) {
    console.error('Vision detection error:', error);
    res.status(500).json({ error: 'Failed to process vision detection' });
  }
});

// Generate Demand Forecast
app.post('/api/forecast/demand', async (req, res) => {
  try {
    const { productId, storeId } = req.body;
    console.log('Generating demand forecast for product:', productId, 'store:', storeId);

    const product = await db.selectFrom('products').where('id', '=', productId).selectAll().executeTakeFirst();
    const store = await db.selectFrom('stores').where('id', '=', storeId).selectAll().executeTakeFirst();

    if (!product || !store) {
      res.status(404).json({ error: 'Product or store not found' });
      return;
    }

    // Simulate historical data
    const historicalSales = [45, 52, 38, 61, 47, 55, 42];
    
    const forecast = await geminiAI.forecastDemand({
      productName: product.name,
      historicalSales,
      seasonalTrends: 'Winter holiday season approaching',
      localEvents: 'Black Friday sales event planned',
      weatherForecast: 'Cold weather expected',
      dayOfWeek: new Date().toLocaleDateString('en-US', { weekday: 'long' })
    });

    // Generate random forecast values for demo
    const predictedDemand = Math.floor(Math.random() * 50) + 30;
    const confidenceLevel = Math.random() * 0.3 + 0.7;

    await db.insertInto('demand_forecasts').values({
      product_id: productId,
      store_id: storeId,
      forecast_date: new Date().toISOString().split('T')[0],
      predicted_demand: predictedDemand,
      confidence_level: confidenceLevel,
      seasonal_factors: 'Holiday season, cold weather',
      ai_reasoning: forecast
    }).execute();

    res.json({ 
      success: true, 
      predictedDemand, 
      confidenceLevel: Math.round(confidenceLevel * 100),
      aiReasoning: forecast 
    });
  } catch (error) {
    console.error('Demand forecast error:', error);
    res.status(500).json({ error: 'Failed to generate demand forecast' });
  }
});

// Optimize Delivery Route
app.post('/api/delivery/optimize', async (req, res) => {
  try {
    const { storeId, destinations, vehicleType = 'EV Van' } = req.body;
    console.log('Optimizing delivery route for store:', storeId);

    const store = await db.selectFrom('stores').where('id', '=', storeId).selectAll().executeTakeFirst();
    if (!store) {
      res.status(404).json({ error: 'Store not found' });
      return;
    }

    const routeOptimization = await geminiAI.optimizeDeliveryRoute({
      destinations: destinations || ['123 Main St', '456 Oak Ave', '789 Pine Rd'],
      vehicleType,
      batteryLevel: Math.floor(Math.random() * 40) + 60,
      weatherConditions: 'Clear skies, 72°F',
      urgencyLevel: 'Standard'
    });

    const estimatedTime = Math.floor(Math.random() * 60) + 30;
    const batteryUsage = Math.random() * 20 + 10;

    await db.insertInto('delivery_routes').values({
      store_id: storeId,
      route_name: `Route ${Date.now()}`,
      destinations: JSON.stringify(destinations || ['123 Main St', '456 Oak Ave', '789 Pine Rd']),
      optimized_path: JSON.stringify(['Start', '123 Main St', '456 Oak Ave', '789 Pine Rd', 'Return']),
      estimated_time: estimatedTime,
      ev_battery_usage: batteryUsage,
      weather_conditions: 'Clear, 72°F',
      ai_insights: routeOptimization
    }).execute();

    res.json({ 
      success: true, 
      estimatedTime,
      batteryUsage: Math.round(batteryUsage),
      aiInsights: routeOptimization 
    });
  } catch (error) {
    console.error('Route optimization error:', error);
    res.status(500).json({ error: 'Failed to optimize delivery route' });
  }
});

// Resolve Alert
app.put('/api/alerts/:id/resolve', async (req, res) => {
  try {
    const alertId = parseInt(req.params.id);
    console.log('Resolving alert:', alertId);

    await db.updateTable('theft_alerts').set({
      status: 'resolved',
      resolved_at: new Date().toISOString()
    }).where('id', '=', alertId).execute();

    res.json({ success: true });
  } catch (error) {
    console.error('Alert resolution error:', error);
    res.status(500).json({ error: 'Failed to resolve alert' });
  }
});

// Analytics API
app.get('/api/analytics', async (req, res) => {
  try {
    console.log('Fetching analytics data...');

    const totalEvents = await db.selectFrom('inventory_events').select(db.fn.count('id').as('count')).executeTakeFirst();
    const totalAlerts = await db.selectFrom('theft_alerts').select(db.fn.count('id').as('count')).executeTakeFirst();
    const totalRoutes = await db.selectFrom('delivery_routes').select(db.fn.count('id').as('count')).executeTakeFirst();
    const totalForecasts = await db.selectFrom('demand_forecasts').select(db.fn.count('id').as('count')).executeTakeFirst();

    // Get events by type
    const eventsByType = await db.selectFrom('inventory_events')
      .select(['event_type', db.fn.count('id').as('count')])
      .groupBy('event_type')
      .execute();

    res.json({
      totalEvents: totalEvents?.count || 0,
      totalAlerts: totalAlerts?.count || 0,
      totalRoutes: totalRoutes?.count || 0,
      totalForecasts: totalForecasts?.count || 0,
      eventsByType
    });
  } catch (error) {
    console.error('Analytics API error:', error);
    res.status(500).json({ error: 'Failed to fetch analytics' });
  }
});

// Export a function to start the server
export async function startServer(port) {
  try {
    if (process.env.NODE_ENV === 'production') {
      setupStaticServing(app);
    }
    app.listen(port, () => {
      console.log(`VisionChain AI Server running on port ${port}`);
      console.log('🚀 Retail Intelligence Platform Ready');
      console.log('🔍 Computer Vision Detection Active');
      console.log('🤖 Gemini AI Analytics Online');
      console.log('📊 Real-time Dashboard Available');
    });
  } catch (err) {
    console.error('Failed to start server:', err);
    process.exit(1);
  }
}

// Start the server directly if this is the main module
if (import.meta.url === `file://${process.argv[1]}`) {
  console.log('Starting VisionChain server...');
  startServer(process.env.PORT || 3001);
}
