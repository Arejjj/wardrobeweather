export const CATEGORIES = {
  TOP: 'Oberteil',
  SWEATER: 'Pullover/Sweatshirt',
  BOTTOM: 'Hose/Rock',
  DRESS: 'Kleid',
  OUTERWEAR: 'Jacke/Mantel',
  THERMAL: 'Thermolayer',
  SHOES: 'Schuhe',
  ACCESSORY: 'Accessoire',
}

// gender: 'all' | 'female' | 'male'
// tempMin/tempMax: Temperaturbereich in °C
// rain: true = wird bei Regen empfohlen
// layer: Reihenfolge beim Anziehen (1=innen, 3=außen)
export const defaultWardrobe = [
  // Oberteile
  { id: 'default-1',  name: 'T-Shirt',           category: CATEGORIES.TOP,      isDefault: true, photo: null, tempMin: 16, tempMax: 40, layer: 1, tags: ['casual'],          gender: 'all' },
  { id: 'default-2',  name: 'Langarmshirt',       category: CATEGORIES.TOP,      isDefault: true, photo: null, tempMin: 8,  tempMax: 20, layer: 1, tags: ['casual'],          gender: 'all' },
  { id: 'default-3',  name: 'Hemd',               category: CATEGORIES.TOP,      isDefault: true, photo: null, tempMin: 10, tempMax: 30, layer: 1, tags: ['casual','formal'], gender: 'male' },
  { id: 'default-25', name: 'Bluse',              category: CATEGORIES.TOP,      isDefault: true, photo: null, tempMin: 10, tempMax: 30, layer: 1, tags: ['casual','formal'], gender: 'female' },
  { id: 'default-4',  name: 'Thermounterhemd',    category: CATEGORIES.THERMAL,  isDefault: true, photo: null, tempMin: -20,tempMax: 3,  layer: 1, tags: ['warm'],            gender: 'all' },

  // Pullover
  { id: 'default-5',  name: 'Pullover',           category: CATEGORIES.SWEATER,  isDefault: true, photo: null, tempMin: 5,  tempMax: 16, layer: 2, tags: ['casual','warm'],   gender: 'all' },
  { id: 'default-6',  name: 'Cardigan',           category: CATEGORIES.SWEATER,  isDefault: true, photo: null, tempMin: 12, tempMax: 20, layer: 2, tags: ['casual'],          gender: 'all' },
  { id: 'default-7',  name: 'Hoodie',             category: CATEGORIES.SWEATER,  isDefault: true, photo: null, tempMin: 8,  tempMax: 18, layer: 2, tags: ['casual'],          gender: 'all' },

  // Hosen & Röcke
  { id: 'default-8',  name: 'Jeans',              category: CATEGORIES.BOTTOM,   isDefault: true, photo: null, tempMin: -10,tempMax: 22, layer: 1, tags: ['casual'],          gender: 'all' },
  { id: 'default-9',  name: 'Stoffhose',          category: CATEGORIES.BOTTOM,   isDefault: true, photo: null, tempMin: 5,  tempMax: 25, layer: 1, tags: ['formal','casual'], gender: 'all' },
  { id: 'default-10', name: 'Kurze Hose',         category: CATEGORIES.BOTTOM,   isDefault: true, photo: null, tempMin: 22, tempMax: 40, layer: 1, tags: ['casual'],          gender: 'all' },
  { id: 'default-11', name: 'Rock',               category: CATEGORIES.BOTTOM,   isDefault: true, photo: null, tempMin: 18, tempMax: 40, layer: 1, tags: ['casual'],          gender: 'female' },

  // Kleider
  { id: 'default-12', name: 'Sommerkleid',        category: CATEGORIES.DRESS,    isDefault: true, photo: null, tempMin: 20, tempMax: 40, layer: 1, tags: ['casual'],          gender: 'female' },

  // Jacken
  { id: 'default-13', name: 'Winterjacke',        category: CATEGORIES.OUTERWEAR,isDefault: true, photo: null, tempMin: -20,tempMax: 7,  layer: 3, tags: ['warm'],            gender: 'all' },
  { id: 'default-14', name: 'Übergangsjacke',     category: CATEGORIES.OUTERWEAR,isDefault: true, photo: null, tempMin: 7,  tempMax: 16, layer: 3, tags: ['casual'],          gender: 'all' },
  { id: 'default-15', name: 'Regenjacke',         category: CATEGORIES.OUTERWEAR,isDefault: true, photo: null, tempMin: 5,  tempMax: 25, layer: 3, tags: ['rain'],  rain: true, gender: 'all' },
  { id: 'default-16', name: 'Blazer',             category: CATEGORIES.OUTERWEAR,isDefault: true, photo: null, tempMin: 13, tempMax: 24, layer: 3, tags: ['formal'],          gender: 'all' },

  // Schuhe
  { id: 'default-17', name: 'Sneaker',            category: CATEGORIES.SHOES,    isDefault: true, photo: null, tempMin: 8,  tempMax: 30, layer: 1, tags: ['casual'],          gender: 'all' },
  { id: 'default-18', name: 'Chelsea Boots',      category: CATEGORIES.SHOES,    isDefault: true, photo: null, tempMin: -10,tempMax: 14, layer: 1, tags: ['casual','warm'],   gender: 'all' },
  { id: 'default-19', name: 'Sandalen',           category: CATEGORIES.SHOES,    isDefault: true, photo: null, tempMin: 22, tempMax: 40, layer: 1, tags: ['casual'],          gender: 'all' },
  { id: 'default-26', name: 'High Heels',         category: CATEGORIES.SHOES,    isDefault: true, photo: null, tempMin: 10, tempMax: 35, layer: 1, tags: ['formal'],          gender: 'female' },
  { id: 'default-20', name: 'Wasserfeste Schuhe', category: CATEGORIES.SHOES,    isDefault: true, photo: null, tempMin: 0,  tempMax: 25, layer: 1, tags: ['rain'],  rain: true, gender: 'all' },

  // Accessoires
  { id: 'default-21', name: 'Schal',              category: CATEGORIES.ACCESSORY,isDefault: true, photo: null, tempMin: -20,tempMax: 10, layer: 3, tags: ['warm'],            gender: 'all' },
  { id: 'default-22', name: 'Mütze',              category: CATEGORIES.ACCESSORY,isDefault: true, photo: null, tempMin: -20,tempMax: 5,  layer: 3, tags: ['warm'],            gender: 'all' },
  { id: 'default-23', name: 'Handschuhe',         category: CATEGORIES.ACCESSORY,isDefault: true, photo: null, tempMin: -20,tempMax: 2,  layer: 3, tags: ['warm'],            gender: 'all' },
  { id: 'default-24', name: 'Sonnenbrille',       category: CATEGORIES.ACCESSORY,isDefault: true, photo: null, tempMin: 20, tempMax: 40, layer: 3, tags: ['sun'],             gender: 'all' },
]
