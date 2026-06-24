import { initializeApp } from "firebase/app";
import { getFirestore, collection, doc, setDoc } from "firebase/firestore";
import { mockBenefits } from "../data/mockBenefits";
import { mockUnits } from "../data/mockUnits";

// Verifica se as variáveis de ambiente foram carregadas
if (!process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID) {
  console.error("ERRO: Variáveis de ambiente do Firebase não encontradas.");
  console.error("Execute o script com: npx tsx --env-file=.env.local src/scripts/seed.ts");
  process.exit(1);
}

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function seedDatabase() {
  console.log("Iniciando o processo de seed no Firebase...");
  const benefitsCollection = collection(db, "benefits");
  
  let successCount = 0;
  let errorCount = 0;

  for (const benefit of mockBenefits) {
    try {
      // Usa o ID do mockBenefit como o ID do documento no Firestore
      const docRef = doc(benefitsCollection, benefit.id);
      
      // O setDoc vai sobrescrever o documento se ele já existir (merge: false por padrão)
      // Garantindo que nossos novos arrays de documents e steps sejam aplicados limpos
      await setDoc(docRef, benefit);
      
      console.log(`✅ Benefício inserido: ${benefit.title}`);
      successCount++;
    } catch (error) {
      console.error(`❌ Erro ao inserir ${benefit.title}:`, error);
      errorCount++;
    }
  }

  console.log("Semeando unidades físicas...");
  const facilitiesCollection = collection(db, "facilities");
  let facilitiesCount = 0;
  for (const unit of mockUnits) {
    try {
      const docRef = doc(facilitiesCollection, unit.id);
      await setDoc(docRef, unit);
      console.log(`✅ Unidade inserida: ${unit.name}`);
      facilitiesCount++;
    } catch (error) {
      console.error(`❌ Erro ao inserir ${unit.name}:`, error);
      errorCount++;
    }
  }

  console.log("-----------------------------------------");
  console.log("Seed concluído!");
  console.log(`Benefícios inseridos com sucesso: ${successCount}`);
  console.log(`Unidades inseridas com sucesso: ${facilitiesCount}`);
  console.log(`Total de falhas: ${errorCount}`);
  process.exit(0);
}

seedDatabase();
