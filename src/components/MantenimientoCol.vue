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
          <v-toolbar-title>Visitas de mantenimiento</v-toolbar-title>
          
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
          > <template v-slot:activator="{ props }">
            <v-btn color="primary" dark class="mb-2" v-bind="props">
              Nueva visita
            </v-btn>
          </template>
            
            <v-card>
              <v-card-title>
                <span class="text-h5">{{ formTitle }}</span>
              </v-card-title>
  
              <v-card-text>
                <v-container>
                  <v-row>
                  <!-- <v-col cols="12" sm="6" md="4">
                    <v-select v-model="editedItem.empresa" :items="items" item-title="empresa" item-value="empresa" label="empresa" return-object single-line @change="handleEmpresaSelection"></v-select>

                  </v-col>
                  <v-col cols="12" sm="6" md="4">
                    <v-select v-model="editedItem.sede" :hint="``" :items="items" item-title="sede" item-value="sede"
                      label="sede" persistent-hint return-object single-line></v-select>
                  </v-col> -->
                  <v-col cols="12" sm="6" md="4">
                    <v-text-field v-model="editedItem.empresa" label="empresa"></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="6" md="4">
                    <v-text-field v-model="editedItem.sede" label="sede"></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="6" md="4">
                    <v-text-field v-model="editedItem.serial" label="serial"></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="6" md="4">
                    <v-text-field v-model="editedItem.placa" label="placa"></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="6" md="4">
                    <v-text-field v-model="editedItem.fecha" label="fecha"></v-text-field>
                  </v-col>
                  <v-col>
                    <v-text-field v-model="editedItem.observacion" label="observacion"></v-text-field>
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
      <template v-slot:[`item.actions`]="{ item }" >
        <v-icon activator="{ props }"
          size="small"
          class="me-2"
          @click="editItem(item.raw)"
        >
          mdi-pencil
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
  import { collection, addDoc, query, getDocs, updateDoc, doc, deleteDoc } from 'firebase/firestore'
  export default {
  
    data: () => ({
      dialog: false,
      dialogDelete: false,
      search: '',
      headers: [
        { title: 'Empresa', align: 'end', key: 'empresa' },
        { title: 'Sede', align: 'end', key: 'sede' },
        { title: 'Serial', align: 'end', key: 'serial' },
        { title: 'Placa', align: 'end', key: 'placa' },
        { title: 'Fecha', align: 'end', key: 'fecha' },
        { title: 'Observacion', align: 'end', key: 'observacion' },
        { title: 'Actions', key: 'actions', sortable: false },
      ],
      select: { empresa: ' ', sede: ' ' },
      items: [],
      desserts: [],
      editedIndex: -1,
      editedItem: {
        keyId: 0,
        empresa: ' ',
        sede: ' ',
        serial: ' ',
        placa: ' ',
        fecha:' ',
        observacion: ' '
      },
      defaultItem: {
        empresa: ' ',
        sede: ' ',
        serial: ' ',
        placa: ' ',
        fecha: ' ',
        observacion:' '
      },
  
    }),
  
    computed: {
      formTitle() {
        return this.editedIndex === -1 ? 'Nueva visita' : 'Editar mantenimiento'
      },
    },
  
    watch: {
      dialog(val) {
        val || this.close()
      },
      dialogDelete(val) {
        val || this.closeDelete()
      },
    },
  
    created() {
      this.listar();
      this.listarempresas();
    },
  
    methods: {
      initialize() {
        this.desserts = [
          {
            
            empresa: ' ',
            sede: ' ',
            serial: ' ',
            placa:' ',
            fecha: ' ',
            observacion: ' '
  
          },
        ]
      },
      async listar() {
        const q = query(collection(db, 'sedesempresa'));
        const result = await getDocs(q);
        result.forEach((doc) => {
          console.log("datos", doc.data());
          console.log('id', doc.id);
          this.desserts.push({
            keyId: doc.id,
            empresa: doc.data().empresa,
            sede: doc.data().sede,
            serial: doc.data().serial,
            placa: doc.data().placa,
            fecha: doc.data().fecha,
            observacion: doc.data().observacion
          })
        });
      },
      async actualizarDato() {
        console.log(this.editedItem.keyId)
        const ref = doc(db, 'sedesempresa', this.editedItem.keyId);
        await updateDoc(ref, {
          empresa: this.editedItem.empresa,
          sede: this.editedItem.sede,
          placa: this.editedItem.placa,
          serial: this.editedItem.serial,
          fecha: this.editedItem.fecha,
          observacion: this.editedItem.observacion
  
        })
          .then(console.log('actualizacion hecha'))
          .catch(function (error) {
            console.log(error)
            this.limpiar()
        this.listar()
          })
      },
  
      async createUsuario() {
        const colRef = collection(db, 'sedesempresa');
        console.log(this.editedItem.empresa, " ", this.editedItem.sede, " ", this.editedItem.serial, " ", this.editedItem.placa, " ", this.editedItem.observacion)
        
        const dataObj = {
          empresa: this.editedItem.empresa,
          sede: this.editedItem.sede,
          serial: this.editedItem.serial,
          placa: this.editedItem.placa,
          fecha: this.editedItem.fecha,
          observacion: this.editedItem.observacion,
          
        }
        const docRef = await addDoc(colRef, dataObj)
        console.log(docRef.id)
        this.limpiar()
        this.listar()
      },
  
      async limpiar() {
        this.desserts = []
  
      },
      async listarempresas() {
        const q = query(collection(db, 'sedesempresa'));
        const result = await getDocs(q);
        result.forEach((doc) => {
          this.items.push({
            empresa: doc.data().empresa,
            sede: doc.data().sede,
            serial: doc.data().serial,
            placa: doc.data().placa,
            fecha: doc.data().fecha,
            observacion: doc.data().observacion
          });
        }); console.log('listado')
        console.log(this.items)
      },
  
      async borrarItem() {
        const ref = doc(db, 'sedesempresa', this.editedItem.keyId);
        await deleteDoc(ref)
          .then(console.log('eliminado'))
          .catch(function (error) {
            console.log(error)
          })
      },
  
      editItem(item) {
        this.editedIndex = this.desserts.indexOf(item)
        this.editedItem = Object.assign({}, item)
        this.dialog = true
      },
  
      deleteItem(item) {
        this.editedIndex = this.desserts.indexOf(item)
        this.editedItem = Object.assign({}, item)
        this.dialogDelete = true
      },
  
      deleteItemConfirm() {
        this.desserts.splice(this.editedIndex, 1)
        this.closeDelete()
        this.borrarItem()
      },
  
      close() {
        this.dialog = false
        this.$nextTick(() => {
          this.editedItem = Object.assign({}, this.defaultItem)
          this.editedIndex = -1
        })
      },
  
      closeDelete() {
        this.dialogDelete = false
        this.$nextTick(() => {
          this.editedItem = Object.assign({}, this.defaultItem)
          this.editedIndex = -1
        })
      },
  
      save() {
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
  
  <style></style>
  