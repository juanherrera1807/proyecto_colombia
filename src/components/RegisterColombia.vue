<template>
  <div class="body">
    <div v-if="!isLoggedIn">
  <div class="container-form login">
    <div class="information">
      <div class="info-childs">
        <div class="logo">
          <v-img src="@/assets/2.png"></v-img>
          </div>
      </div>
    </div>
    <div class="form-information">
      <div class="form-information-childs">
        <h2>Iniciar Sesion</h2>
        <div class="icons">

        </div>
        <form class="datos">
          <label>
            <i class='bx bx-envelope'></i>
            <input v-model="loginUser" placeholder="Usuario">
          </label>
          <label>
            <i class='bx bx-lock-alt'></i>
            <input v-model="loginPassword" type="password" placeholder="Contraseña">
          </label>
          <v-btn @click='created'  value="Iniciar Sesion" class="botonLogin"> Ingresar </v-btn>
        </form>
      </div>
    </div>
  </div> 
</div>  
        <div v-else>
          <MenuPrincipal @cerrar-sesion="cerrarSesion" />
        </div>
</div>
    
</template>

<script>
import db from '../firebase/datos.js';
import { collection, query, getDocs } from 'firebase/firestore'
import MenuPrincipal from '../components/MenuPrincipal.vue';


export default {
  
  name: "LoginComponent",
  components: {
    MenuPrincipal, // Agrega el componente en la sección 'components'
  },
  data() {
    
    return {
      loginUser: "",
      loginPassword: "",
      users: [],
      hide: false,
      isLoggedIn: false,
    };
  },
  methods: {
    async listar() {
      const q = query(collection(db, 'usuarios'));
      const result = await getDocs(q);
      result.forEach((doc) => {
        this.users.push({
          usuario: doc.data().usuario,
          clave: doc.data().clave,
        });
      });
    },
  
    async created() {
      await this.listar(); // Espera a que se complete la operación de listar
      this.login(); // Llama a login() después de llenar el array users[]
    },
  
    async login() {
      // Verifica que el usuario y la contraseña sean correctos
      console.log(this.users)
      const user = this.users.find(
        (user) =>
          user.usuario === this.loginUser && user.clave === this.loginPassword
      );
      if (user) {
        // Usuario correcto
        this.isLoggedIn = true;
        console.log("Ingreso");
        this.$emit('inicio-sesion-exitoso');
        this.$router.push({ path: "/home" });
      } else {
        // Usuario incorrecto
        alert("Usuario o contraseña incorrecta.");
      }
    }, 
    
  },
}
</script>
<style scoped>
/* Estilos globales */
*{
    padding: 0;
    margin: 0;
    box-sizing: border-box;
    font-family: 'Montserrat', sans-serif;
}

.body{
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100vh;
    background-color: rgba(43,190,245,0.5);
    background-size: cover;
}

.container-form {
    display: flex;
    border-radius: 20px;
    box-shadow: 0 5px 7px rgba(0,0,0,.1);
    height: 500px;
    max-width: 900px;
    transition: all 1s ease;
    margin: 10px;
}

.information {
    width: 50%;
    display: flex;
    align-items: center;
    text-align: center;
    background-color: rgba(43, 190, 245, 0.5);
    border-top-left-radius: 20px;
    border-bottom-left-radius: 20px;
}
/* .logo{
  margin: 10% ;
} */
.info-childs {
    width: 500px;
    padding: 1px;
}

.info-childs h2 {
    font-size: 2.5rem;
    color: #333;
}

.info-childs p {
    margin: 15px 0 ;
    color: #555;
}

.info-childs input {
    background-color: transparent;
    outline: none;
    border: solid 2px #333;
    border-radius: 20px;
    padding: 10px 20px;
    color: #333;
    cursor: pointer;
    transition: background-color .3s ease;
}

.info-childs input:hover {
    background-color: #9191bd;
    border: none;
    color: white;
    box-shadow: 0 2px 5px rgba(0,0,0,.1);
}

.form-information {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 60%;
    text-align: center;
    background-color: #f8f8f8;
    border-top-right-radius: 20px;
    border-bottom-right-radius: 20px;
}

.form-information-childs {
    padding: 0 30px;
}

.form-information-childs h2 {
    color: #333;
    font-size:  2rem;
}

.form-information-childs p {
    color: #555;
}

.icons {
    margin: 15px 0;

}

.icons i {
    border-radius: 50%;
    padding: 15px;
    cursor: pointer;
    margin: 0 10px;
    color: #9191bd;
    border: solid thin #9191bd;
    transition: background-color 0.3s ease;
    box-shadow: 0 2px 5px rgba(0,0,0,.1);
}

.icons i:hover {
    background-color:  rgb(31, 193, 221);
    color: white;
}

.datos {
    margin: 30px 0 0 0;
}

.datos label {
    display: flex;
    align-items: center;
    margin-bottom: 15px;
    border-radius: 20px;
    padding: 0 10px;
    background-color: #fff;
    box-shadow: 0 2px 5px rgba(0,0,0,.1); 
}

.datos label input {
    width: 100%;
    padding: 10px;
    background-color: #fff;
    border: none;
    outline: none;
    border-radius: 20px;
    color: #333;
}

.datos label i {
    color: #a7a7a7;
}

.datos input[type="submit"] {
    background-color: #9191bd;
    color: #fff;
    border-radius: 20px;
    border: none;
    padding: 10px 15px;
    cursor: pointer;
    margin-top: 10px;
}

.datos input[type="submit"]:hover {
    background-color: #7a7a9a;
}

.hide {
    position: absolute;
    transform: translateY(-300%);
}

/*responsive*/

@media screen and (max-width: 750px) {
    html {
        font-size: 12px;
    }
}

@media screen and (max-width: 580px) {
    html {
        font-size: 10px;
    }

    .container-form {
        height: auto;
        flex-direction: column;
    }

    .information {
        width: 100%;
        padding: 20px;
        border-top-left-radius: 20px;
        border-top-right-radius: 20px;
        border-bottom-left-radius: 0px;
        border-bottom-right-radius: 0;
    }

    .form-information {
        width: 100%;
        padding: 20px;
        border-bottom-left-radius: 20px;
        border-top-right-radius: 0;
    }
}
.botonLogin{
  width: 50%;
  padding: 10px;
  color: beige;
  background-color: rgba(43, 190, 245, 0.5);
}

</style>
