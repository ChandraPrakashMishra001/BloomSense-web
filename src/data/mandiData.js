// ── Mandi & MSP Agricultural Market Intelligence ───────────────────────────
// Official GoI Minimum Support Price (MSP) benchmarks (2024-25 / 2025-26)
// Combined with live APMC rates, historical trendlines, and decision heuristics

export const COMMODITY_CATEGORIES = [
  { id: 'all', label: 'All Crops', icon: '🌾' },
  { id: 'cereals', label: 'Cereals', icon: '🥣' },
  { id: 'pulses', label: 'Pulses (दालें)', icon: '🫘' },
  { id: 'oilseeds', label: 'Oilseeds (तिलहन)', icon: '🌻' },
  { id: 'vegetables', label: 'Vegetables & Tuber', icon: '🍅' },
  { id: 'commercial', label: 'Commercial & Cash', icon: '☁️' }
];

export const STATES_LIST = [
  { id: 'all', name: 'All India' },
  { id: 'odisha', name: 'Odisha' },
  { id: 'punjab', name: 'Punjab' },
  { id: 'madhya-pradesh', name: 'Madhya Pradesh' },
  { id: 'maharashtra', name: 'Maharashtra' },
  { id: 'rajasthan', name: 'Rajasthan' },
  { id: 'uttar-pradesh', name: 'Uttar Pradesh' },
  { id: 'andhra-pradesh', name: 'Andhra Pradesh' },
  { id: 'gujarat', name: 'Gujarat' }
];

// Curated 18 crops with live APMC modal rates, official MSP, arrival volumes, and decision heuristics
export const MANDI_CROPS_DATA = [
  {
    id: 'paddy-common',
    name: 'Paddy / Rice (Common)',
    vernacularHindi: 'धान (साधारण)',
    vernacularOdia: 'ଧାନ (ସାଧାରଣ)',
    scientificName: 'Oryza sativa',
    category: 'cereals',
    icon: '🌾',
    unit: '₹ / Quintal',
    msp2024: 2300, // GoI MSP 2024-25
    mspPrev: 2183,
    state: 'odisha',
    primaryMandi: 'Sambalpur APMC, Odisha',
    mandis: [
      { name: 'Sambalpur APMC (Odisha)', min: 2380, modal: 2460, max: 2540, arrivals: '4,200 Qtl', distance: '12 km' },
      { name: 'Bargarh Mandi (Odisha)', min: 2360, modal: 2430, max: 2510, arrivals: '6,800 Qtl', distance: '48 km' },
      { name: 'Cuttack Malgodown (Odisha)', min: 2420, modal: 2510, max: 2600, arrivals: '3,100 Qtl', distance: '280 km' },
      { name: 'Khanna APMC (Punjab)', min: 2450, modal: 2520, max: 2610, arrivals: '12,500 Qtl', distance: '1,450 km' }
    ],
    priceChange7d: +3.8, // % change
    trend7d: [2370, 2390, 2410, 2400, 2430, 2445, 2460],
    arrivalStatus: 'Moderate & Steady',
    seasonalFactor: 'Post-harvest procurement active. FCI & Odisha State Civil Supplies Corp (OSCSC) procurement open.',
    decision: 'SELL_NOW', // 'SELL_NOW' | 'HOLD' | 'WAIT'
    confidence: 91,
    timeHorizon: 'Next 5–7 Days',
    guidance: {
      en: 'Current market rate ₹2,460 is ₹160 above official MSP (₹2,300). With high arrivals approaching next week from western Odisha districts, selling now locks in premium before expected supply glut.',
      hi: 'वर्तमान भाव ₹2,460 सरकारी एमएसपी (₹2,300) से ₹160 अधिक है। पश्चिमी ओडिशा से आवक बढ़ने वाली है, अतः वर्तमान में बेचना अधिकतम लाभ सुनिश्चित करेगा।',
      od: 'ବର୍ତ୍ତମାନର ବଜାର ଦର ₹୨,୪୬୦ ସରକାରୀ ଏମଏସପି (₹୨,୩୦୦) ଠାରୁ ₹୧୬୦ ଅଧିକ ଅଛି। ଆଗାମୀ ସପ୍ତାହରେ ଆମଦାନୀ ବୃଦ୍ଧି ହେବା ପୂର୍ବରୁ ଏବେ ବିକ୍ରୟ କରିବା ସବୁଠାରୁ ଲାଭଦାୟକ।'
    },
    actionPoints: [
      'Moisture level must be under 17% for Grade-A procurement specs',
      'Compare rates with nearby Bargarh Mandi before dispatching',
      'Register on Odisha P-PAS portal if opting for direct DBT mill payment'
    ]
  },
  {
    id: 'paddy-grade-a',
    name: 'Paddy (Grade A / Fine)',
    vernacularHindi: 'धान (ग्रेड-ए)',
    vernacularOdia: 'ଧାନ (ଗ୍ରେଡ୍-ଏ)',
    scientificName: 'Oryza sativa (Fine)',
    category: 'cereals',
    icon: '🍚',
    unit: '₹ / Quintal',
    msp2024: 2320,
    mspPrev: 2203,
    state: 'odisha',
    primaryMandi: 'Bargarh Mandi, Odisha',
    mandis: [
      { name: 'Bargarh Mandi (Odisha)', min: 2480, modal: 2580, max: 2690, arrivals: '5,400 Qtl', distance: '35 km' },
      { name: 'Sambalpur APMC (Odisha)', min: 2450, modal: 2550, max: 2640, arrivals: '3,900 Qtl', distance: '42 km' },
      { name: 'Bhubaneswar RMC (Odisha)', min: 2520, modal: 2620, max: 2750, arrivals: '2,200 Qtl', distance: '310 km' }
    ],
    priceChange7d: +2.4,
    trend7d: [2510, 2520, 2535, 2540, 2560, 2570, 2580],
    arrivalStatus: 'Controlled Arrivals',
    seasonalFactor: 'High premium from private millers for export-quality fine grain.',
    decision: 'SELL_NOW',
    confidence: 88,
    timeHorizon: 'Next 7–10 Days',
    guidance: {
      en: 'Grade A paddy command a healthy ₹260 premium over MSP. Private parboiled millers in Bargarh & Cuttack are buying aggressively for overseas shipments.',
      hi: 'ग्रेड-ए धान पर एमएसपी से ₹260 का मजबूत प्रीमियम मिल रहा है। निजी मिलर्स निर्यात के लिए अच्छी कीमत पर खरीद कर रहे हैं।',
      od: 'ଗ୍ରେଡ-ଏ ଧାନ ଉପରେ ଏମଏସପି ଠାରୁ ₹୨୬୦ ଅଧିକ ପ୍ରିମିୟମ୍ ମିଳୁଛି। ବରଗଡ଼ ଓ କଟକର ମିଲର୍ସମାନେ ଉଚ୍ଚ ଦରରେ ଖରିଦ କରୁଛନ୍ତି।'
    },
    actionPoints: [
      'Grain cleanliness and uniform moisture (<14%) yield maximum price',
      'Target private millers if offering above ₹2,550/qtl instant cash'
    ]
  },
  {
    id: 'wheat',
    name: 'Wheat (Sharbati / Mill Quality)',
    vernacularHindi: 'गेहूं (शरबती / मिल)',
    vernacularOdia: 'ଗହମ',
    scientificName: 'Triticum aestivum',
    category: 'cereals',
    icon: '🌿',
    unit: '₹ / Quintal',
    msp2024: 2425, // Rabi 2024-25 / 2025-26
    mspPrev: 2275,
    state: 'madhya-pradesh',
    primaryMandi: 'Indore APMC, Madhya Pradesh',
    mandis: [
      { name: 'Indore APMC (MP)', min: 2650, modal: 2840, max: 3150, arrivals: '14,200 Qtl', distance: 'Local' },
      { name: 'Ujjain Mandi (MP)', min: 2600, modal: 2790, max: 3050, arrivals: '8,900 Qtl', distance: '55 km' },
      { name: 'Kota Mandi (Rajasthan)', min: 2580, modal: 2720, max: 2980, arrivals: '11,000 Qtl', distance: '240 km' },
      { name: 'Khanna APMC (Punjab)', min: 2510, modal: 2640, max: 2820, arrivals: '16,000 Qtl', distance: '850 km' }
    ],
    priceChange7d: +4.6,
    trend7d: [2710, 2730, 2760, 2780, 2810, 2825, 2840],
    arrivalStatus: 'Tight Stock / High Demand',
    seasonalFactor: 'Flour mills and biscuit manufacturers actively building buffer stock.',
    decision: 'HOLD',
    confidence: 84,
    timeHorizon: 'Hold for 15–20 Days',
    guidance: {
      en: 'Modal price ₹2,840 is comfortably ₹415 above MSP. Central Indian Sharbati grain reserves are low; prices projected to test ₹2,950+ in coming weeks.',
      hi: 'भाव ₹2,840 है जो एमएसपी से ₹415 ऊपर है। केंद्रीय भारत में गेहूं का स्टॉक सीमित है, 15 दिनों में भाव ₹2,950 पार जाने की प्रबल संभावना है।',
      od: 'ଦର ₹୨,୮୪୦ ଅଛି ଯାହା ଏମଏସପି ଠାରୁ ₹୪୧୫ ଉପରେ। ଆଗାମୀ ୧୫-୨୦ ଦିନ ମଧ୍ୟରେ ଦର ₹୨,୯୫୦ ଟପିବାର ସମ୍ଭାବନା ଅଛି, ତେଣୁ କିଛି ଦିନ ଅପେକ୍ଷା କରନ୍ତୁ।'
    },
    actionPoints: [
      'Store in hermetic bags to prevent weevil/grain borer damage',
      'Watch for FCI Open Market Sale Scheme (OMSS) release announcements',
      'Consider pledge finance if urgent liquidity is needed'
    ]
  },
  {
    id: 'maize',
    name: 'Maize / Corn (Yellow)',
    vernacularHindi: 'मक्का (पीला)',
    vernacularOdia: 'ମକା',
    scientificName: 'Zea mays',
    category: 'cereals',
    icon: '🌽',
    unit: '₹ / Quintal',
    msp2024: 2225,
    mspPrev: 2090,
    state: 'odisha',
    primaryMandi: 'Nabarangpur Mandi, Odisha',
    mandis: [
      { name: 'Nabarangpur Mandi (Odisha)', min: 2280, modal: 2390, max: 2480, arrivals: '4,100 Qtl', distance: 'Local' },
      { name: 'Jeypore APMC (Odisha)', min: 2250, modal: 2360, max: 2450, arrivals: '3,200 Qtl', distance: '40 km' },
      { name: 'Gulabbagh Mandi (Bihar)', min: 2340, modal: 2470, max: 2580, arrivals: '18,000 Qtl', distance: '680 km' },
      { name: 'Davangere APMC (Karnataka)', min: 2300, modal: 2410, max: 2520, arrivals: '9,500 Qtl', distance: '920 km' }
    ],
    priceChange7d: +1.9,
    trend7d: [2340, 2350, 2355, 2370, 2375, 2380, 2390],
    arrivalStatus: 'Firm Poultry & Ethanol Demand',
    seasonalFactor: 'Ethanol blending distilleries and poultry feed millers competing for supply.',
    decision: 'SELL_NOW',
    confidence: 86,
    timeHorizon: 'Next 5–8 Days',
    guidance: {
      en: 'Maize is trading at ₹2,390/qtl (+₹165 over MSP). Distilleries and poultry feed manufactures in Southern & Eastern belts are offering prompt payment with minimal moisture deductions.',
      hi: 'मक्का ₹2,390 प्रति क्विंटल पर बिक रहा है (एमएसपी से ₹165 ऊपर)। एथेनॉल इकाइयों और पोल्ट्री फीड से मजबूत मांग के कारण अभी बेचना फायदेमंद है।',
      od: 'ମକା ଦର ₹୨,୩୯୦ ଅଛି (ଏମଏସପି ଠାରୁ ₹୧୬୫ ଅଧିକ)। ପୋଲ୍ଟ୍ରି ଫିଡ୍ ଓ ଇଥାନଲ ୟୁନିଟ୍ ଗୁଡ଼ିକ ଉଚ୍ଚ ମୂଲ୍ୟ ଦେଉଥିବାରୁ ଏବେ ବିକ୍ରୟ କରନ୍ତୁ।'
    },
    actionPoints: [
      'Ensure kernel moisture under 14% to avoid fungal aflatoxin',
      'Bulk sales directly to feed aggregators bypass middleman commission'
    ]
  },
  {
    id: 'chana',
    name: 'Gram / Chana (Desi)',
    vernacularHindi: 'चना (देसी)',
    vernacularOdia: 'ବୁଟ / ଚଣା',
    scientificName: 'Cicer arietinum',
    category: 'pulses',
    icon: '🫘',
    unit: '₹ / Quintal',
    msp2024: 5650,
    mspPrev: 5440,
    state: 'madhya-pradesh',
    primaryMandi: 'Bhopal APMC, Madhya Pradesh',
    mandis: [
      { name: 'Bhopal APMC (MP)', min: 6100, modal: 6420, max: 6780, arrivals: '6,200 Qtl', distance: 'Local' },
      { name: 'Indore Mandi (MP)', min: 6150, modal: 6490, max: 6850, arrivals: '9,400 Qtl', distance: '190 km' },
      { name: 'Jaipur APMC (Rajasthan)', min: 6050, modal: 6380, max: 6720, arrivals: '5,800 Qtl', distance: '380 km' },
      { name: 'Cuttack Malgodown (Odisha)', min: 6400, modal: 6750, max: 7100, arrivals: '1,400 Qtl', distance: '820 km' }
    ],
    priceChange7d: +5.2,
    trend7d: [6120, 6180, 6240, 6300, 6360, 6390, 6420],
    arrivalStatus: 'High Festive & Dal Mill Demand',
    seasonalFactor: 'Lower acreage reported this year; domestic buffer below target.',
    decision: 'SELL_NOW',
    confidence: 94,
    timeHorizon: 'Next 3–5 Days',
    guidance: {
      en: 'Gram prices have surged to ₹6,420/qtl — an enormous ₹770 (+13.6%) above MSP. Dal millers are buying aggressively; this represents an optimal selling window before NAFED stock interventions.',
      hi: 'चना भाव ₹6,420 पर पहुंचा है — एमएसपी (₹5,650) से ₹770 (+13.6%) ऊपर! दाल मिलों की जबर्दस्त मांग है, नैफेड के हस्तक्षेप से पहले यह बेचने का सबसे सही समय है।',
      od: 'ଚଣା ଦର ବଢ଼ି ₹୬,୪୨୦ ଛୁଇଁଛି — ଏମଏସପି (₹୫,୬୫୦) ଠାରୁ ₹୭୭୦ (+୧୩.୬%) ଅଧିକ! ନାଫେଡ୍ ହସ୍ତକ୍ଷେପ ପୂର୍ବରୁ ଏବେ ବିକ୍ରି କରି ଉଚ୍ଚ ଲାଭ ନିଅନ୍ତୁ।'
    },
    actionPoints: [
      'Lock in spot prices with verified commission agents (Aadhatiyas)',
      'Grade output to remove split and discolored seeds to secure max band (₹6,700+)'
    ]
  },
  {
    id: 'tur-arhar',
    name: 'Tur / Arhar (Pigeon Pea)',
    vernacularHindi: 'तुअर / अरहर दाल',
    vernacularOdia: 'ହରଡ଼ ଡାଲି',
    scientificName: 'Cajanus cajan',
    category: 'pulses',
    icon: '🥣',
    unit: '₹ / Quintal',
    msp2024: 7550,
    mspPrev: 7000,
    state: 'maharashtra',
    primaryMandi: 'Akola Mandi, Maharashtra',
    mandis: [
      { name: 'Akola Mandi (Maharashtra)', min: 9400, modal: 10200, max: 11100, arrivals: '3,800 Qtl', distance: 'Local' },
      { name: 'Latur APMC (Maharashtra)', min: 9600, modal: 10450, max: 11350, arrivals: '5,600 Qtl', distance: '220 km' },
      { name: 'Gulbarga Mandi (Karnataka)', min: 9500, modal: 10300, max: 11200, arrivals: '4,400 Qtl', distance: '340 km' },
      { name: 'Rayagada APMC (Odisha)', min: 9200, modal: 9950, max: 10700, arrivals: '980 Qtl', distance: '780 km' }
    ],
    priceChange7d: +3.1,
    trend7d: [9900, 9950, 10020, 10080, 10120, 10160, 10200],
    arrivalStatus: 'Structural Shortage',
    seasonalFactor: 'Tight international supplies from Myanmar/Africa keeping domestic prices buoyant.',
    decision: 'SELL_NOW',
    confidence: 96,
    timeHorizon: 'Next 5–7 Days',
    guidance: {
      en: 'Spectacular market rates! At ₹10,200/qtl, Tur is trading ₹2,650 (+35.1%) above MSP. Take full advantage of this peak commodity cycle.',
      hi: 'अभूतपूर्व भाव! तुअर ₹10,200 प्रति क्विंटल पर है जो एमएसपी से ₹2,650 (+35.1%) अधिक है। इस ऐतिहासिक तेजी का लाभ उठाते हुए तुरंत बिक्री करें।',
      od: 'ଅଭୂତପୂର୍ବ ଦର! ହରଡ଼ ଦର ₹୧୦,୨୦୦ ଛୁଇଁଛି ଯାହା ଏମଏସପି ଠାରୁ ₹୨,୬୫୦ (+୩୫.୧%) ଅଧିକ। ଏହି ଉଚ୍ଚ ମୂଲ୍ୟ ସୁଯୋଗର ତୁରନ୍ତ ଲାଭ ଉଠାନ୍ତୁ।'
    },
    actionPoints: [
      'Sell in staggered lots (50% now, 50% next week) to mitigate volatility',
      'Watch government stock limit notifications for dal millers'
    ]
  },
  {
    id: 'moong',
    name: 'Moong (Green Gram)',
    vernacularHindi: 'मूंग दाल',
    vernacularOdia: 'ମୁଗ',
    scientificName: 'Vigna radiata',
    category: 'pulses',
    icon: '🌱',
    unit: '₹ / Quintal',
    msp2024: 8682,
    mspPrev: 8558,
    state: 'rajasthan',
    primaryMandi: 'Merta City APMC, Rajasthan',
    mandis: [
      { name: 'Merta City Mandi (Rajasthan)', min: 7800, modal: 8250, max: 8750, arrivals: '5,100 Qtl', distance: 'Local' },
      { name: 'Nagaur APMC (Rajasthan)', min: 7750, modal: 8180, max: 8690, arrivals: '4,200 Qtl', distance: '85 km' },
      { name: 'Nayagarh Mandi (Odisha)', min: 8100, modal: 8520, max: 8900, arrivals: '1,200 Qtl', distance: '1,200 km' }
    ],
    priceChange7d: -1.8,
    trend7d: [8420, 8380, 8350, 8300, 8280, 8260, 8250],
    arrivalStatus: 'Fresh Summer Crop Arrivals',
    seasonalFactor: 'Price currently below MSP due to sudden flush of arrivals.',
    decision: 'WAIT',
    confidence: 89,
    timeHorizon: 'Wait 20–30 Days (Store)',
    guidance: {
      en: 'Modal price ₹8,250 is ₹432 below MSP (₹8,682). Do NOT panic sell at a loss! Government procurement under PM-AASHA and NAFED centers is commencing. Store in WDRA godowns or sell via MSP procurement.',
      hi: 'मूंग का भाव ₹8,250 सरकारी एमएसपी (₹8,682) से ₹432 नीचे है। अभी घाटे में न बेचें! नैफेड और सरकारी खरीद केंद्र जल्द खुल रहे हैं। भंडारण करें या एमएसपी केंद्र पर बेचें।',
      od: 'ମୁଗର ବଜାର ଦର ₹୮,୨୫୦ ସରକାରୀ ଏମଏସପି (₹୮,୬୮୨) ଠାରୁ ₹୪୩୨ ତଳେ ଅଛି। କ୍ଷତିରେ ବିକ୍ରି କରନ୍ତୁ ନାହିଁ! ସରକାରୀ ନାଫେଡ୍ କେନ୍ଦ୍ର ଖୋଲିବା ଯାଏ ଗଚ୍ଛିତ ରଖନ୍ତୁ।'
    },
    actionPoints: [
      'Store in WDRA accredited godown to avail e-NWR pledge loan at 7%',
      'Check local Primary Agricultural Credit Society (PACS) procurement dates',
      'Clean to FAQ (Fair Average Quality) standards to guarantee MSP purchase'
    ]
  },
  {
    id: 'soybean',
    name: 'Soybean (Yellow)',
    vernacularHindi: 'सोयाबीन (पीला)',
    vernacularOdia: 'ସୋୟାବିନ୍',
    scientificName: 'Glycine max',
    category: 'oilseeds',
    icon: '🫘',
    unit: '₹ / Quintal',
    msp2024: 4892,
    mspPrev: 4600,
    state: 'madhya-pradesh',
    primaryMandi: 'Ujjain APMC, Madhya Pradesh',
    mandis: [
      { name: 'Ujjain Mandi (MP)', min: 4350, modal: 4650, max: 4950, arrivals: '11,400 Qtl', distance: 'Local' },
      { name: 'Dewas APMC (MP)', min: 4320, modal: 4610, max: 4920, arrivals: '7,800 Qtl', distance: '40 km' },
      { name: 'Nagpur APMC (Maharashtra)', min: 4400, modal: 4720, max: 5010, arrivals: '6,200 Qtl', distance: '390 km' }
    ],
    priceChange7d: -0.6,
    trend7d: [4690, 4680, 4660, 4640, 4630, 4640, 4650],
    arrivalStatus: 'Weak Edible Oil Import Pressure',
    seasonalFactor: 'Cheap imported palm and sunflower oil depressing domestic crush margins.',
    decision: 'WAIT',
    confidence: 85,
    timeHorizon: 'Wait 30 Days (Hold in Godown)',
    guidance: {
      en: 'Market price ₹4,650 is ₹242 below MSP (₹4,892). Central govt recently hiked import duty on crude palm/soya oil by 20%, which will gradually lift domestic mandi prices by ₹300–400/qtl in 3–4 weeks.',
      hi: 'सोयाबीन ₹4,650 पर है जो एमएसपी से ₹242 कम है। सरकार ने खाद्य तेलों पर आयात शुल्क बढ़ा दिया है, जिसका असर अगले महीने दिखेगा और भाव ₹5,000 तक पहुंचेंगे। धैर्य रखें।',
      od: 'ସୋୟାବିନ୍ ଦର ₹୪,୬୫୦ ଅଛି ଯାହା ଏମଏସପି ଠାରୁ ₹୨୪୨ କମ୍। ସରକାର ଆମଦାନୀ ଶୁଳ୍କ ବୃଦ୍ଧି କରିଛନ୍ତି, ଆସନ୍ତା ମାସରେ ଦର ₹୫,୦୦୦ ଛୁଇଁବ। କିଛି ଦିନ ଅପେକ୍ଷା କରନ୍ତୁ।'
    },
    actionPoints: [
      'Avoid selling in spot mandis right now',
      'Keep moisture below 10% to prevent seed rancidity and fungal heating'
    ]
  },
  {
    id: 'mustard',
    name: 'Mustard / Rapeseed',
    vernacularHindi: 'सरसों / राई',
    vernacularOdia: 'ସୋରିଷ',
    scientificName: 'Brassica juncea',
    category: 'oilseeds',
    icon: '🌻',
    unit: '₹ / Quintal',
    msp2024: 5950, // Rabi 2024-25 / 2025-26
    mspPrev: 5650,
    state: 'rajasthan',
    primaryMandi: 'Bharatpur APMC, Rajasthan',
    mandis: [
      { name: 'Bharatpur Mandi (Rajasthan)', min: 5800, modal: 6180, max: 6450, arrivals: '8,200 Qtl', distance: 'Local' },
      { name: 'Alwar Mandi (Rajasthan)', min: 5750, modal: 6120, max: 6400, arrivals: '6,400 Qtl', distance: '95 km' },
      { name: 'Jaipur APMC (Rajasthan)', min: 5850, modal: 6240, max: 6510, arrivals: '7,100 Qtl', distance: '180 km' },
      { name: 'Cuttack Malgodown (Odisha)', min: 6100, modal: 6450, max: 6800, arrivals: '850 Qtl', distance: '1,150 km' }
    ],
    priceChange7d: +2.8,
    trend7d: [6010, 6040, 6080, 6110, 6140, 6160, 6180],
    arrivalStatus: 'High Mustard Oil Mill Crushing',
    seasonalFactor: 'Robust winter and festive consumption driving high oil recovery premium.',
    decision: 'HOLD',
    confidence: 82,
    timeHorizon: 'Hold for 10–14 Days',
    guidance: {
      en: 'Mustard is trading at ₹6,180 (+₹230 over MSP). Oil expellers in Rajasthan, Haryana, and UP are running at full capacity with strong buyer competition. Price trajectory pointing towards ₹6,350.',
      hi: 'सरसों ₹6,180 पर बिक रही है (एमएसपी से ₹230 ऊपर)। तेल मिलों में भारी मांग है, अगले 10-14 दिनों में भाव ₹6,350 तक पहुंचने का अनुमान है।',
      od: 'ସୋରିଷ ଦର ₹୬,୧୮୦ ଅଛି (ଏମଏସପି ଠାରୁ ₹୨୩୦ ଅଧିକ)। ତେଲ ମିଲ୍ ଗୁଡ଼ିକରୁ ବହୁତ ଚାହିଦା ଅଛି, ଆଗାମୀ ୧୦-୧୪ ଦିନରେ ଦର ₹୬,୩୫୦ ହୋଇପାରେ।'
    },
    actionPoints: [
      'Test oil content (ideal >40% fetches ₹100–150 premium)',
      'Monitor NAFED procurement counter rates in nearby mandis'
    ]
  },
  {
    id: 'groundnut',
    name: 'Groundnut / Peanut (Pod)',
    vernacularHindi: 'मूंगफली (छिलके सहित)',
    vernacularOdia: 'ଚିନାବାଦାମ',
    scientificName: 'Arachis hypogaea',
    category: 'oilseeds',
    icon: '🥜',
    unit: '₹ / Quintal',
    msp2024: 6783,
    mspPrev: 6377,
    state: 'gujarat',
    primaryMandi: 'Rajkot APMC, Gujarat',
    mandis: [
      { name: 'Rajkot APMC (Gujarat)', min: 6600, modal: 7150, max: 7650, arrivals: '15,200 Qtl', distance: 'Local' },
      { name: 'Gondal Mandi (Gujarat)', min: 6650, modal: 7220, max: 7720, arrivals: '12,800 Qtl', distance: '38 km' },
      { name: 'Bhubaneswar RMC (Odisha)', min: 6700, modal: 7290, max: 7800, arrivals: '1,100 Qtl', distance: '1,650 km' }
    ],
    priceChange7d: +3.4,
    trend7d: [6910, 6950, 7010, 7060, 7100, 7120, 7150],
    arrivalStatus: 'Strong Export Demand (HPS / Bold)',
    seasonalFactor: 'High export shipments to Southeast Asia and strong oil extraction margins.',
    decision: 'SELL_NOW',
    confidence: 90,
    timeHorizon: 'Next 5–7 Days',
    guidance: {
      en: 'Groundnut is trading at ₹7,150 — ₹367 above MSP! Bold confectionery quality pods are commanding up to ₹7,650. Sell now to capture prime export window before global seasonals shift.',
      hi: 'मूंगफली ₹7,150 पर बिक रही है (एमएसपी से ₹367 ऊपर)। बोल्ड और एक्सपोर्ट क्वालिटी की मूंगफली ₹7,650 तक जा रही है। वर्तमान में बेचना सर्वोत्तम है।',
      od: 'ଚିନାବାଦାମ ଦର ₹୭,୧୫୦ ଅଛି (ଏମଏସପି ଠାରୁ ₹୩୬୭ ଅଧିକ)। ରପ୍ତାନି କ୍ୱାଲିଟି ବାଦାମ ପାଇଁ ଉଚ୍ଚ ମୂଲ୍ୟ ମିଳୁଛି। ଏବେ ବିକ୍ରି କରିବା ଲାଭଜନକ।'
    },
    actionPoints: [
      'Sun dry pods thoroughly to achieve moisture below 8%',
      'Separate single-seeded and broken pods for best grading'
    ]
  },
  {
    id: 'tomato',
    name: 'Tomato (Hybrid / Desi)',
    vernacularHindi: 'टमाटर (हाइब्रिड / देसी)',
    vernacularOdia: 'ଟମାଟୋ',
    scientificName: 'Solanum lycopersicum',
    category: 'vegetables',
    icon: '🍅',
    unit: '₹ / Quintal',
    msp2024: null, // Perishable: No MSP
    mspBenchmarkEstimated: 1400, // Cost of production benchmark
    state: 'odisha',
    primaryMandi: 'Cuttack Chhatrabazar, Odisha',
    mandis: [
      { name: 'Cuttack Chhatrabazar (Odisha)', min: 1800, modal: 2400, max: 2900, arrivals: '1,800 Qtl', distance: 'Local' },
      { name: 'Bhubaneswar RMC (Odisha)', min: 1900, modal: 2450, max: 3000, arrivals: '2,200 Qtl', distance: '28 km' },
      { name: 'Kolar APMC (Karnataka)', min: 2100, modal: 2650, max: 3200, arrivals: '14,000 Qtl', distance: '1,200 km' },
      { name: 'Azadpur Mandi (Delhi)', min: 2200, modal: 2750, max: 3400, arrivals: '22,000 Qtl', distance: '1,480 km' }
    ],
    priceChange7d: +14.2,
    trend7d: [2100, 2150, 2220, 2280, 2340, 2380, 2400],
    arrivalStatus: 'Tight Regional Supply / Weather Impact',
    seasonalFactor: 'Heat and localized rain in South India delayed second picking; high restaurant demand.',
    decision: 'SELL_NOW',
    confidence: 93,
    timeHorizon: 'Sell Immediately (1–2 Days)',
    guidance: {
      en: 'Tomato prices have rallied +14.2% to ₹2,400/qtl (₹24/kg wholesale). Being highly perishable, do NOT hold beyond optimal maturity. Harvest at breakers/turning stage and dispatch immediately.',
      hi: 'टमाटर के भाव 14.2% उछलकर ₹2,400 प्रति क्विंटल (₹24/किलो थोक) हो चुके हैं। खराब होने वाली फसल होने के कारण बिल्कुल न रोकें, तुरंत मंडियों में बेचें।',
      od: 'ଟମାଟୋ ଦର ୧୪.୨% ବୃଦ୍ଧି ପାଇ ₹୨,୪୦୦ ପ୍ରତି କ୍ୱିଣ୍ଟାଲ (₹୨୪/କିଲୋ) ହୋଇଛି। ଶୀଘ୍ର ନଷ୍ଟ ହେଉଥିବା ଫସଲ ହୋଇଥିବାରୁ ବିଳମ୍ବ ନକରି ତୁରନ୍ତ ବିକ୍ରି କରନ୍ତୁ।'
    },
    actionPoints: [
      'Pack in plastic crates instead of wooden boxes to minimize transit crush loss',
      'Harvest early in the morning when ambient temperature is cool',
      'Grade by ripeness (green-breaker for distance, pink-red for local)'
    ]
  },
  {
    id: 'potato',
    name: 'Potato (Jyoti / Pukhraj)',
    vernacularHindi: 'आलू (ज्योति / पुखराज)',
    vernacularOdia: 'ଆଳୁ',
    scientificName: 'Solanum tuberosum',
    category: 'vegetables',
    icon: '🥔',
    unit: '₹ / Quintal',
    msp2024: null,
    mspBenchmarkEstimated: 950,
    state: 'uttar-pradesh',
    primaryMandi: 'Agra APMC, Uttar Pradesh',
    mandis: [
      { name: 'Agra APMC (UP)', min: 1100, modal: 1350, max: 1550, arrivals: '28,000 Qtl', distance: 'Local' },
      { name: 'Aligarh Mandi (UP)', min: 1080, modal: 1320, max: 1510, arrivals: '14,500 Qtl', distance: '85 km' },
      { name: 'Cuttack Malgodown (Odisha)', min: 1450, modal: 1720, max: 1950, arrivals: '4,200 Qtl', distance: '1,100 km' },
      { name: 'Azadpur Mandi (Delhi)', min: 1200, modal: 1420, max: 1680, arrivals: '32,000 Qtl', distance: '210 km' }
    ],
    priceChange7d: -2.1,
    trend7d: [1380, 1370, 1360, 1355, 1350, 1345, 1350],
    arrivalStatus: 'Cold Storage Loading Peak',
    seasonalFactor: 'Arrivals from main crop harvest tapering; shifting into cold storage buffers.',
    decision: 'HOLD',
    confidence: 81,
    timeHorizon: 'Store in Cold Storage for 60–90 Days',
    guidance: {
      en: 'Current farmgate price ₹1,350 is stable. Farmers with access to cold storage subsidies should store potatoes now; historical rates routinely appreciate to ₹1,800–2,200/qtl during peak monsoon (July–Sept).',
      hi: 'वर्तमान भाव ₹1,350 सामान्य है। जिन किसानों के पास कोल्ड स्टोरेज की सुविधा है, वे आलू भंडारित करें; मानसून (जुलाई-सितंबर) में भाव ₹1,800 से ₹2,200 तक जाने का इतिहास रहा है।',
      od: 'ବର୍ତ୍ତମାନ ଆଳୁ ଦର ₹୧,୩୫୦ ଅଛି। ଯଦି କୋଲ୍ଡ ଷ୍ଟୋରେଜ୍ ସୁବିଧା ଅଛି, ତେବେ ବର୍ତ୍ତମାନ ସାଇତି ରଖନ୍ତୁ; ବର୍ଷା ଦିନେ (ଜୁଲାଇ-ସେପ୍ଟେମ୍ବର) ଦର ₹୧,୮୦୦-୨,୨୦୦ ପର୍ଯ୍ୟନ୍ତ ବୃଦ୍ଧି ପାଇଥାଏ।'
    },
    actionPoints: [
      'Cure tubers in shade for 10 days to toughen skin before cold room entry',
      'Avail NHM (National Horticulture Mission) cold storage rent subsidy',
      'Grade by size: Medium tubers (45-55mm) fetch premium from seed buyers'
    ]
  },
  {
    id: 'onion',
    name: 'Onion (Nashik Red / Rabi)',
    vernacularHindi: 'प्याज (नासिक लाल)',
    vernacularOdia: 'ପିଆଜ',
    scientificName: 'Allium cepa',
    category: 'vegetables',
    icon: '🧅',
    unit: '₹ / Quintal',
    msp2024: null,
    mspBenchmarkEstimated: 1200,
    state: 'maharashtra',
    primaryMandi: 'Lasalgaon APMC, Maharashtra',
    mandis: [
      { name: 'Lasalgaon Mandi (Maharashtra)', min: 1450, modal: 1850, max: 2250, arrivals: '32,000 Qtl', distance: 'Local' },
      { name: 'Pimpalgaon APMC (Maharashtra)', min: 1500, modal: 1900, max: 2300, arrivals: '28,000 Qtl', distance: '32 km' },
      { name: 'Bhubaneswar RMC (Odisha)', min: 2100, modal: 2600, max: 3100, arrivals: '3,800 Qtl', distance: '1,450 km' },
      { name: 'Azadpur Mandi (Delhi)', min: 1800, modal: 2250, max: 2700, arrivals: '24,000 Qtl', distance: '1,220 km' }
    ],
    priceChange7d: +6.3,
    trend7d: [1740, 1760, 1790, 1810, 1830, 1845, 1850],
    arrivalStatus: 'Export Opening & Buffer Procurement',
    seasonalFactor: 'Govt lifted minimum export price (MEP); NCCF/NAFED buying for price stabilization buffer.',
    decision: 'SELL_NOW',
    confidence: 89,
    timeHorizon: 'Next 7–10 Days',
    guidance: {
      en: 'With onion export bans lifted, wholesale prices in Lasalgaon have climbed to ₹1,850/qtl (and ₹2,600 in consumer states like Odisha). Selling now avoids humidity storage weight loss (15–20% rot).',
      hi: 'प्याज निर्यात शुल्क हटने के बाद लासलगांव में भाव ₹1,850 और ओडिशा में ₹2,600 तक पहुंच गए हैं। नमी में 20% सड़न के नुकसान से बचने के लिए अभी बेचना बुद्धिमानी है।',
      od: 'ପିଆଜ ରପ୍ତାନି ଖୋଲିବା ପରେ ଲାସଲଗାଓଁରେ ଦର ₹୧,୮୫୦ ଓ ଓଡ଼ିଶାରେ ₹୨,୬୦୦ ହୋଇଛି। ପିଆଜ ପଚିବା ନଷ୍ଟକୁ ଏଡ଼ାଇବା ପାଇଁ ଏବେ ବିକ୍ରି କରନ୍ତୁ।'
    },
    actionPoints: [
      'Sell dry, double-skinned bulbs first to avoid storage rotting (sprouting)',
      'Consider transporting to consumer destination markets like Cuttack/Bhubaneswar for ₹600–700 arbitrage spread'
    ]
  },
  {
    id: 'chilli',
    name: 'Green Chilli (Teja / Guntur)',
    vernacularHindi: 'हरी मिर्च (तेजा / गुंटूर)',
    vernacularOdia: 'କଞ୍ଚା ଲଙ୍କା',
    scientificName: 'Capsicum annuum',
    category: 'vegetables',
    icon: '🌶️',
    unit: '₹ / Quintal',
    msp2024: null,
    mspBenchmarkEstimated: 3500,
    state: 'andhra-pradesh',
    primaryMandi: 'Guntur APMC, Andhra Pradesh',
    mandis: [
      { name: 'Guntur APMC (AP)', min: 4800, modal: 5600, max: 6800, arrivals: '8,400 Qtl', distance: 'Local' },
      { name: 'Khammam Mandi (Telangana)', min: 4600, modal: 5450, max: 6500, arrivals: '5,200 Qtl', distance: '120 km' },
      { name: 'Cuttack Chhatrabazar (Odisha)', min: 5500, modal: 6400, max: 7500, arrivals: '950 Qtl', distance: '680 km' }
    ],
    priceChange7d: +8.5,
    trend7d: [5160, 5220, 5310, 5420, 5500, 5550, 5600],
    arrivalStatus: 'Spicy Demand from Processors & Oleoresin Units',
    seasonalFactor: 'Export demand strong from Gulf & Sri Lanka for high-capsaicin varieties.',
    decision: 'SELL_NOW',
    confidence: 91,
    timeHorizon: 'Next 3–5 Days',
    guidance: {
      en: 'Exceptional prices at ₹5,600/qtl wholesale in Guntur (and ₹6,400 in Odisha). Hot weather has lowered picking yield across peninsular India, creating strong pricing leverage for farmers.',
      hi: 'गुंटूर में भाव ₹5,600 और ओडिशा में ₹6,400 तक पहुंचे हैं। गर्मी के कारण उत्पादन में कमी से किसानों को मजबूत भाव मिल रहा है। तुरंत तुड़ाई कर बेचें।',
      od: 'ଗୁଣ୍ଟୁରରେ ଦର ₹୫,୬୦୦ ଓ ଓଡ଼ିଶାରେ ₹୬,୪୦୦ ଛୁଇଁଛି। ଅମଳ କମିଥିବାରୁ ଚାଷୀମାନଙ୍କୁ ଭଲ ଦର ମିଳୁଛି। ଶୀଘ୍ର ତୋଳି ବଜାରକୁ ପଠାନ୍ତୁ।'
    },
    actionPoints: [
      'Pack in aerated jute sacks or ventilated mesh crates',
      'Do not wash chillies before long-distance transport'
    ]
  },
  {
    id: 'cotton',
    name: 'Cotton (Medium Staple / Bt)',
    vernacularHindi: 'कपास (मध्यम रेशा / बीटी)',
    vernacularOdia: 'କପା',
    scientificName: 'Gossypium hirsutum',
    category: 'commercial',
    icon: '☁️',
    unit: '₹ / Quintal',
    msp2024: 7121,
    mspPrev: 6620,
    state: 'odisha',
    primaryMandi: 'Balangir Mandi, Odisha',
    mandis: [
      { name: 'Balangir Mandi (Odisha)', min: 7250, modal: 7680, max: 8150, arrivals: '3,800 Qtl', distance: 'Local' },
      { name: 'Rayagada APMC (Odisha)', min: 7200, modal: 7610, max: 8080, arrivals: '2,900 Qtl', distance: '160 km' },
      { name: 'Rajkot APMC (Gujarat)', min: 7400, modal: 7850, max: 8350, arrivals: '14,000 Qtl', distance: '1,450 km' },
      { name: 'Warangal Mandi (Telangana)', min: 7350, modal: 7750, max: 8250, arrivals: '8,600 Qtl', distance: '620 km' }
    ],
    priceChange7d: +2.1,
    trend7d: [7520, 7550, 7580, 7610, 7640, 7660, 7680],
    arrivalStatus: 'Active CCI & Spinning Mill Procurement',
    seasonalFactor: 'Cotton Corporation of India (CCI) support price operations active.',
    decision: 'SELL_NOW',
    confidence: 87,
    timeHorizon: 'Next 7–10 Days',
    guidance: {
      en: 'Cotton is trading at ₹7,680/qtl — ₹559 above MSP (₹7,121). Balangir and Kalahandi farmers are receiving direct electronic payments with minimal ginning deductions.',
      hi: 'कपास ₹7,680 प्रति क्विंटल पर है जो एमएसपी से ₹559 अधिक है। कताई मिलों से अच्छी मांग के चलते अभी बेचना फायदेमंद है।',
      od: 'କପା ଦର ₹୭,୬୮୦ ଅଛି ଯାହା ଏମଏସପି ଠାରୁ ₹୫୫୯ ଅଧିକ। ବଲାଙ୍ଗୀର ଓ ରାୟଗଡ଼ାରେ ମିଲ୍ କର୍ତ୍ତୃପକ୍ଷ ଉଚ୍ଚ ମୂଲ୍ୟ ଦେଉଛନ୍ତି, ଏବେ ବିକ୍ରି କରନ୍ତୁ।'
    },
    actionPoints: [
      'Moisture must be below 8% to prevent ginning penalty',
      'Keep lint free of yellow stains and trash content (<3%)'
    ]
  },
  {
    id: 'sugarcane',
    name: 'Sugarcane (FRP Mill Gate)',
    vernacularHindi: 'गन्ना (उचित और लाभकारी मूल्य)',
    vernacularOdia: 'ଆଖୁ',
    scientificName: 'Saccharum officinarum',
    category: 'commercial',
    icon: '🎋',
    unit: '₹ / Quintal',
    msp2024: 340, // FRP per qtl
    mspPrev: 315,
    state: 'uttar-pradesh',
    primaryMandi: 'Muzaffarnagar Mill Gate, UP',
    mandis: [
      { name: 'Muzaffarnagar Mill Gate (UP)', min: 360, modal: 390, max: 415, arrivals: '45,000 Qtl', distance: 'Local' },
      { name: 'Aska Cooperative Sugar Mill (Odisha)', min: 345, modal: 375, max: 395, arrivals: '12,000 Qtl', distance: '550 km' },
      { name: 'Kolhapur Sugar Belt (Maharashtra)', min: 355, modal: 385, max: 410, arrivals: '38,000 Qtl', distance: '1,350 km' }
    ],
    priceChange7d: +1.3,
    trend7d: [385, 386, 387, 388, 388, 389, 390],
    arrivalStatus: 'Full Crushing Season Operations',
    seasonalFactor: 'Mills competing to finish crushing calendar before summer heat drops juice brix.',
    decision: 'SELL_NOW',
    confidence: 95,
    timeHorizon: 'Deliver as per Mill Indent Slip (Parchi)',
    guidance: {
      en: 'State Advisory Price (SAP) & FRP deliver ₹390/qtl (₹50 above base FRP). Harvest immediately as per cane slip to avoid cane drying and sucrose weight loss.',
      hi: 'गन्ने का भाव ₹390 प्रति क्विंटल (एफआरपी से ₹50 अधिक) है। वजन घटने से बचने के लिए पर्ची मिलते ही तुरंत कटाई कर मिल भेजें।',
      od: 'ଆଖୁ ଦର ₹୩୯୦ ପ୍ରତି କ୍ୱିଣ୍ଟାଲ (ଏଫଆରପି ଠାରୁ ₹୫୦ ଅଧିକ) ରହିଛି। ରସ ଶୁଖି ଓଜନ କମିବା ପୂର୍ବରୁ ଚିନି ମିଲ୍କୁ ତୁରନ୍ତ ଯୋଗାଣ କରନ୍ତୁ।'
    },
    actionPoints: [
      'Transport within 24 hours of cutting to maintain maximum sucrose recovery',
      'Remove binding leaves and roots cleanly to prevent deduction'
    ]
  },
  {
    id: 'bajra',
    name: 'Bajra / Pearl Millet',
    vernacularHindi: 'बाजरा',
    vernacularOdia: 'ବାଜରା',
    scientificName: 'Pennisetum glaucum',
    category: 'cereals',
    icon: '🌾',
    unit: '₹ / Quintal',
    msp2024: 2625,
    mspPrev: 2500,
    state: 'rajasthan',
    primaryMandi: 'Jaipur APMC, Rajasthan',
    mandis: [
      { name: 'Jaipur APMC (Rajasthan)', min: 2450, modal: 2680, max: 2890, arrivals: '7,400 Qtl', distance: 'Local' },
      { name: 'Alwar Mandi (Rajasthan)', min: 2420, modal: 2640, max: 2850, arrivals: '5,600 Qtl', distance: '110 km' },
      { name: 'Sambalpur Mandi (Odisha)', min: 2550, modal: 2750, max: 2950, arrivals: '800 Qtl', distance: '1,280 km' }
    ],
    priceChange7d: +2.3,
    trend7d: [2620, 2630, 2640, 2650, 2660, 2670, 2680],
    arrivalStatus: 'Shree Anna / Millet Mission Push',
    seasonalFactor: 'Odisha Millet Mission and National Food Security buffer procurement supporting prices.',
    decision: 'HOLD',
    confidence: 80,
    timeHorizon: 'Hold for 10–15 Days',
    guidance: {
      en: 'Trading at ₹2,680/qtl (+₹55 above MSP). Institutional millet procurement programs are expanding; holding for 2 weeks will capture government procurement bonus.',
      hi: 'बाजरा ₹2,680 प्रति क्विंटल पर बिक रहा है (एमएसपी से ₹55 ऊपर)। मिलेट मिशन खरीद से भाव और सुधरने की उम्मीद है, थोड़ा इंतजार करें।',
      od: 'ବାଜରା ଦର ₹୨,୬୮୦ ଅଛି (ଏମଏସପି ଠାରୁ ₹୫୫ ଅଧିକ)। ମିଲେଟ୍ ମିଶନର ଖରିଦ କାରଣରୁ ଆଗକୁ ଆହୁରି ଭଲ ଦର ମିଳିପାରେ।'
    },
    actionPoints: [
      'Clean to remove chaff and small stones for Shree Anna certification bonus',
      'Check Odisha Millet Mission procurement counters at block level'
    ]
  },
  {
    id: 'urad',
    name: 'Urad (Black Gram)',
    vernacularHindi: 'उड़द दाल',
    vernacularOdia: 'ବିରି ଡାଲି',
    scientificName: 'Vigna mungo',
    category: 'pulses',
    icon: '🫘',
    unit: '₹ / Quintal',
    msp2024: 7400,
    mspPrev: 6950,
    state: 'madhya-pradesh',
    primaryMandi: 'Jabalpur APMC, Madhya Pradesh',
    mandis: [
      { name: 'Jabalpur APMC (MP)', min: 7800, modal: 8450, max: 9100, arrivals: '3,200 Qtl', distance: 'Local' },
      { name: 'Latur Mandi (Maharashtra)', min: 7900, modal: 8520, max: 9200, arrivals: '4,600 Qtl', distance: '540 km' },
      { name: 'Cuttack Malgodown (Odisha)', min: 8200, modal: 8850, max: 9450, arrivals: '1,100 Qtl', distance: '780 km' }
    ],
    priceChange7d: +4.3,
    trend7d: [8100, 8160, 8220, 8300, 8360, 8400, 8450],
    arrivalStatus: 'Extremely Tight Supply',
    seasonalFactor: 'Domestic crop was affected by late monsoon rains; mills actively seeking FAQ lots.',
    decision: 'SELL_NOW',
    confidence: 93,
    timeHorizon: 'Next 5–7 Days',
    guidance: {
      en: 'Urad has climbed to ₹8,450/qtl — ₹1,050 (+14.2%) above MSP! Sell now to secure lucrative returns before overseas shipments arrive at Mumbai/Chennai ports.',
      hi: 'उड़द ₹8,450 प्रति क्विंटल पर पहुंची है — एमएसपी से ₹1,050 (+14.2%) ऊपर! आयातित माल आने से पहले यह मुनाफा बुक करने का सबसे उत्तम मौका है।',
      od: 'ବିରି ଦର ₹୮,୪୫୦ ଛୁଇଁଛି — ଏମଏସପି ଠାରୁ ₹୧,୦୫୦ (+୧୪.୨%) ଅଧିକ! ବିଦେଶୀ ମାଲ୍ ଆସିବା ପୂର୍ବରୁ ଏବେ ବିକ୍ରି କରି ଉଚ୍ଚ ମୂଲ୍ୟ ପାଆନ୍ତୁ।'
    },
    actionPoints: [
      'Sort uniform dark black grains for premium daal millers',
      'Beware of moisture absorption in high humidity conditions'
    ]
  }
];

// ── Decision Engine Calculation ──────────────────────────────────────────────
export function evaluateCropDecision(crop) {
  const msp = crop.msp2024 || crop.mspBenchmarkEstimated || 0;
  const modal = crop.mandis[0]?.modal || 0;
  const spread = modal - msp;
  const spreadPercent = msp > 0 ? ((spread / msp) * 100).toFixed(1) : 0;

  const decision = crop.decision;
  const decisionBadge = {
    type: decision,
    label: decision === 'SELL_NOW' ? 'SELL NOW' : decision === 'HOLD' ? 'HOLD / MONITOR' : 'WAIT & STORE',
    color: decision === 'SELL_NOW' ? 'emerald' : decision === 'HOLD' ? 'amber' : 'rose',
    bg: decision === 'SELL_NOW' ? 'bg-emerald-500/15 text-emerald-800 border-emerald-500/30' : decision === 'HOLD' ? 'bg-amber-500/15 text-amber-800 border-amber-500/30' : 'bg-rose-500/15 text-rose-800 border-rose-500/30',
    dotColor: decision === 'SELL_NOW' ? 'bg-emerald-500' : decision === 'HOLD' ? 'bg-amber-500' : 'bg-rose-500'
  };

  return {
    ...crop,
    msp,
    modalPrice: modal,
    spread,
    spreadPercent,
    decisionBadge
  };
}

// ── Kisan Profit & Return Calculator ─────────────────────────────────────────
export function calculateKisanReturn({
  cropData,
  quantityQuintals = 20,
  targetMandiIndex = 0,
  transportCostPerQtl = 35,
  mandiCessPercent = 1.5,
  holdDurationMonths = 1,
  warehouseRentPerBagMonth = 18 // standard WDRA rent ₹18/bag (50kg bag -> ₹36/qtl)
}) {
  const mandi = cropData.mandis[targetMandiIndex] || cropData.mandis[0];
  const modalRate = mandi.modal;
  const mspRate = cropData.msp2024 || cropData.mspBenchmarkEstimated || modalRate;

  // Revenue calculations
  const grossMandiRevenue = modalRate * quantityQuintals;
  const grossMspRevenue = mspRate * quantityQuintals;
  const mspGainOrLoss = grossMandiRevenue - grossMspRevenue;

  // Deductions
  const totalTransport = transportCostPerQtl * quantityQuintals;
  const totalMandiCess = (grossMandiRevenue * mandiCessPercent) / 100;
  const netInHandImmediate = grossMandiRevenue - totalTransport - totalMandiCess;

  // Hold simulation
  const projectedGainRatePercent = cropData.decision === 'WAIT' ? 6.5 : cropData.decision === 'HOLD' ? 4.2 : -1.5;
  const projectedFutureRate = modalRate * (1 + projectedGainRatePercent / 100);
  const futureGrossRevenue = projectedFutureRate * quantityQuintals;

  // Warehouse rent (2 bags per quintal)
  const totalWarehouseRent = (quantityQuintals * 2) * warehouseRentPerBagMonth * holdDurationMonths;
  const netInHandFuture = futureGrossRevenue - totalTransport - totalMandiCess - totalWarehouseRent;
  const netHoldBenefit = netInHandFuture - netInHandImmediate;

  return {
    mandiName: mandi.name,
    modalRate,
    mspRate,
    quantityQuintals,
    grossMandiRevenue,
    grossMspRevenue,
    mspGainOrLoss,
    totalTransport,
    totalMandiCess,
    netInHandImmediate,
    projectedFutureRate: Math.round(projectedFutureRate),
    totalWarehouseRent,
    netInHandFuture: Math.round(netInHandFuture),
    netHoldBenefit: Math.round(netHoldBenefit),
    isHoldProfitable: netHoldBenefit > 0
  };
}
