-- Default handling modifiers
insert into public.handling_modifiers(label, multiplier) values
('fresh', 1.0),
('leftovers_day1', 1.2),
('leftovers_day2', 1.5),
('canned', 1.2),
('long_fermented', 2.0),
('pressure_cooked', 0.9);

-- Basic food database (starter set)
insert into public.foods (name, category, base_mg_per_kg, band, liberator, dao_blocker, typical_serve_g, confidence, notes) values
-- Meats (generally low when fresh)
('Chicken breast', 'Meat', null, 'low', false, false, 150, 'high', 'Fresh chicken is typically well tolerated'),
('Turkey breast', 'Meat', null, 'low', false, false, 150, 'high', 'Fresh turkey is typically well tolerated'),
('Beef steak', 'Meat', null, 'low', false, false, 200, 'medium', 'Fresh beef, avoid aged cuts'),
('Pork chops', 'Meat', null, 'low', false, false, 150, 'medium', 'Fresh pork cuts'),
('Lamb', 'Meat', null, 'medium', false, false, 150, 'medium', 'Can be higher if aged'),

-- Fish (fresh vs processed)
('Salmon fillet', 'Fish', null, 'low', false, false, 150, 'high', 'Fresh salmon is well tolerated'),
('Cod fillet', 'Fish', null, 'low', false, false, 150, 'high', 'Fresh white fish'),
('Tuna (canned)', 'Fish', null, 'high', false, false, 100, 'high', 'Canned fish is high histamine'),
('Sardines (canned)', 'Fish', null, 'very_high', false, false, 80, 'high', 'Very high histamine'),
('Smoked salmon', 'Fish', null, 'very_high', false, false, 80, 'high', 'Smoked fish is very high'),

-- Dairy
('Fresh milk', 'Dairy', null, 'low', false, false, 250, 'high', 'Fresh dairy is usually tolerated'),
('Fresh yogurt', 'Dairy', null, 'medium', false, false, 200, 'medium', 'Depends on fermentation time'),
('Aged cheddar', 'Dairy', null, 'very_high', false, false, 30, 'high', 'Aged cheeses are very high'),
('Parmesan', 'Dairy', null, 'very_high', false, false, 20, 'high', 'Very aged cheese'),
('Fresh mozzarella', 'Dairy', null, 'low', false, false, 100, 'medium', 'Fresh cheese is better'),

-- Grains
('White rice', 'Grains', null, 'low', false, false, 150, 'high', 'Well tolerated grain'),
('Quinoa', 'Grains', null, 'low', false, false, 150, 'high', 'Good alternative grain'),
('Oats', 'Grains', null, 'low', false, false, 100, 'high', 'Generally well tolerated'),
('Wheat bread', 'Grains', null, 'medium', false, false, 60, 'medium', 'Some people react to wheat'),
('Sourdough bread', 'Grains', null, 'high', false, false, 60, 'medium', 'Fermented bread is higher'),

-- Vegetables (generally low)
('Broccoli', 'Vegetables', null, 'low', false, false, 100, 'high', 'Fresh vegetables are safe'),
('Carrots', 'Vegetables', null, 'low', false, false, 100, 'high', 'Well tolerated'),
('Lettuce', 'Vegetables', null, 'low', false, false, 80, 'high', 'Leafy greens are good'),
('Bell peppers', 'Vegetables', null, 'low', false, false, 100, 'high', 'Fresh peppers'),
('Spinach', 'Vegetables', null, 'medium', false, false, 100, 'medium', 'Some react to spinach'),
('Tomatoes', 'Vegetables', null, 'high', true, false, 150, 'high', 'High histamine and liberator'),
('Avocado', 'Vegetables', null, 'medium', true, false, 150, 'medium', 'Histamine liberator'),

-- Fruits
('Apples', 'Fruits', null, 'low', false, false, 150, 'high', 'Generally well tolerated'),
('Pears', 'Fruits', null, 'low', false, false, 150, 'high', 'Low histamine fruit'),
('Bananas', 'Fruits', null, 'medium', true, false, 120, 'medium', 'Can be a liberator when very ripe'),
('Strawberries', 'Fruits', null, 'high', true, false, 100, 'high', 'High histamine liberator'),
('Citrus fruits', 'Fruits', null, 'high', true, false, 150, 'high', 'Liberator effect'),
('Blueberries', 'Fruits', null, 'low', false, false, 100, 'medium', 'Generally well tolerated'),

-- Fermented foods (high)
('Sauerkraut', 'Fermented', null, 'very_high', false, false, 100, 'high', 'Fermented cabbage'),
('Kimchi', 'Fermented', null, 'very_high', false, false, 100, 'high', 'Fermented vegetables'),
('Kefir', 'Fermented', null, 'high', false, false, 200, 'high', 'Fermented dairy'),
('Kombucha', 'Fermented', null, 'high', false, false, 250, 'medium', 'Fermented tea'),

-- Processed foods
('Salami', 'Processed Meat', null, 'very_high', false, false, 50, 'high', 'Cured/aged meat'),
('Ham', 'Processed Meat', null, 'high', false, false, 80, 'high', 'Processed meat'),
('Chocolate', 'Sweets', null, 'high', true, true, 30, 'high', 'Liberator and DAO blocker'),
('Red wine', 'Alcohol', null, 'very_high', false, true, 150, 'high', 'High histamine and DAO blocker'),
('Beer', 'Alcohol', null, 'high', false, true, 330, 'high', 'Fermented and DAO blocker'),

-- Nuts and seeds
('Almonds', 'Nuts', null, 'low', false, false, 30, 'medium', 'Generally tolerated'),
('Walnuts', 'Nuts', null, 'medium', false, false, 30, 'medium', 'Some people react'),
('Peanuts', 'Nuts', null, 'high', true, false, 30, 'medium', 'Can be problematic'),

-- Spices and herbs
('Fresh basil', 'Herbs', null, 'low', false, false, 10, 'medium', 'Fresh herbs are better'),
('Oregano (dried)', 'Herbs', null, 'medium', false, false, 5, 'medium', 'Dried herbs can be higher'),
('Cinnamon', 'Spices', null, 'low', false, false, 5, 'high', 'Generally well tolerated'),
('Black pepper', 'Spices', null, 'low', false, false, 2, 'high', 'Basic spice'),

-- Oils and fats
('Olive oil', 'Oils', null, 'low', false, false, 15, 'high', 'Cold-pressed is best'),
('Coconut oil', 'Oils', null, 'low', false, false, 15, 'high', 'Well tolerated fat'),
('Butter', 'Dairy', null, 'low', false, false, 15, 'medium', 'Fresh butter is usually OK'),

-- Vinegar and pickled
('White vinegar', 'Condiments', null, 'high', false, false, 15, 'high', 'Fermented product'),
('Pickles', 'Pickled', null, 'very_high', false, false, 50, 'high', 'Pickled vegetables'),
('Soy sauce', 'Condiments', null, 'very_high', false, false, 15, 'high', 'Fermented soy product');