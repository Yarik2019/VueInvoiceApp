<template>
  <div class="modal flex">
    <div class="modal-content">
      <p>Ти впевнений, що хочеш вийти? Ваші зміни не будуть збережені?</p>
      <div class="actions flex">
        <button @click="closeModal" class="purple">Повернення</button>
        <button @click="closeInvoice" class="red">Закрити</button>
      </div>
    </div>
  </div>
</template>

<script>
import { mapMutations, mapState } from "vuex";

export default {
  name: "modal",

  methods: {
    ...mapMutations(["TOGGLE__MODAL", "TOGGLE__INVOICE", 'TOGGLE_EDIT_INVOICES']),
    closeModal() {
      this.TOGGLE__MODAL();
    },
    closeInvoice() {
      if(this.editInvoice){
        this.TOGGLE_EDIT_INVOICES();
      }
        this.TOGGLE__MODAL();
        this.TOGGLE__INVOICE();
    },
  },
  computed:{
    ...mapState(['editInvoice'])
  }
};
</script>

<style lang='scss'>
.modal {
  z-index: 100;
  position: fixed;
  justify-content: center;
  align-items: center;
  height: 100vh;
  width: 100%;

  .modal-content {
    border-radius: 20px;
    padding: 48px 32px;
    max-width: 450px;
    background-color: #252945;
    color: #fff;
    p {
      text-align: center;
    }
    .actions {
      margin-top: 24px;

      button {
        flex: 1;
      }
    }
  }
}
</style>