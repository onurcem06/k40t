import { db } from '../firebase';
import { ref, get, child } from 'firebase/database';

async function checkServices() {
    console.log("Checking Services in Firebase...");
    const dbRef = ref(db);
    try {
        const snapshot = await get(child(dbRef, 'siteContent/services'));
        if (snapshot.exists()) {
            console.log(JSON.stringify(snapshot.val(), null, 2));
        } else {
            console.log("No services found.");
        }
        process.exit(0);
    } catch (error) {
        console.error("Error reading services:", error);
        process.exit(1);
    }
}

checkServices();
