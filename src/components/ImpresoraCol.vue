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
        <v-toolbar-title>IMPRESORAS</v-toolbar-title>
        
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
              NUEVO EQUIPO
            </v-btn>
            <v-btn
              color="primary"
              dark
              @click="imprimir()"
            >
              IMPRIMIR
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
                      v-model="editedItem.numero"
                      label="numero "
                    ></v-text-field>
                  </v-col>
                  <v-col
                    cols="12"
                    sm="6"
                    md="4"
                  >
                    <v-text-field
                      v-model="editedItem.serial"
                      label="Serial"
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
                      v-model="editedItem.modelo"
                      label="Modelo"
                    ></v-text-field>
                  </v-col>
                  <v-col
                    cols="12"
                    sm="6"
                    md="4"
                  >
                    <v-text-field
                      v-model="editedItem.marca"
                      label="Area"
                    ></v-text-field>
                  </v-col>
                  <v-col
                    cols="12"
                    sm="6"
                    md="4"
                  >
                    <v-text-field
                      v-model="editedItem.mantenimiento"
                      label="Ubicacion"
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
                CANCELAR
              </v-btn>
              <v-btn
                color="blue-darken-1"
                variant="text"
                @click="save"
              >
                GUARDAR
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
              <v-btn color="blue-darken-1" variant="text" @click="deleteItemConfirm">OK.BORRAR</v-btn>
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
import jsPDF from 'jspdf';
require('jspdf-autotable');
import db from '../firebase/datos.js';
import {collection, addDoc, query, getDocs, updateDoc, doc, deleteDoc} from 'firebase/firestore'
  export default {
    data: () => ({
      dialog: false,
      dialogDelete: false,
      search: '',
      headers: [
        { title: 'n°', align: 'start', sortable: false, key: 'numero',},
        { title: 'Serial', align: 'end', key: 'serial' },
        { title: 'Nombre', align: 'end', key: 'nombre' },
        { title: 'Modelo', align: 'end', key: 'modelo' },
        { title: 'Area', align: 'end', key: 'marca' },
        { title: 'Ubicacion', align: 'end', key: 'mantenimiento' },
        { title: 'Actions', key: 'actions', sortable: false },
      ],
      desserts: [],
      editedIndex: -1,
      editedItem: {
        keyId: 0,
        numero: ' ',
        serial: ' ',
        modelo:' ',
        nombre: ' ',
        marca: ' ',
        mantenimiento: ' ',
      },
      defaultItem: {
        numero: 0,
        serial: ' ',
        nombre: ' ',
        modelo:' ',
        marca: ' ',
        mantenimiento: ' ',
      },
    }),

    computed: {
      formTitle () {
        return this.editedIndex === -1 ? 'NUEVO EQUIPO' : 'EDITAR EQUIPO'
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
            numero: ' ',
            serial: ' ',
            modelo:' ',
            nombre: ' ',
            marca: ' ',
            mantenimiento: " ",
          },
        ]
      },
      async listar() {
      const q = query(collection(db, 'impresoras'));
      const result = await getDocs(q);
      result.forEach((doc) => {
        console.log("datos", doc.data());
        console.log('id', doc.id);
        this.desserts.push({
          keyId: doc.id,
          id: doc.data().id,
          numero: doc.data().numero,
          serial: doc.data().serial,
          nombre: doc.data().nombre,
          modelo: doc.data().modelo,
          marca: doc.data().marca,
          mantenimiento: doc.data().mantenimiento,
        })
      });
    },
      async actualizarDato() {
        console.log(this.editedItem.keyId)
        const ref = doc(db, 'impresoras',this.editedItem.keyId);
        await updateDoc(ref,{
          nombre: this.editedItem.nombre,
          serial: this.editedItem.serial,
          marca: this.editedItem.marca,
          modelo: this.editedItem.modelo,
          mantenimiento: this.editedItem.mantenimiento,

        })
        .then(console.log('actualizacion hecha'))
        .catch(function(error){
        console.log(error)})
        this.limpiar()
        this.listar()
      },

      async createUsuario(){
        const colRef= collection(db, 'impresoras');
        console.log( this.editedItem.numero," ",this.editedItem.serial," ",this.editedItem.nombre," ",this.editedItem.marca," ",this.editedItem.mantenimiento )
        const dataObj ={
          numero: this.editedItem.numero,
          serial: this.editedItem.serial,
          nombre: this.editedItem.nombre,
          marca: this.editedItem.marca,
          modelo: this.editedItem.modelo,
          mantenimiento: this.editedItem.mantenimiento,
        }
        const docRef= await addDoc(colRef, dataObj)
        console.log(docRef.id)
      },
      async borrarItem (){
        const ref = doc(db, 'impresoras',this.editedItem.keyId);
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
      async imprimir() {
      let columns = [
        { title: "Marca", dataKey: "marca" },
        { title: "Serial", dataKey: "serial" },
        { title: "Nombre", dataKey: "nombre" },
      ];
      let registros = this.desserts;
      let doc = new jsPDF("p", "pt");
      doc.autoTable(columns, registros, {
        margin: { top: 60 },
        addPageContent: function () {
          doc.text("Inventario", 40, 30);
        },
      });
      doc.save("Inventario.pdf");
    },
    },
  }
</script>