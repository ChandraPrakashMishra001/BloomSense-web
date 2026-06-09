import { collection, addDoc } from 'firebase/firestore';
import { db } from './src/firebase.js';

const data = [
  { disease_name: 'Rice Blast', confidence_score: 91, crop_type: 'Rice', latitude: 21.4669, longitude: 83.9812, source: 'amania_cloud', created_at: '2026-03-20T08:23:00' },
  { disease_name: 'Rice Blast', confidence_score: 88, crop_type: 'Rice', latitude: 21.4721, longitude: 83.9756, source: 'amania_cloud', created_at: '2026-03-21T09:15:00' },
  { disease_name: 'Brown Plant Hopper', confidence_score: 79, crop_type: 'Rice', latitude: 21.4598, longitude: 83.9901, source: 'local_library', created_at: '2026-03-22T07:44:00' },
  { disease_name: 'Sheath Blight', confidence_score: 85, crop_type: 'Rice', latitude: 20.4625, longitude: 85.8830, source: 'amania_cloud', created_at: '2026-03-22T10:30:00' },
  { disease_name: 'Sheath Blight', confidence_score: 82, crop_type: 'Rice', latitude: 20.4701, longitude: 85.8912, source: 'local_library', created_at: '2026-03-23T08:10:00' },
  { disease_name: 'Leaf Folder', confidence_score: 77, crop_type: 'Rice', latitude: 20.4550, longitude: 85.8778, source: 'amania_cloud', created_at: '2026-03-23T11:22:00' },
  { disease_name: 'Powdery Mildew', confidence_score: 83, crop_type: 'Wheat', latitude: 20.2961, longitude: 85.8189, source: 'amania_cloud', created_at: '2026-03-24T09:05:00' },
  { disease_name: 'Bacterial Blight', confidence_score: 90, crop_type: 'Rice', latitude: 20.3021, longitude: 85.8245, source: 'local_library', created_at: '2026-03-24T14:33:00' },
  { disease_name: 'Rice Blast', confidence_score: 93, crop_type: 'Rice', latitude: 20.7167, longitude: 83.4833, source: 'amania_cloud', created_at: '2026-03-25T07:55:00' },
  { disease_name: 'Stem Rot', confidence_score: 81, crop_type: 'Rice', latitude: 20.7210, longitude: 83.4901, source: 'local_library', created_at: '2026-03-25T10:18:00' },
  { disease_name: 'Late Blight', confidence_score: 87, crop_type: 'Potato', latitude: 18.8135, longitude: 82.7110, source: 'amania_cloud', created_at: '2026-03-26T08:40:00' },
  { disease_name: 'Leaf Curl', confidence_score: 76, crop_type: 'Tomato', latitude: 18.8190, longitude: 82.7055, source: 'local_library', created_at: '2026-03-26T12:15:00' },
  { disease_name: 'Rice Blast', confidence_score: 89, crop_type: 'Rice', latitude: 21.9522, longitude: 86.7322, source: 'amania_cloud', created_at: '2026-03-27T07:30:00' },
  { disease_name: 'Brown Spot', confidence_score: 84, crop_type: 'Rice', latitude: 21.9478, longitude: 86.7401, source: 'local_library', created_at: '2026-03-27T09:45:00' },
  { disease_name: 'Downy Mildew', confidence_score: 80, crop_type: 'Vegetables', latitude: 19.3870, longitude: 84.9750, source: 'amania_cloud', created_at: '2026-03-28T08:20:00' },
  { disease_name: 'Fusarium Wilt', confidence_score: 86, crop_type: 'Tomato', latitude: 19.3920, longitude: 84.9810, source: 'local_library', created_at: '2026-03-28T11:05:00' },
  { disease_name: 'Rice Blast', confidence_score: 92, crop_type: 'Rice', latitude: 22.1167, longitude: 84.0333, source: 'amania_cloud', created_at: '2026-03-29T07:15:00' },
  { disease_name: 'Neck Rot', confidence_score: 78, crop_type: 'Rice', latitude: 22.1210, longitude: 84.0389, source: 'local_library', created_at: '2026-03-29T10:30:00' },
  { disease_name: 'Bacterial Leaf Blight', confidence_score: 88, crop_type: 'Rice', latitude: 19.8135, longitude: 85.8312, source: 'amania_cloud', created_at: '2026-03-29T08:55:00' },
  { disease_name: 'Sheath Blight', confidence_score: 83, crop_type: 'Rice', latitude: 19.8190, longitude: 85.8278, source: 'local_library', created_at: '2026-03-29T13:20:00' }
];

async function seed() {
  console.log('Seeding 20 scan records into diseasePoints collection...');
  let i = 0;
  for (const item of data) {
    // Map Supabase-style fields to existing typical Firebase mapping in App.jsx
    let severity = 'low';
    if (item.confidence_score >= 90) severity = 'high';
    else if (item.confidence_score >= 80) severity = 'medium';
    
    // Intensity mapping used for heatmap visual opacity/size
    const intensity = item.confidence_score / 100;
    
    // Convert created_at string to numeric ms timestamp
    const timestamp = new Date(item.created_at).getTime();

    // Randomize radius slightly to give variation on the map
    const radius = 800 + Math.random() * 800;

    await addDoc(collection(db, 'diseasePoints'), {
      lat: item.latitude,
      lng: item.longitude,
      disease: item.disease_name,
      severity,
      intensity,
      timestamp,
      radius,
      confidence_score: item.confidence_score,
      crop_type: item.crop_type,
      source: item.source
    });
    i++;
  }
  console.log('Successfully added ' + i + ' points!');
  process.exit(0);
}

seed().catch(err => {
  console.error(err);
  process.exit(1);
});
