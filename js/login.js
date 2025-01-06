// Importa Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-app.js";
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-auth.js";

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

// Elementos del formulario
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const loginBtn = document.getElementById("loginBtn");
const signupBtn = document.getElementById("signupBtn");

// Elemento de alerta
const alertContainer = document.getElementById("alert-container");

// Función para mostrar la alerta
function showAlert(message, type = "success") {
    alertContainer.textContent = message;
    alertContainer.classList.remove("alert-success", "alert-danger", "alert-warning");
    alertContainer.classList.add(`alert-${type}`);
    alertContainer.style.display = "block"; // Mostrar la alerta
    setTimeout(() => {
        alertContainer.style.display = "none"; // Ocultar la alerta después de 3 segundos
    }, 3000);
}

// Iniciar sesión
loginBtn.addEventListener("click", async () => {
    const email = emailInput.value;
    const password = passwordInput.value;

    try {
        await signInWithEmailAndPassword(auth, email, password);
        showAlert("Inicio de sesión exitoso");
        window.location.href = "start.html"; // Redirige al archivo start.html
    } catch (error) {
        showAlert("Error al iniciar sesión: " + error.message, "danger");
    }
});

// Registrarse
signupBtn.addEventListener("click", async () => {
    const email = emailInput.value;
    const password = passwordInput.value;

    try {
        await createUserWithEmailAndPassword(auth, email, password);
        showAlert("Usuario registrado exitosamente");
        window.location.href = "start.html"; // Redirige al archivo start.html
    } catch (error) {
        showAlert("Error al registrar: " + error.message, "danger");
    }
});

// Verificar si el usuario ya está autenticado
onAuthStateChanged(auth, (user) => {
    if (user) {
        window.location.href = "start.html"; // Redirige a start.html si ya está logueado
    }
});
