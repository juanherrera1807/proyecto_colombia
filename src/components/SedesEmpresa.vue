<template>
  <div style="overflow-y: auto; height: 600px;">
<div style="grid-area: 1 / 1 / 2 / 3; display: grid; grid-template-columns: repeat(2, 1fr); grid-template-rows: repeat(1, 1fr); grid-column-gap: 11px; grid-row-gap: 0px;">
<div style="width:30%; grid-area: 1 / 1 / 2 / 3;">
<v-table height="200px">
    <thead>
      <v-toolbar>
        <v-toolbar-title>Sedes</v-toolbar-title>
      </v-toolbar>
    </thead>
    <tbody>
      <tr
      v-for="dessertssedes in dessertssedes"
        :key="dessertssedes.id"
      >
        <td>{{ dessertssedes.nombre }}</td>

               <v-icon
                size="small"
                class="me-2"
                @click="addItemsede(dessertssedes)"
              >
                mdi-plus-circle-outline
              </v-icon>   

               
      </tr>
    </tbody>

              

  </v-table>
</div>

<div style="width:50%; grid-area: 1 / 2 / 2 / 3; ">
<v-table height="200px">
    <thead>
      <v-toolbar>
        <v-toolbar-title>Empresas</v-toolbar-title>
      </v-toolbar>
    </thead>
    <tbody>
      <tr
      v-for="dessertsempresa in dessertsempresa"
        :key="dessertsempresa.id"
      >
        <td>{{ dessertsempresa.nombre }}</td>

        <v-icon
                size="small"
                class="me-2"
                @click="addItemempresa(dessertsempresa)"
              >
              mdi-plus-circle-outline
              </v-icon>
      </tr>
    </tbody>
  </v-table>
</div>
</div>



<div style="align-items:center ; padding: 100px">
<v-table>
  <template v-slot:top>
    <v-toolbar
  flat
>
  <v-toolbar-title>Empresas - Sedes</v-toolbar-title>

  <v-spacer></v-spacer>  

  <v-dialog
    v-model="dialog"
    max-width="500px"
  >
    <v-card>
      <v-card-title>
        <span class="text-h5">{{ titulo }}</span>
      </v-card-title>
    </v-card>
  </v-dialog>
              <v-btn
                variant="text"
                color="primary"
                @click="saveAddedItems"
              >
                Guardar
              </v-btn>
  
  <v-spacer></v-spacer>          

  <v-dialog
    v-model="dialog"
    max-width="500px"
  >
    <v-card>
      <v-card-title>
        <span class="text-h5">{{ titulo }}</span>
      </v-card-title>
    </v-card>
  </v-dialog>
</v-toolbar>
  </template>
  <thead>
    <tr>
      <!-- Define las columnas de la nueva tabla según tus necesidades -->
      <th>Empresa</th>
      <th>Sede</th>
    </tr>
  </thead>
  <tbody>
    <!-- Itera sobre los elementos agregados y muéstralos en la tabla -->
    <tr v-for="addedEmpresa in addedEmpresas" :key="addedEmpresa.id">
    <td>{{ addedEmpresa.nombre }}</td>
    <td></td> <!-- Columna de sede vacía para empresas -->
        <td>
          <v-icon color="red" @click="removeAddedEmpresa(addedEmpresa.id)">mdi-delete</v-icon>
        </td>
    </tr>
    <tr v-for="addedSede in addedSedes" :key="addedSede.id">
      <td></td> <!-- Columna de empresa vacía para sedes -->
      <td>{{ addedSede.nombre }}</td>
        <td>
            <v-icon color="red" @click="removeAddedSede(addedSede.id)">mdi-delete</v-icon>
        </td>
    </tr>
  </tbody>
</v-table>
</div>
  

<div style="align-items:center ; padding: 100px">
<v-table>
  <template v-slot:top>
    <v-toolbar
  flat
>
  <v-toolbar-title>Empresas - Sedes</v-toolbar-title>

  <v-spacer></v-spacer>  

  <v-dialog
    v-model="dialog"
    max-width="500px"
  >
    <v-card>
      <v-card-title>
        <span class="text-h5">{{ titulo }}</span>
      </v-card-title>
    </v-card>
  </v-dialog>
  <v-dialog
    v-model="dialog"
    max-width="500px"
  >
    <v-card>
      <v-card-title>
        <span class="text-h5">{{ titulo }}</span>
      </v-card-title>
    </v-card>
  </v-dialog>

        <v-dialog v-model="dialogDelete" max-width="500px">
          <v-card>
            <v-card-title class="text-h5" color="red">¿Esta seguro que desea eliminar este dato?</v-card-title>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="blue-darken-1" variant="text" @click="closeDelete">Cancelar</v-btn>
              <v-btn color="blue-darken-1" variant="text" @click="deleteItemConfirm">Borrar</v-btn>
              <v-spacer></v-spacer>
            </v-card-actions>
          </v-card>
        </v-dialog>

</v-toolbar>
  </template>
    <tbody>
      <tr
      v-for="dessertssedesempresa in dessertssedesempresa"
        :key="dessertssedesempresa.id"
      >
        <td>{{ dessertssedesempresa.empresa}} - {{ dessertssedesempresa.sede}}</td>
        <td>
          <v-icon @click="deleteItem(dessertssedesempresa)">mdi-delete</v-icon>
        </td>
      </tr>
    </tbody>
</v-table>
</div>
</div>
</template>

<script>
import db from '../firebase/datos.js';
import {collection, query, getDocs, addDoc, where, deleteDoc } from 'firebase/firestore'
import { useSedesEmpresa } from "../stores/store";

  export default {
    data: () => ({
      addedEmpresas: [],
      addedSedes: [],
      selEmpresas: "",
      selSedes: " ",
      dialog: false,
      dialogDelete: false,
      editedIndex: -1,
      editedItem: {}, // Objeto que representa el elemento a eliminar
      defaultItem: {}, // Objeto vacío o valores por defecto
      search: '',
      sedeSeleccionada: null,
      empresaSeleccionada: null,
      sedeTableHeaders: [
      { text: 'Nombre de la Sede', value: 'nombre' },// Cambiar 'nombreSede' a 'nombre'
    ],
    empresaTableHeaders: [
      { text: 'Nombre de la Empresa', value: 'nombre' },// Cambiar 'nombreSede' a 'nombre'
    ],
    sedeTableData: [], // Datos de la tabla de sede seleccionada
    empresaTableData: [], // Datos de la tabla de sede seleccionada
    searchSedeTable: '', // Búsqueda en la tabla de sede seleccionada
    searchEmpresaTable: '', // Búsqueda en la tabla de sede seleccionada
      dessertsempresa: [],
      dessertssedesempresa: [],
      editedIndexempresa: -1,
      editedItemempresa: {
        keyId: 0,
        nombre: ' ',
        direccion: ' ',
      },
      defaultItemempresa: {
        nit: ' ',
        nombre: ' ',
        direccion: ' ',
      },
      dessertssedes: [],
      editedIndexsedes: -1,
      editedItemsedes: {
        keyId: 0,
        nombre: ' ',
        direccion: ' ',
      },
      defaultItemsedes: {
        nit: ' ',
        nombre: ' ',
        direccion: ' ',
      },
    }),

    computed: {
      sedesEmpresa() {
      return useSedesEmpresa();
    },
    },

    watch: {
      dialog (val) {
        val || this.close()
      },
      dialogDelete (val) {
        val || this.closeDelete()
      },

      sedeSeleccionada(nuevaSede) {
        // Realiza acciones en función de la sede seleccionada, si es necesario
        console.log('Sede seleccionada:', nuevaSede);
        this.guardarSedeSeleccionada(); // Agrega esta línea
        const sedeSeleccionadaData = this.sedesEmpresa.SedesEmpresa.find(
          (sede) => sede.nombre === nuevaSede
        );
        // Asegúrate de que los datos de la sede seleccionada se muestren en la tabla
        if (sedeSeleccionadaData) {
          this.selectedInfosede = [sedeSeleccionadaData];
        } else {
          // Si la sede seleccionada no tiene datos, puedes mostrar un mensaje o dejar la tabla vacía
          this.sedeTableData = [];
        }
      },

      empresaSeleccionada(nuevaEmpresa) {
        // Realiza acciones en función de la sede seleccionada, si es necesario
        console.log('Empresa seleccionada:', nuevaEmpresa);
        this.guardarEmpresaSeleccionada(); // Agrega esta línea
        const empresaSeleccionadaData = this.sedesEmpresa.SedesEmpresa.find(
          (empresa) => empresa.nombre === nuevaEmpresa
        );
        // Asegúrate de que los datos de la sede seleccionada se muestren en la tabla
        if (empresaSeleccionadaData) {
          this.selectedInfoempresa = [empresaSeleccionadaData];
        } else {
          // Si la sede seleccionada no tiene datos, puedes mostrar un mensaje o dejar la tabla vacía
          this.empresaTableData = [];
        }
      },

      
    },

    created() {
        if (!this.sedeSeleccionada, !this.empresaSeleccionada) {
          // Carga los datos de las sedes solo si la sede seleccionada no está definida
          this.sedeSeleccionada = localStorage.getItem('sedeSeleccionada') || null;
          this.empresaSeleccionada = localStorage.getItem('empresaSeleccionada') || null;
          this.listar();
          
        }
      },

    methods: {

      removeAddedEmpresa(id) {
        const index = this.addedEmpresas.findIndex(empresa => empresa.id === id);
        if (index !== -1) {
          this.addedEmpresas.splice(index, 1);
        }
      },

      removeAddedSede(id) {
        const index = this.addedSedes.findIndex(sede => sede.id === id);
        if (index !== -1) {
          this.addedSedes.splice(index, 1);
        }
      },

          async deleteItem(index) {
          this.editedIndex = index;
          this.dialogDelete = true;
        },
        async deleteItemConfirm() {
          const index = this.editedIndex;
          if (index >= 0) {
                        
            // Realiza una consulta para encontrar el documento en función de la empresa y la sede
            const querySnapshot = await getDocs(query(collection(db, 'sedesempresa'), where('empresa', '==', this.selEmpresa), where('sede', '==', this.selSedes)));
            if (!querySnapshot.empty) {
              const docRef = querySnapshot.docs[0].ref;
              await deleteDoc(docRef);
              console.log('Documento eliminado con éxito en Firebase Firestore.');
            }

            this.dessertssedesempresa.splice(index, 1);
            this.closeDelete();
          }
        },
        closeDelete() {
          this.dialogDelete = false;
          this.editedIndex = -1;
        },
  
  


      // VERIFICAR EN FIREBASE QUE NO ESTE DUPLICADO 
      async saveAddedItems() {
        // Verifica si ya existe un documento con la misma empresa y sede en Firebase
        const querySnapshot = await getDocs(
          query(
            collection(db, 'sedesempresa'),
            where('empresa', '==', this.selEmpresas),
            where('sede', '==', this.selSedes)
          )
        );

        // Si no se encuentra ningún documento con la misma empresa y sede
        if (querySnapshot.empty) {
          // Guarda el nuevo documento en Firebase
          await addDoc(collection(db, 'sedesempresa'), {
            empresa: this.selEmpresas,
            sede: this.selSedes,
            serial: " ",
            placa: " ",
            fecha: " ",
            observacion: " ",
            // Otros campos si es necesario
          });

          // Limpia los arrays de elementos agregados después de guardarlos
          this.addedEmpresas = [];
          this.addedSedes = [];

          // Luego, puedes llamar a la función listar si es necesario
          await this.listar();
        } else {
          // Muestra un mensaje de error o realiza alguna otra acción
          alert('Ya existe un documento con la misma empresa y sede.');
          console.log('Ya existe un documento con la misma empresa y sede.');
        }
      },


      addItemsede(item) {
          // Verifica si el elemento es una sede antes de agregarlo
             this.selSedes = item.nombre
            this.addedSedes.push(item);
          },
      addItemempresa(item) {
        // Verifica si el elemento es una empresa antes de agregarlo
          this.addedEmpresas.push(item);
          this.selEmpresas = item.nombre
      },

      guardarSedeSeleccionada() {
      if (this.sedeSeleccionada) {
        localStorage.setItem('sedeSeleccionada', this.sedeSeleccionada);
       // Busca la sede seleccionada en sedesEmpresa.SedesEmpresa 
       console.log("Nombres de las sedes:", this.sedesEmpresa.SedesEmpresa.map(sede => sede.nombre));
        const sedeSeleccionadaData = this.sedesEmpresa.SedesEmpresa.find(
          (sede) => sede.nombre === this.sedeSeleccionada
        );

        console.log("Sede seleccionada:", this.sedeSeleccionada);
        console.log("Sede seleccionadaData:", sedeSeleccionadaData);
        if (sedeSeleccionadaData) {
          // Agrega la sede seleccionada a sedeTableData
          this.sedeTableData = [sedeSeleccionadaData];
          console.log("HOLA" ,sedeSeleccionadaData)
        } else {
          // Si la sede seleccionada no tiene datos, puedes mostrar un mensaje o dejar la tabla vacía
          this.sedeTableData = [];
        }
      }
    },

    guardarEmpresaSeleccionada() {
      if (this.empresaSeleccionada) {
        localStorage.setItem('empresaSeleccionada', this.empresaSeleccionada);
       // Busca la sede seleccionada en sedesEmpresa.SedesEmpresa 
       console.log("Nombres de las empresas:", this.sedesEmpresa.SedesEmpresa.map(empresa => empresa.nombre));
        const empresaSeleccionadaData = this.sedesEmpresa.SedesEmpresa.find(
          (empresa) => empresa.nombre === this.empresaSeleccionada
        );

        console.log("Empresa seleccionada:", this.empresaSeleccionada);
        console.log("Empresa seleccionadaData:", empresaSeleccionadaData);
        if (empresaSeleccionadaData) {
          // Agrega la sede seleccionada a sedeTableData
          this.empresaTableData = [empresaSeleccionadaData];
          console.log("HOLA" ,empresaSeleccionadaData)
        } else {
          // Si la sede seleccionada no tiene datos, puedes mostrar un mensaje o dejar la tabla vacía
          this.empresaTableData = [];
        }
      }
    },
      
      initialize () {
        this.dessertssedes = [
          {
            nit: ' ',
            nombre: ' ',
            direccion:' ',
          },
        ],
        this.dessertsempresa = [
          {
            nit: ' ',
            nombre: ' ',
            direccion:' ',
          },
        ],
        this.dessertssedesempresa = [
          {
            empresa: '',
            sede: ' ',
          },
        ]
      },

      async created() {
        await this.sedesEmpresa.cargarDatos(); // Reemplaza con una acción para cargar los datos si es necesario
        this.listar();
      },

      async listar() {
      this.dessertsempresa = []; // Vacía el array antes de agregar nuevos datos
      const q = query(collection(db, 'empresas'));
      const result = await getDocs(q);
      result.forEach((doc) => {
        console.log("datos", doc.data());
        console.log('id', doc.id);
        this.dessertsempresa.push({
          keyId: doc.id,
          nit: doc.data().nit,
          nombre: doc.data().nombre,
          direccion: doc.data().direccion,
        })
      });

      this.dessertssedes = []; // Vacía el array antes de agregar nuevos datos
      const qsedes = query(collection(db, 'sedes'));
      const resultsedes = await getDocs(qsedes);
      resultsedes.forEach((doc) => {
        console.log("datos", doc.data());
        console.log('id', doc.id);
        this.dessertssedes.push({
          keyId: doc.id,
          nit: doc.data().nit,
          nombre: doc.data().nombre,
          direccion: doc.data().direccion,
        })
      });

      this.dessertssedesempresa = []; // Vacía el array antes de agregar nuevos datos
      const qsedesempresa = query(collection(db, 'sedesempresa'));
      const resultsedesempresa = await getDocs(qsedesempresa);
      resultsedesempresa.forEach((doc) => {
        console.log("datos", doc.data());
        console.log('id', doc.id);
        this.dessertssedesempresa.push({
          empresa: doc.data().empresa,
          sede: doc.data().sede,
        })
      });
    },

      async limpiar(){
          this.dessertsempresa = [],
          this.dessertssedes = [],
          this.dessertssedesempresa = []

      },

      save () {
        if (this.editedIndex > -1) {
          Object.assign(this.desserts[this.editedIndex], this.editedItem)
          this.actualizarDato()
        } else {
          this.desserts.push(this.editedItem)        
          this.createUsuario()
        }
        this.guardarSedeSeleccionada(); // Agrega esta línea
        this.guardarEmpresaSeleccionada(); // Agrega esta línea
        this.close()
      },
  },
  }
</script>