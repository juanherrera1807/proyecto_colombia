/* import { createStore } from 'vuex';
import { auth } from '@/firebase/datos'; // Importa tu instancia de autenticación de Firebase

export default createStore({
  modules: {
    auth: {
      state: {
        usuario: null, // Almacena la información del usuario
        isLoggedIn: false, // Indica si el usuario está autenticado
      },
      mutations: {
        setUser(state, usuario) {
          state.usuario = usuario;
          state.isLoggedIn = true;
        },
        clearUser(state) {
          state.usuario = null;
          state.isLoggedIn = false;
        },
      },
      actions: {
        async login({ commit }, { email, password }) {
          try {
            // Inicia sesión con Firebase
            const userCredential = await auth.signInWithEmailAndPassword(email, password);
            const usuario = userCredential.user.displayName; // Esto depende de cómo almacenas el nombre del usuario en Firebase

            // Establece el usuario en Vuex
            commit('setUser', usuario);
          } catch (error) {
            // Maneja los errores de inicio de sesión aquí
            console.error('Error de inicio de sesión:', error);
            throw error; // Propaga el error para que puedas manejarlo en el componente
          }
        },
        async logout({ commit }) {
          try {
            // Cierra la sesión con Firebase
            await auth.signOut();

            // Borra la información del usuario en Vuex
            commit('clearUser');
          } catch (error) {
            // Maneja los errores de cierre de sesión aquí
            console.error('Error al cerrar sesión:', error);
            throw error; // Propaga el error para que puedas manejarlo en el componente
          }
        },
      },
      getters: {
        // Puedes definir getters si los necesitas
      },
    },
  },
});
 */

  // En tu archivo store.js o ventas.js
  import { defineStore } from 'pinia';


  export const useSedesEmpresa = defineStore({
    id: 'Sedes',
    state: () => ({
      SedesEmpresa: [], // Arreglo para almacenar los productos en el apartado de ventas


    }),
    actions: {
      agregarSede(sede) {
        this.SedesEmpresa.push(sede);
      },
      // Puedes agregar más acciones según tus necesidades, como eliminar producto, limpiar ventas, etc.
    },
  });

