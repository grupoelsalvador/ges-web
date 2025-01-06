// Importa Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-app.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-auth.js";
import { getFirestore, doc, getDoc } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-firestore.js";

// Configuración de Firebase
const firebaseConfig = {
  apiKey: "AIzaSyDomcoN85Ehas3A55S8txtlw6OTSY1v2bk",
  authDomain: "ges-grupo.firebaseapp.com",
  projectId: "ges-grupo",
  storageBucket: "ges-grupo.firebasestorage.app",
  messagingSenderId: "356789219961",
  appId: "1:356789219961:web:9afba5766ea9ad1ac15aa8",
  measurementId: "G-1L39928RBK"
};


// Inicializar Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Referencia al mensaje de bienvenida
const welcomeMessage = document.getElementById("welcomeMessage");

// Detectar el estado de autenticación
onAuthStateChanged(auth, async (user) => {
  if (user) {
    // Si el usuario está autenticado, obtener su información de Firestore
    const userDoc = doc(db, "usuarios", user.uid);
    const userSnapshot = await getDoc(userDoc);

    if (userSnapshot.exists()) {
      const userData = userSnapshot.data();
      welcomeMessage.textContent = `¡Hola, ${userData.nombre}! Bienvenido a GES.`;
    } else {
      welcomeMessage.textContent = "Usuario no encontrado.";
    }
  } else {
    // Si no está autenticado, redirigir a la página de inicio de sesión
    welcomeMessage.textContent = "No has iniciado sesión. Redirigiendo...";
    setTimeout(() => {
      window.location.href = "login.html"; // Cambia esto a tu página de inicio de sesión
    }, 2000);
  }
});

// Cerrar sesión
const logoutButton = document.getElementById("logoutButton");
logoutButton.addEventListener("click", async () => {
  try {
    await signOut(auth);
    alert("Sesión cerrada exitosamente.");
    window.location.href = "login.html"; // Redirige a la página de inicio de sesión
  } catch (error) {
    console.error("Error al cerrar sesión:", error);
    alert("Hubo un problema al cerrar sesión.");
  }
});
