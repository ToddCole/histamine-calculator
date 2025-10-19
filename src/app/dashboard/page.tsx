"use client";

import { useState } from 'react';
import { calculateMealHU, formatHU } from '@/lib/hu';
import { Food, HandlingModifier } from '@/lib/types';

// Sample food data for testing
const sampleFoods: Food[] = [
  {
    id: '1',
    name: 'Fresh Chicken Breast',
    category: 'Meat',
    band: 'low',
    liberator: false,
    dao_blocker: false,
    typical_serve_g: 150,
    confidence: 'high'
  },
  {
    id: '2', 
    name: 'Aged Cheddar Cheese',
    category: 'Dairy',
    band: 'high',
    liberator: false,
    dao_blocker: false,
    typical_serve_g: 30,
    confidence: 'high'
  },
  {
    id: '3',
    name: 'Tomato',
    category: 'Vegetables',
    band: 'medium',
    liberator: true,
    dao_blocker: false,
    typical_serve_g: 100,
    confidence: 'medium'
  }
];

const handlingModifiers: HandlingModifier[] = [
  { id: '1', label: 'Fresh', multiplier: 1.0 },
  { id: '2', label: 'Leftovers (Day 1)', multiplier: 1.2 },
  { id: '3', label: 'Canned', multiplier: 1.2 }
];

export default function Dashboard() {
  const [selectedItems, setSelectedItems] = useState<Array<{
    food: Food;
    grams: number;
    handling: HandlingModifier;
  }>>([]);
  
  const [daoUnits, setDaoUnits] = useState(0);
  const [alcoholWithMeal, setAlcoholWithMeal] = useState(false);

  const addItem = (food: Food) => {
    setSelectedItems([...selectedItems, {
      food,
      grams: food.typical_serve_g || 100,
      handling: handlingModifiers[0]
    }]);
  };

  const removeItem = (index: number) => {
    setSelectedItems(selectedItems.filter((_, i) => i !== index));
  };

  const updateGrams = (index: number, grams: number) => {
    const updated = [...selectedItems];
    updated[index].grams = grams;
    setSelectedItems(updated);
  };

  const mealCalculation = selectedItems.length > 0 
    ? calculateMealHU(selectedItems, alcoholWithMeal, daoUnits)
    : { items: [], subtotal: 0, dao_credit: 0, total: 0 };

  const tolerance = 100; // Default tolerance for demo
  const gaugeColor = mealCalculation.total <= tolerance * 0.7 ? 'green' : 
                    mealCalculation.total <= tolerance * 0.9 ? 'amber' : 'red';

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold">📊 Dashboard</h1>
        <p className="text-gray-600">Track your daily histamine intake</p>
      </div>

      {/* Daily Gauge */}
      <div className="bg-white p-6 rounded-lg border shadow-sm">
        <h2 className="text-xl font-semibold mb-4">Today&apos;s Histamine Load</h2>
        <div className="flex items-center justify-between mb-4">
          <div>
            <div className="text-3xl font-bold">{formatHU(mealCalculation.total)} HU</div>
            <div className="text-sm text-gray-500">of {tolerance} HU tolerance</div>
          </div>
          <div className={`px-4 py-2 rounded-full text-white font-medium ${
            gaugeColor === 'green' ? 'bg-green-500' :
            gaugeColor === 'amber' ? 'bg-yellow-500' : 'bg-red-500'
          }`}>
            {gaugeColor.toUpperCase()}
          </div>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className={`h-2 rounded-full transition-all duration-300 ${
              gaugeColor === 'green' ? 'bg-green-500' :
              gaugeColor === 'amber' ? 'bg-yellow-500' : 'bg-red-500'
            }`}
            style={{ width: `${Math.min((mealCalculation.total / tolerance) * 100, 100)}%` }}
          ></div>
        </div>
      </div>

      {/* Current Meal Builder */}
      <div className="bg-white p-6 rounded-lg border shadow-sm">
        <h2 className="text-xl font-semibold mb-4">Meal Builder</h2>
        
        {/* Add Foods */}
        <div className="mb-4">
          <h3 className="font-medium mb-2">Add Foods:</h3>
          <div className="flex gap-2 flex-wrap">
            {sampleFoods.map(food => (
              <button
                key={food.id}
                onClick={() => addItem(food)}
                className="px-3 py-1 bg-blue-100 hover:bg-blue-200 rounded text-sm transition-colors"
              >
                {food.name}
              </button>
            ))}
          </div>
        </div>

        {/* Selected Items */}
        {selectedItems.length > 0 && (
          <div className="space-y-2 mb-4">
            <h3 className="font-medium">Current Meal:</h3>
            {selectedItems.map((item, index) => (
              <div key={index} className="flex items-center gap-4 p-3 bg-gray-50 rounded">
                <div className="flex-1">
                  <div className="font-medium">{item.food.name}</div>
                  <div className="text-sm text-gray-500">
                    {item.food.band && `${item.food.band} histamine`}
                    {item.food.liberator && ' • liberator'}
                    {item.food.dao_blocker && ' • DAO blocker'}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    value={item.grams}
                    onChange={(e) => updateGrams(index, Number(e.target.value))}
                    className="w-16 px-2 py-1 border rounded text-sm"
                    min="1"
                  />
                  <span className="text-sm text-gray-500">g</span>
                </div>
                <div className="text-sm font-medium">
                  {formatHU(mealCalculation.items[index] || 0)} HU
                </div>
                <button
                  onClick={() => removeItem(index)}
                  className="text-red-500 hover:text-red-700 text-sm"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Modifiers */}
        <div className="flex gap-4 mb-4">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={alcoholWithMeal}
              onChange={(e) => setAlcoholWithMeal(e.target.checked)}
            />
            <span className="text-sm">Alcohol with meal</span>
          </label>
          <div className="flex items-center gap-2">
            <label className="text-sm">DAO units:</label>
            <input
              type="number"
              value={daoUnits}
              onChange={(e) => setDaoUnits(Number(e.target.value))}
              className="w-16 px-2 py-1 border rounded text-sm"
              min="0"
            />
          </div>
        </div>

        {/* Calculation Breakdown */}
        {selectedItems.length > 0 && (
          <div className="border-t pt-4 space-y-2 text-sm">
            <div className="flex justify-between">
              <span>Subtotal:</span>
              <span>{formatHU(mealCalculation.subtotal)} HU</span>
            </div>
            {mealCalculation.dao_credit > 0 && (
              <div className="flex justify-between text-green-600">
                <span>DAO Credit:</span>
                <span>-{formatHU(mealCalculation.dao_credit)} HU</span>
              </div>
            )}
            <div className="flex justify-between font-medium border-t pt-2">
              <span>Total:</span>
              <span>{formatHU(mealCalculation.total)} HU</span>
            </div>
          </div>
        )}
      </div>

      {/* Quick Links */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <a href="/foods" className="block p-4 bg-white border rounded-lg hover:bg-gray-50 transition-colors">
          <div className="font-medium">🍎 Browse Foods</div>
          <div className="text-sm text-gray-600">Search food database</div>
        </a>
        <a href="/logs" className="block p-4 bg-white border rounded-lg hover:bg-gray-50 transition-colors">
          <div className="font-medium">📝 Log Symptoms</div>
          <div className="text-sm text-gray-600">Track your reactions</div>
        </a>
        <a href="/meal/new" className="block p-4 bg-white border rounded-lg hover:bg-gray-50 transition-colors">
          <div className="font-medium">🍽️ New Meal</div>
          <div className="text-sm text-gray-600">Advanced meal builder</div>
        </a>
      </div>
    </div>
  );
}