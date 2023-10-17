<template>
  <v-app>
    <v-main>
      <div>
        <!-- Mostrar el componente de inicio de sesión si no está autenticado -->
        <div v-if="!isLoggedIn">
          <RegisterColombia @inicio-sesion-exitoso="iniciarSesion" />
        </div>
        
        <!-- Mostrar el componente del menú principal solo si está autenticado -->
        <div v-if="isLoggedIn">
          <MenuPrincipal @cerrar-sesion="cerrarSesion" />
        </div>
      </div>
    </v-main>
  </v-app>
</template>

<script>
import RegisterColombia from '../src/components/RegisterColombia.vue';
import MenuPrincipal from '../src/components/MenuPrincipal.vue'; // Importa el componente del menú principal

export default {
  name: 'App',

  components: {
    RegisterColombia,
    MenuPrincipal,
  },

  data: () => ({
    isLoggedIn: false, // Inicializa la variable isLoggedIn en false
  }),

  methods: {
    iniciarSesion() {
      // Cambia el valor de isLoggedIn a true cuando se inicia sesión
      this.isLoggedIn = true;
    },

    cerrarSesion() {
      // Realiza la lógica de cierre de sesión aquí (por ejemplo, reinicia variables, elimina tokens, etc.)

      // Cambia el valor de isLoggedIn a false para mostrar nuevamente el componente de inicio de sesión
      this.isLoggedIn = false;
    },
  },
};
</script>