// Importa Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-app.js";
import { getFirestore, collection, getDocs, addDoc, deleteDoc, doc, updateDoc } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-firestore.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-auth.js";

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

// 1️⃣ Inicializar Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

// 2️⃣ Comprobar si el usuario está autenticado
onAuthStateChanged(auth, (user) => {
  if (user) {
    console.log("✅ Usuario autenticado:", user.email);
    fetchclientela(); // Cargar los datos de la base de datos
  } else {
    console.warn("❌ Usuario no autenticado. Redirigiendo a la página de inicio de sesión...");
    window.location.href = "index.html"; // Redirige si no hay sesión iniciada
  }
});

// 3️⃣ Referencias a los elementos DOM
const nombredelcliente = document.getElementById("nombredelcliente");
const createBtn = document.getElementById("create");
const clientTableBody = document.getElementById("clientTableBody");
const searchInput = document.getElementById("searchInput");
const toastContainer = document.getElementById("toastContainer");

// Función para mostrar toasts
function showToast(message, type = 'success') {
  const toast = document.createElement('div');
  toast.classList.add('toast', 'show', `bg-${type}`);
  toast.style.width = '250px';
  toast.innerHTML = `
    <div class="toast-body">
      ${message}
    </div>
  `;
  toastContainer.appendChild(toast);
  setTimeout(() => toast.classList.remove('show'), 3000);
}

// Función para agregar un cliente
async function addClient(name) {
  if (name) {
    try {
      const clientRef = await addDoc(collection(db, "clientela"), {
        nombredelcliente: name
      });
      nombredelcliente.value = '';  // Limpiar el campo
      fetchclientela();  // Actualizar la tabla
      showToast("Cliente agregado con éxito!");
    } catch (error) {
      console.error("Error agregando cliente: ", error);
      showToast("Error al agregar cliente.", 'danger');
    }
  } else {
    showToast("Por favor ingresa un nombre.", 'danger');
  }
}

// Función para obtener los clientes de Firestore
async function fetchclientela(searchTerm = '') {
  try {
    const querySnapshot = await getDocs(collection(db, "clientela"));
    const clientela = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    
    clientTableBody.innerHTML = ''; // Limpiar la tabla antes de mostrar los nuevos datos

    const filteredclientela = clientela.filter(client => 
      client.nombredelcliente && client.nombredelcliente.toLowerCase().includes(searchTerm.toLowerCase())
    );

    filteredclientela.forEach((client, index) => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${index + 1}</td>
        <td>${client.nombredelcliente}</td>
        <td>
          <button class="btn btn-info" data-id="${client.id}" data-name="${client.nombredelcliente}">Editar</button>
          <button class="btn btn-danger" data-id="${client.id}">Eliminar</button>
        </td>
      `;
      clientTableBody.appendChild(row);
    });

    // Asignar el evento de "Editar"
    document.querySelectorAll(".btn-info").forEach(button => {
      button.addEventListener("click", function() {
        const id = this.getAttribute("data-id");
        const name = this.getAttribute("data-name");
        editClientPrompt(id, name);
      });
    });

    // Asignar el evento de "Eliminar"
    document.querySelectorAll(".btn-danger").forEach(button => {
      button.addEventListener("click", function() {
        const id = this.getAttribute("data-id");
        deleteClient(id); // Llamada a deleteClient
      });
    });
  } catch (error) {
    console.error("Error al obtener los clientes: ", error);
    showToast("Error al cargar los clientes.", 'danger');
  }
}

// Función para mostrar el prompt de edición
function editClientPrompt(id, name) {
  const newName = prompt("Editar nombre del cliente:", name);  // Muestra un cuadro de texto para ingresar el nuevo nombre.

  if (newName && newName !== name) {  // Verifica que se haya ingresado un nuevo nombre y que no sea igual al anterior.
    updateClient(id, newName);  // Llama a una función para actualizar los datos en Firestore
  }
}

// Función para actualizar los datos del cliente en Firestore
async function updateClient(id, newName) {
  try {
    const clientRef = doc(db, "clientela", id);
    await updateDoc(clientRef, {
      nombredelcliente: newName
    });
    fetchclientela();  // Vuelve a cargar los clientes después de la actualización
    showToast("Cliente actualizado con éxito!");
  } catch (error) {
    console.error("Error actualizando cliente: ", error);
    showToast("Error al actualizar cliente.", 'danger');
  }
}

// Función para eliminar un cliente
async function deleteClient(id) {
  try {
    await deleteDoc(doc(db, "clientela", id));
    fetchclientela();  // Actualizar la tabla
    showToast("Cliente eliminado con éxito!");
  } catch (error) {
    console.error("Error eliminando cliente: ", error);
    showToast("Error al eliminar cliente.", 'danger');
  }
}

// Evento para buscar clientes
searchInput.addEventListener("input", (event) => {
  const searchTerm = event.target.value;
  fetchclientela(searchTerm);
});

// Asignar el evento inicial de "Agregar Cliente" al botón
createBtn.addEventListener("click", () => {
  const name = nombredelcliente.value.trim();
  addClient(name);
});

// Cargar clientes al inicio
fetchclientela();
