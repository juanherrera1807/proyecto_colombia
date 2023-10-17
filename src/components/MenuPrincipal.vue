<template>
  <v-card>
<v-layout>
  <v-app-bar
    color= blue
    prominent
  >
    <v-app-bar-nav-icon variant="text" @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
       
    <v-toolbar-title>
      <v-img src="../assets/logo_colombia.png" alt="Logo de Colombia Inkjet" width="50px" class="profile">
      </v-img>
    </v-toolbar-title>

    <v-spacer></v-spacer>
    <v-btn
fluid
style="height: 300px"
>
<v-row justify="center">
<v-menu
  min-width="200px"
  rounded
>
  <template v-slot:activator="{ props }">
    <v-btn
      icon
      v-bind="props"
    >
      <v-avatar
        color="white"
        size="large"
      >
        <span class="text-h5" color="black">{{ user.initials }}</span>
      </v-avatar>
    </v-btn>
  </template>
  <v-card>
    <v-card-text>
      <div class="mx-auto text-center">
        <v-avatar
          color="blue"
        >
          <span class="text-h5">{{ user.initials }}</span>
        </v-avatar>
        <h3>{{ user.fullName }}</h3>
        <p class="text-caption mt-1">
          {{ user.email }}
        </p>
        <v-divider class="my-3"></v-divider>
        <v-btn
          rounded
          variant="text"
        >
          Editar
        </v-btn>
        <v-divider class="my-3"></v-divider>
        <v-btn
          rounded
          variant="text"
          @click="cerrarSesion">
          Cerrar Sesion
        </v-btn>
      </div>
    </v-card-text>
  </v-card>
</v-menu>
</v-row>

    </v-btn>
    
  </v-app-bar>

  <v-navigation-drawer
    v-model="drawer"
    location="left"
    temporary
  >
  <v-list density="compact" nav>
        <v-list-item prepend-icon="mdi mdi-home-circle" title="Home" value="home" to=/home></v-list-item>
        <v-list-item prepend-icon="mdi mdi-account-plus" title="Usuario" value="usuario" to=/usuario></v-list-item>
        <v-list-item prepend-icon="mdi mdi-printer" title="Impresoras" value="impresoras" to=/impresora></v-list-item>
        <v-list-item prepend-icon="mdi mdi-monitor-multiple" title="Empresas" value="empresas" to=/empresas></v-list-item>
        <v-list-item prepend-icon="mdi mdi-chart-histogram" title="Sedes" value="sedes" to=/sedes></v-list-item>
        <v-list-item prepend-icon="mdi mdi-chart-pie" title="Empresas - Sedes" value="sedes" to=/empresasedes></v-list-item>
        <v-list-item prepend-icon="mdi mdi-content-save-all" title="Impresoras - Asociadas" value="impresoras" to=/impresorasasociadas></v-list-item>
        <v-list-item prepend-icon="mdi mdi-alert" title="Visitas de mantenimiento" value="Visitas de mantenimiento" to=/mantenimiento></v-list-item>
        
      </v-list>
  </v-navigation-drawer>

  <v-main style="height: 100vh; width: 100vw">
    <router-view></router-view>
  </v-main>
</v-layout>
</v-card>
</template>
<script>

export default {

data: () => ({
user: {
    initials: 'AD',
    fullName: 'Administrador',
    email: 'admin@colombiainkjet.com',
  },
  drawer: false,
  group: null,
}),

methods: {
    cerrarSesion() {
      // Aquí puedes realizar cualquier lógica de cierre de sesión necesaria

      // Emitir un evento para indicar que el usuario ha cerrado sesión
      this.$emit('cerrar-sesion');
      
    },
  },

watch: {
  group () {
    this.drawer = false
  },
},
}
</script>
<style scoped>
.menu {
background-color: #222;
color: white;
height: 100vh;
transition: width 0.3s;
font-family: Arial, Helvetica, sans-serif;
position: fixed;
left: 0;
top: 0;
}

.header {
display: flex;
justify-content: end;
}

.menu-button {
border: none;
background-color: transparent;
color: white;
padding: 10px;
}

/* we will explain what these classes do next! */
.collapsed {
width: 80px;
}

.expanded {
width: 230px;
}

.profile {
padding: 10px;
text-align: center;
}

.profile img {
border-radius: 50%;
min-width: 50px;
max-width: 150px;
width: 100%;
}

.profile-name {
padding: 10px 0;
font-size: 18px;
}

.menu-items {
list-style: none;
padding: 1px;
margin: 20px;
align-items: center;
justify-content: center;

}

.a {
color: white;
text-decoration: none;
display: block;
align-items: center;
text-align: center;
}

.icon {
display: flex;
align-items: center;
gap: 20px;
align-items: center;

}

.a:hover {
background-color: white;
color: black;

}

/* .item .icon {
width: 80px;
display: flex;
justify-content: center;

} */
</style>