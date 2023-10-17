import { createWebHashHistory ,createRouter } from "vue-router";
/* import store from '../stores/store' */

/* import inicio from '../components/InicioColombia.vue'; */
import home from "../components/HomeColombia.vue";
import usuario from "../components/UsuarioColombia.vue";
import impresora from '../components/ImpresoraCol.vue';
import registrar from '../components/RegisterColombia.vue'
import empresas from '../components/EmpresasCol.vue'
import empresasedes from '../components/SedesEmpresa.vue'
import sedes from '../components/SedesColombia.vue'
import mantenimiento from '../components/MantenimientoCol.vue'
import impresorasasociadas from '../components/ImpresorasAsociadas.vue'


const routes = [
  {
    path: "/mantenimiento",
    name: "mantenimiento",
    component: mantenimiento,
    meta: {requiresAuth: true}
},  
{
    path: "/home",
    name: "home",
    component: home,
    meta: {requiresAuth: true}
}, 
{
  path: "/sedes",
  name: "sedes",
  component: sedes,
  meta: {requiresAuth: true}
},
{
  path: "/empresasedes",
  name: "empresasedes",
  component: empresasedes,
  meta: {requiresAuth: true}
},
{
  path: "/usuario",
  name: "usuario",
  component: usuario,
  meta: {requiresAuth: true}
},
{
  path: "/impresora",
  name: "impresora",
  component: impresora,
  meta: {requiresAuth: true}
},
{
  path: "/registrar",
  name: 'registrar',
  component: registrar, 
  meta: {requiresAuth: true}
},
{
  path: "/impresorasasociadas",
  name: 'impresorasasociadas',
  component: impresorasasociadas, 
  meta: {requiresAuth: true}
},
{
  path: "/empresas",
  name: "empresas",
  component: empresas,
  meta: {requiresAuth: true}
}
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

/* router.beforeEach((to, from, next) => {

  if (to.meta.requiresAuth && !store.state.isAuthenticated) {
    next('/registrar');
  } else {
    next();
  }
}); */

export default router;
