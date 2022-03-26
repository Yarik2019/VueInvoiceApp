<template>
  <div
    @click="checkClick"
    ref="invoiceWrap"
    class="invoice-wrap flex flex-column"
  >
    <from @submit.prevent="submitForm()" class="invoice-content">
      <loading v-show="loading" />
      <h1 v-if="!editInvoice">Новий рахунок-фактура</h1>
      <h1 v-else>Редагувати рахунок-фактуру</h1>
      <!-- bill from -->

      <div class="bill-from flex flex-column">
        <h4>Рахунок від</h4>
        <div class="input flex flex-column">
          <lable for="billerStreetAddress"> Адреса вулиці </lable>
          <input
            required
            type="text"
            id="billerStreetAddress"
            v-model="billerStreetAddress"
          />
        </div>
        <div class="location-details flex">
          <div class="input flex flex-column">
            <lable for="billerCity"> Місто </lable>
            <input required type="text" id="billerCity" v-model="billerCity" />
          </div>
          <div class="input flex flex-column">
            <lable for="billerZipCode"> ЗІП код </lable>
            <input
              required
              type="text"
              id="billerZipCode"
              v-model="billerZipCode"
            />
          </div>
          <div class="input flex flex-column">
            <lable for="billerCountry"> Країна </lable>
            <input
              required
              type="text"
              id="billerCountry"
              v-model="billerCountry"
            />
          </div>
        </div>
      </div>

      <!-- bill to -->
      <div class="bill-to flex flex-column">
        <h4>bill to</h4>
        <div class="input flex flex-column">
          <lable for="clientName"> Ім'я клієнта </lable>
          <input required type="text" id="clientName" v-model="clientName" />
        </div>
        <div class="input flex flex-column">
          <lable for="clientEmail"> Електронна пошта клієнта </lable>
          <input required type="text" id="clientEmail" v-model="clientEmail" />
        </div>
        <div class="input flex flex-column">
          <lable for="clientStreetAddress"> Адреса вулиці </lable>
          <input
            required
            type="text"
            id="clientStreetAddress"
            v-model="clientStreetAddress"
          />
        </div>
        <div class="location-details flex">
          <div class="input flex flex-column">
            <lable for="clientCity"> Місто </lable>
            <input required type="text" id="clientCity" v-model="clientCity" />
          </div>
          <div class="input flex flex-column">
            <lable for="clientZipCode"> ЗІП код </lable>
            <input
              required
              type="text"
              id="clientZipCode"
              v-model="clientZipCode"
            />
          </div>
          <div class="input flex flex-column">
            <lable for="clientCountry"> Країна </lable>
            <input
              required
              type="text"
              id="clientCountry"
              v-model="clientCountry"
            />
          </div>
        </div>
      </div>

      <!-- Invoice Work Details -->

      <div class="invoice-work flex flex-column">
        <div class="payment flex">
          <div class="input flex flex-column">
            <lable for="invoiceDate"> Дата виставлення рахунку </lable>
            <input
              disabled
              type="text"
              id="invoiceDate"
              v-model="invoiceDate"
            />
          </div>
          <div class="input flex flex-column">
            <lable for="paymentDueDate"> Очікуваний платіж </lable>
            <input
              disabled
              type="text"
              id="paymentDueDate"
              v-model="paymentDueDate"
            />
          </div>
        </div>
        <div class="input flex flex-column">
          <lable for="paymentTerms"> Терміни оплати </lable>
          <select required id="paymentTerms" v-model="paymentTerms">
            <option value="30">Чисто 30 днів</option>
            <option value="30">Чисто 60 днів</option>
          </select>
        </div>
        <div class="input flex flex-column">
          <lable for="productDescription"> Опис продукту </lable>
          <input
            required
            type="text"
            id="productDescription"
            v-model="productDescription"
          />
        </div>
        <div class="work-items">
          <h3>Item list</h3>
          <table class="item-list">
            <tr class="table-heading flex">
              <th class="item-name">Назва виробу</th>
              <th class="qty">Кількість</th>
              <th class="price">Ціна</th>
              <th class="total">Всього</th>
            </tr>
            <tr
              class="table-items flex"
              v-for="(item, index) in invoiceItemList"
              :key="index"
            >
              <td class="item-name">
                <input type="text" v-model="item.itemName" />
              </td>
              <td class="qty"><input type="text" v-model="item.qty" /></td>
              <td class="price"><input type="text" v-model="item.price" /></td>
              <td class="total">${{ (item.total = item.qty * item.price) }}</td>
              <img
                @click="deleteInvoiceItem(item.id)"
                src="../assets/icon-delete.svg"
                alt=""
              />
            </tr>
          </table>
          <div @click="addNewInvoiceItem" class="flex button">
            <img src="../assets/icon-plus.svg" alt="" />
            Додати новий елемент
          </div>
        </div>
      </div>

      <!-- Save/Exit -->

      <div class="save flex">
        <div class="left">
          <button @click="closeInvoice" type="button" class="red">
            Скасувати
          </button>
        </div>
        <div class="right flex">
          <button
            v-if="!editInvoice"
            @click="saveDraft()"
            type="submit"
            class="dark-purple"
          >
            Зберегти чернетку
          </button>
          <button
            v-if="!editInvoice"
            @click="publishInvoice()"
            type="submit"
            class="purple"
          >
            Створити рахунок-фактуру
          </button>
          <button
            v-if="editInvoice"
            @click="updateInvoice()"
            type="submit"
            class="purple"
          >
            Оновити рахунок-фактуру
          </button>
        </div>
      </div>
    </from>
  </div>
</template>

<script>
import {
  db,
  doc,
  collection,
  setDoc,
  updateDoc,
} from "../fitebase/fitebaseInit.js";

import loading from "../components/Loading.vue";
import { mapActions, mapMutations, mapState } from "vuex";
import { v4 as uuid } from "uuid";
export default {
  name: "InvoiceModule",
  components: {
    loading,
  },
  data() {
    return {
      dateOptions: { year: "numeric", month: "short", day: "numeric" },
      docId: null,
      loading: null,
      billerStreetAddress: null,
      billerCity: null,
      billerZipCode: null,
      billerCountry: null,
      clientName: null,
      clientEmail: null,
      clientStreetAddress: null,
      clientCity: null,
      clientZipCode: null,
      clientCountry: null,
      invoiceDateUnix: null,
      invoiceDate: null,
      paymentTerms: null,
      paymentDueDateUnix: null,
      paymentDueDate: null,
      productDescription: null,
      invoicePending: null,
      invoiceDraft: null,
      invoiceItemList: [],
      invoiceTotal: 0,
    };
  },
  created() {
    if (!this.editInvoice) {
      this.invoiceDateUnix = Date.now();
      this.invoiceDate = new Date(this.invoiceDateUnix).toLocaleDateString(
        "en-us",
        this.dateOptions
      );
    }

    if (this.editInvoice) {
      const currentInvoice = this.currentInvoiceArray[0];
      this.docId = currentInvoice.docId;
      this.billerStreetAddress = currentInvoice.billerStreetAddress;
      this.billerCity = currentInvoice.billerCity;
      this.billerZipCode = currentInvoice.billerZipCode;
      this.billerCountry = currentInvoice.billerCountry;
      this.clientName = currentInvoice.clientName;
      this.clientEmail = currentInvoice.clientEmail;
      this.clientStreetAddress = currentInvoice.clientStreetAddress;
      this.clientCity = currentInvoice.clientCity;
      this.clientZipCode = currentInvoice.clientZipCode;
      this.clientCountry = currentInvoice.clientCountry;
      this.invoiceDateUnix = currentInvoice.invoiceDateUnix;
      this.invoiceDate = currentInvoice.invoiceDate;
      this.paymentTerms = currentInvoice.paymentTerms;
      this.paymentDueDateUnix = currentInvoice.paymentDueDateUnix;
      this.paymentDueDate = currentInvoice.paymentDueDate;
      this.productDescription = currentInvoice.productDescription;
      this.invoicePending = currentInvoice.invoicePending;
      this.invoiceDraft = currentInvoice.invoiceDraft;
      this.invoiceItemList = currentInvoice.invoiceItemList;
      this.invoiceTotal = currentInvoice.invoiceTotal;
    }
  },

  methods: {
    ...mapMutations([
      "TOGGLE__INVOICE",
      "TOGGLE__MODAL",
      "TOGGLE_EDIT_INVOICES",
    ]),
    ...mapActions(["UPDATE_INVOICE", "GET_INVOICES"]),

    checkClick(event) {
      if (event.target === this.$refs.invoiceWrap) {
        this.TOGGLE__MODAL();
      }
    },

    closeInvoice() {
      this.TOGGLE__INVOICE();
      if (this.editInvoice) {
        this.TOGGLE_EDIT_INVOICES();
      }
    },
    addNewInvoiceItem() {
      this.invoiceItemList.push({
        id: uuid(),
        itemName: "",
        qty: "",
        price: 0,
        total: 0,
      });
    },
    deleteInvoiceItem(deleteId) {
      this.invoiceItemList = this.invoiceItemList.filter(
        (item) => item.id != deleteId
      );
    },
    calInvoiceItem() {
      this.invoiceTotal = 0;
      this.invoiceItemList.forEach((item) => {
        this.invoiceTotal += item.total;
      });
    },

    publishInvoice() {
      this.invoicePending = true;
      this.uploadInvoice();
      this.TOGGLE__INVOICE();
    },

    saveDraft() {
      this.invoiceDraft = true;
      this.uploadInvoice();
      this.TOGGLE__INVOICE();
    },

    async uploadInvoice() {
      if (this.invoiceItemList.length <= 0) {
        alert("Переконайтеся, що ви заповнили робочі пункти!");
        return;
      }

      this.loading = true;

      this.calInvoiceItem();

      console.log(db);
      const dataBase = doc(collection(db, "invoices"));

      await setDoc(dataBase, {
        invoiceId: uuid(6),
        billerStreetAddress: this.billerStreetAddress,
        billerCity: this.billerCity,
        billerZipCode: this.billerZipCode,
        billerCountry: this.billerCountry,
        clientName: this.clientName,
        clientEmail: this.clientEmail,
        clientStreetAddress: this.clientStreetAddress,
        clientCity: this.clientCity,
        clientZipCode: this.clientZipCode,
        clientCountry: this.clientCountry,
        invoiceDate: this.invoiceDate,
        invoiceDateUnix: this.invoiceDateUnix,
        paymentTerms: this.paymentTerms,
        paymentDueDate: this.paymentDueDate,
        paymentDueDateUnix: this.paymentDueDateUnix,
        productDescription: this.productDescription,
        invoiceItemList: this.invoiceItemList,
        invoiceTotal: this.invoiceTotal,
        invoicePending: this.invoicePending,
        invoiceDraft: this.invoiceDraft,
        invoicePaid: null,
      });

      this.loading = false;
      this.GET_INVOICES();
      this.TOGGLE__INVOICE();
    },
    async updateInvoice() {
      if (this.invoiceItemList.length <= 0) {
        alert("Переконайтеся, що ви заповнили робочі пункти!");
        return;
      }

      this.loading = true;

      this.calInvoiceItem();

      console.log(db);
      const dataBase = doc(collection(db, "invoices"), this.docId);

      await updateDoc(dataBase, {
        billerStreetAddress: this.billerStreetAddress,
        billerCity: this.billerCity,
        billerZipCode: this.billerZipCode,
        billerCountry: this.billerCountry,
        clientName: this.clientName,
        clientEmail: this.clientEmail,
        clientStreetAddress: this.clientStreetAddress,
        clientCity: this.clientCity,
        clientZipCode: this.clientZipCode,
        clientCountry: this.clientCountry,
        paymentTerms: this.paymentTerms,
        paymentDueDate: this.paymentDueDate,
        paymentDueDateUnix: this.paymentDueDateUnix,
        productDescription: this.productDescription,
        invoiceItemList: this.invoiceItemList,
        invoiceTotal: this.invoiceTotal,
      });

      this.loading = false;

      const data = {
        docId: this.docId,
        routeId: this.$route.params.invoiceId,
      };

      console.log(data);
      this.UPDATE_INVOICE(data);
      // this.TOGGLE__INVOICE();
    },

    submitForm() {
      if (this.editInvoice) {
        this.updateInvoice();
        return;
      }
      this.uploadInvoice();
    },
  },
  computed: {
    ...mapState(["editInvoice", "currentInvoiceArray"]),
  },
  watch: {
    paymentTerms() {
      const futureDate = new Date();
      this.paymentDueDateUnix = futureDate.setDate(
        futureDate.getDate() + parseInt(this.paymentTerms)
      );
      this.paymentDueDate = new Date(
        this.paymentDueDateUnix
      ).toLocaleDateString("en-us", this.dateOptions);
    },
  },
};
</script>

<style lang='scss' scoped>
.invoice-wrap {
  position: fixed;
  top: 0;
  left: 0;
  background-color: transparent;
  width: 100%;
  height: 100vh;
  overflow: scroll;
  z-index: 10;
  &::-webkit-scrollbar {
    display: none;
  }
  @media (min-width: 900px) {
    left: 90px;
  }

  .invoice-content {
    position: relative;
    padding: 56px;
    max-width: 700px;
    width: 100%;
    background-color: #141625;
    color: #fff;
    box-shadow: 10px 4px 6px -1px rgba(0, 0, 0, 0.2),
      0 2px 4px -1px rgba(0, 0, 0, 0.06);

    h1 {
      margin-bottom: 48px;
      color: #fff;
    }
    h3 {
      margin-bottom: 16px;
      font-size: 18px;
      color: #777f98;
    }
    h4 {
      color: #7c5dfa;
      font-size: 12px;
      margin-bottom: 24px;
    }

    //bill To // bill from

    .bill-to,
    .bill-from {
      margin-bottom: 40px;
      .location-details {
        gap: 16px;
        div {
          flex: 1;
        }
      }
    }

    // invoice work

    .invoice-work {
      .payment {
        gap: 24px;
        div {
          flex: 1;
        }
      }

      .work-items {
        .item-list {
          width: 100%;

          // item table styling

          .table-heading,
          .table-items {
            gap: 16px;
            font-size: 12px;

            .item-name {
              flex-basis: 50%;
            }
            .qty {
              flex-basis: 10%;
            }
            .price {
              flex-basis: 20%;
            }
            .total {
              flex-basis: 20%;
              align-self: center;
            }
          }

          .table-heading {
            margin-bottom: 16px;
            th {
              text-align: left;
            }
          }

          .table-items {
            position: relative;
            margin-bottom: 24px;

            img {
              position: absolute;
              top: 15px;
              right: 0;
              width: 12px;
              height: 16px;
            }
          }
        }

        .button {
          color: #fff;
          background-color: #252945;
          align-items: center;
          justify-content: center;
          width: 100%;

          img {
            margin-right: 4px;
          }
        }
      }
    }
    .save {
      margin-top: 60px;
      div {
        flex: 1;
      }
      .right {
        justify-content: flex-end;
      }
    }
  }
  .input {
    margin-bottom: 24px;
  }

  label {
    font-size: 12px;
    margin-bottom: 6px;
  }

  input,
  select {
    width: 100%;
    background-color: #1e2139;
    color: #fff;
    border-radius: 4px;
    padding: 12px 4px;
    border: none;
    &:focus {
      outline: none;
    }
  }
}
</style>