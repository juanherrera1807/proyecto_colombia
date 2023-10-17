<template>
  <v-data-table
    :headers="headers"
    :items="desserts"
    :sort-by="[{ key: 'calories', order: 'asc' }]"
    class="elevation-1"
    style="height: 100%;
    width: 100%"
    :search="search"
  >
    <template v-slot:top>
     

      <v-toolbar
        flat
      >
        <v-toolbar-title>USUARIOS</v-toolbar-title>
      
        <v-spacer></v-spacer>

        <v-text-field
          v-model="search"
          append-icon="mdi-magnify"
          label="Buscar"
          single-line
          hide-details
        ></v-text-field>

        <v-divider
          class="mx-4"
          inset
          vertical
        ></v-divider>


        <v-dialog
          v-model="dialog"
          max-width="500px"
        >
          <template v-slot:activator="{ props }">
            <v-btn
              color="primary"
              dark
              class="mb-2"
              v-bind="props"
            >
              Nuevo Usuario
            </v-btn>
          </template>

          <v-card>
            <v-card-title>
              <span class="text-h5">{{ formTitle }}</span>
            </v-card-title>

            <v-card-text>
              <v-container>
                <v-row>
                  
                  <v-col
                    cols="12"
                    sm="6"
                    md="4"
                  >
                    <v-text-field
                      v-model="editedItem.usuario"
                      label="Usuario"
                    ></v-text-field>
                  </v-col>
                  <v-col
                    cols="12"
                    sm="6"
                    md="4"
                  >
                    <v-text-field
                      v-model="editedItem.clave"
                      label="Clave"
                    ></v-text-field>
                  </v-col>
                </v-row>
              </v-container>
            </v-card-text>

            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn
                color="blue-darken-1"
                variant="text"
                @click="close"
              >
                Cancelar
              </v-btn>
              <v-btn
                color="blue-darken-1"
                variant="text"
                @click="save"
              >
                Guardar
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
        <v-dialog v-model="dialogDelete" max-width="500px">
          <v-card>
            <v-card-title class="text-h5">Are you sure you want to delete this item?</v-card-title>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="blue-darken-1" variant="text" @click="closeDelete">Cancel</v-btn>
              <v-btn color="blue-darken-1" variant="text" @click="deleteItemConfirm">OK</v-btn>
              <v-spacer></v-spacer>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-toolbar>
    </template>
    <template v-slot:[`item.actions`]="{ item }">
      <v-icon
        size="small"
        class="me-2"
        @click="editItem(item.raw)"
      >
        mdi-pencil
      </v-icon>
      <v-icon
        size="small"
        @click="deleteItem(item.raw)"
      >
        mdi-delete
      </v-icon>
    </template>
    <template v-slot:no-data>
      <v-btn
        color="primary"
        @click="initialize"
      >
        Reset
      </v-btn>
    </template>
  </v-data-table>
</template>
<script>

  import db from '../firebase/datos.js';
  import {collection, getDocs, query, addDoc, updateDoc, doc, deleteDoc} from 'firebase/firestore'

  export default {
    data: () => ({
      dialog: false,
      dialogDelete: false,
      search: '',
      headers: [
        
        { title: 'Usuario', key: 'usuario' },
        { title: 'Clave', key: 'clave' },
        { title: 'Actions', key: 'actions', sortable: false },
      ],
      desserts: [],
      editedIndex: -1,
      editedItem: {
          
        
        usuario: '',
        clave: '',
      },
      defaultItem: { 
        
        usuario: '',
        clave: '',
      },
    }),

    computed: {
      formTitle () {
        return this.editedIndex === -1 ? 'Nuevo Usuario' : 'Editar Usuario'
      },
    },

    watch: {
      dialog (val) {
        val || this.close()
      },
      dialogDelete (val) {
        val || this.closeDelete()
      },
    },

    created (){
      this.listarUsuarios()
      
    },

    methods: {
      initialize(){
        this.desserts = [
          {
            
            usuario: '',
            clave: '',
          }

        ]
      },
          async listarUsuarios() {
              const q = query(collection(db,"usuarios"));
              const result = await getDocs(q);
              result.forEach((doc) => {
                console.log("datos",doc.data());
                console.log('id', doc.id);
                this.desserts.push({
                  keyId: doc.id,
                  
                  usuario: doc.data().usuario,
                  clave: doc.data().clave,
                  })
              });
          },

          async createUser(){
            const colRef = collection(db, 'usuarios');
            console.log(this.editedItem.usuario,"",this.editedItem.clave,"",)
            const dataObj = {
                
              usuario: this.editedItem.usuario,
              clave: this.editedItem.clave
            }
            const docRef = await addDoc(colRef, dataObj)
            console.log ('Document was created with: ID:', docRef.id)
            this.limpiar()
            this.listarUsuarios()
            
          },

          async updateUser() {
            console.log (this.editItem.keyId)
            const ref = doc(db, "usuarios", this.editedItem.keyId);
            await updateDoc(ref, {
                
                
                usuario: this.editedItem.usuario,
                clave: this.editedItem.clave,
              })
              .then(console.log('actualizacion realizada'))
              .catch(function(error){
              console.log(error)})
          },

          async borrarItem (){
          const ref = doc(db, 'usuarios',this.editedItem.keyId);
          await deleteDoc(ref)
          .then(console.log('eliminado'))
          .catch(function(error){
          console.log(error)})
    },

    async limpiar(){
      this.desserts = []
    },


      editItem (item) {
        this.editedIndex = this.desserts.indexOf(item)
        this.editedItem = Object.assign({}, item)
        this.dialog = true
      },

      deleteItem (item) {
        this.editedIndex = this.desserts.indexOf(item)
        this.editedItem = Object.assign({}, item)
        this.dialogDelete = true
      },

      deleteItemConfirm () {
        this.desserts.splice(this.editedIndex, 1)
        this.closeDelete()
        this.borrarItem()
      },

      close () {
        this.dialog = false
        this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem)
        this.editedIndex = -1
        })
      },

      closeDelete () {
        this.dialogDelete = false
        this.$nextTick(() => {
          this.editedItem = Object.assign({}, this.defaultItem)
          this.editedIndex = -1
        })
      },

      save () {
        if (this.editedIndex > -1) {
          Object.assign(this.desserts[this.editedIndex], this.editedItem)
          this.updateUser()
        } else {
          this.desserts.push(this.editedItem)
          this.createUser();
          
        }
        this.close()
      },
    },
  }
</script>


<style>



</style>