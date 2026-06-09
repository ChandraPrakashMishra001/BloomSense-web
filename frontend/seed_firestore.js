import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAiawVZrk5pifFBoDuJSibbvuw0Kv3Yvcc",
  authDomain: "bloomsense-9cf96.firebaseapp.com",
  projectId: "bloomsense-9cf96",
  storageBucket: "bloomsense-9cf96.firebasestorage.app",
  messagingSenderId: "113263280584",
  appId: "1:113263280584:web:1d976e9833b94d00a680fd",
  measurementId: "G-LLGJ4EGW9W"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const diseases = ['Rice Blast', 'Bacterial Leaf Blight', 'Brown Spot', 'Sheath Blight', 'Tungro Virus'];
const severities = ['high', 'medium', 'low'];
const locations = [
  { lat: 20.2961, lng: 85.8245 }, // Bhubaneswar
  { lat: 20.4625, lng: 85.8830 }, // Cuttack
  { lat: 21.4669, lng: 83.9812 }, // Sambalpur
  { lat: 19.3150, lng: 84.7941 }, // Berhampur
  { lat: 22.2604, lng: 84.8536 }, // Rourkela
  { lat: 19.8135, lng: 85.8312 }, // Puri
  { lat: 21.4934, lng: 86.9240 }, // Balasore
  { lat: 21.9333, lng: 84.0500 }, // Jharsuguda
];

const generateData = () => {
    const data = [];
    for (let i = 0; i < 20; i++) {
        const center = locations[i % locations.length];
        
        // Add random scatter (approx ~10-30km radius around cities)
        const lat = center.lat + (Math.random() - 0.5) * 0.4;
        const lng = center.lng + (Math.random() - 0.5) * 0.4;
        
        const disease = diseases[Math.floor(Math.random() * diseases.length)];
        const severity = severities[Math.floor(Math.random() * severities.length)];
        const confidence_score = Math.floor(Math.random() * 21) + 80; // 80 - 100
        const intensity = confidence_score / 100; // Assuming intensity is normalized confidence
        const radius = Math.floor(Math.random() * 2500) + 1000; // 1000 to 3500 meters
        
        // Random timestamp within the last 7 days
        const msPerDay = 24 * 60 * 60 * 1000;
        const timestamp = Date.now() - Math.floor(Math.random() * (7 * msPerDay)); 

        data.push({ lat, lng, disease, severity, intensity, radius, timestamp, confidence_score });
    }
    return data;
};

const pilotData = generateData();

async function seedData() {
  console.log("Starting script to upload 20 pilot data points to Firebase Firestore...");
  const pointsCollection = collection(db, 'diseasePoints');
  for (const item of pilotData) {
    try {
      await addDoc(pointsCollection, item);
      console.log(`Successfully added: ${item.disease} at [${item.lat.toFixed(4)}, ${item.lng.toFixed(4)}] with ${item.confidence_score}% confidence`);
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  }
  console.log("Database seeded successfully with 20 records.");
  process.exit();
}

seedData();
