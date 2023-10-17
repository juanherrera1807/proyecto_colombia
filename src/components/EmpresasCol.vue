<template>
    <v-data-table
      :headers="headers"
      :items="desserts"
      :sort-by="[{ key: 'numero', order: 'asc' }]"
      class="elevation-1"
      style="height: 100%;
      width: 100%"
      :search="search"
    >
      <template v-slot:top>


        <v-toolbar
          flat
        >
          <v-toolbar-title>Empresas</v-toolbar-title>
          
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
                v-bind="props"
              >
                Nueva empresa
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
                        v-model="editedItem.nit"
                        label="Nit "
                      ></v-text-field>
                    </v-col>
                    <v-col
                      cols="12"
                      sm="6"
                      md="4"
                    >
                      <v-text-field
                        v-model="editedItem.nombre"
                        label="Nombre"
                      ></v-text-field>
                    </v-col>
                    <v-col
                      cols="12"
                      sm="6"
                      md="4"
                    >
                      <v-text-field
                        v-model="editedItem.direccion"
                        label="Direccion"
                      ></v-text-field>
                    </v-col>
                    <v-col
                      cols="12"
                      sm="6"
                      md="4"
                    >
                      <v-text-field
                        v-model="editedItem.telefono"
                        label="Telefono"
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
              <v-card-title class="text-h5" color="red">¿Esta seguro que desea eliminar este item?</v-card-title>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="blue-darken-1" variant="text" @click="closeDelete">Cancelar</v-btn>
                <v-btn color="blue-darken-1" variant="text" @click="deleteItemConfirm">OK.Borrar</v-btn>
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
  import {collection, addDoc, query, getDocs, updateDoc, doc, deleteDoc} from 'firebase/firestore'
  import { useSedesEmpresa } from "../stores/store"

    export default {
      data: () => ({
        dialog: false,
        dialogDelete: false,
        search: '',
        headers: [
          { title: 'Nit', align: 'start', sortable: false, key: 'nit',},
          { title: 'Nombre', align: 'end', key: 'nombre' },
          { title: 'Direccion', align: 'end', key: 'direccion' },
          { title: 'Telefono', align: 'end', key: 'telefono' },
          { title: 'Actions', key: 'actions', sortable: false },
        ],
        desserts: [],
        editedIndex: -1,
        editedItem: {
          keyId: 0,
          nombre: ' ',
          direccion: ' ',
          telefono:' ',
        },
        defaultItem: {
          nit: ' ',
          nombre: ' ',
          direccion: ' ',
          telefono:' ',

        },
      }),
  
      computed: {
        formTitle () {
          return this.editedIndex === -1 ? 'Nueva empresa' : 'Editar empresa'
        },
        sedesEmpresa() {
          return useSedesEmpresa()
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
  
      created () {
        this.listar()
      },
  
      methods: {
        initialize () {
          this.desserts = [
            {
              nit: ' ',
              nombre: ' ',
              direccion:' ',
              telefono: ' ',
            },
          ]
        },
        async listar() {
        const q = query(collection(db, 'empresas'));
        const result = await getDocs(q);
        const sedesEmpresaStore = useSedesEmpresa();
        result.forEach((doc) => {
          console.log("datos", doc.data());
          console.log('id', doc.id);

          const empresa = {
        
            keyId: doc.id,
            nit: doc.data().nit,
            nombre: doc.data().nombre,
            direccion: doc.data().direccion,
            telefono: doc.data().telefono,

          };

          sedesEmpresaStore.agregarSede(empresa);

          this.desserts.push({
            keyId: doc.id,
            nit: doc.data().nit,
            nombre: doc.data().nombre,
            direccion: doc.data().direccion,
            telefono: doc.data().telefono,
          })
        });
      },
        async actualizarDato() {
          console.log(this.editedItem.keyId)
          const ref = doc(db, 'empresas',this.editedItem.keyId);
          await updateDoc(ref,{
            nit: this.editedItem.nit,
            nombre: this.editedItem.nombre,
            direccion: this.editedItem.direccion,
            telefono: this.editedItem.telefono,
  
          })
          .then(console.log('actualizacion hecha'))
          .catch(function(error){
          console.log(error)})
        },
  
        async createUsuario(){
          const colRef= collection(db, 'empresas');
          console.log( this.editedItem.numero," ",this.editedItem.serial," ",this.editedItem.nombre," ",this.editedItem.marca," ",this.editedItem.mantenimiento )
          const dataObj ={
            nit: this.editedItem.nit,
            nombre: this.editedItem.nombre,
            direccion: this.editedItem.direccion,
            
            telefono: this.editedItem.telefono,
        }
        const docRef= await addDoc(colRef, dataObj)
        console.log(docRef.id)
        this.limpiar()
        this.listar()
        },

        async limpiar(){
            this.desserts = []

        },

            async borrarItem (){
            const ref = doc(db, 'empresas',this.editedItem.keyId);
            await deleteDoc(ref)
            .then(console.log('eliminado'))
            .catch(function(error){
            console.log(error)})
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
            this.actualizarDato()
          } else {
            this.desserts.push(this.editedItem)
            this.createUsuario()
          }
          this.close()
        },
    },
    }
</script>

<style>



</style>