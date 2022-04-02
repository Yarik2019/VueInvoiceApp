<template>
  <header class="flex"  v-if="user">
    <router-link to="/" class="branding flex">
      <img src="@/assets/file-invoice-dollar-solid.png" alt="" />
    </router-link>
    <br />
    <button @click="logout" class="branding flex">
      <img class="logout-img" src="@/assets/logout.svg" alt="" />
    </button>
  </header>
</template>

<script>
import { mapActions, mapState } from "vuex";
export default {
  name: "navigation",

  created() {
    this.FETCH_USER();
  },
  methods: {
    ...mapActions(["FETCH_USER", "LOGOUT"]),
    logout() {
      this.LOGOUT();
    },
  },
  computed: {
    ...mapState(["user"]),
  },
};
</script>

<style lang='scss'>

header {
  z-index: 99;
  flex-direction: row;
  background-color: #1e2139;
  @media (min-width: 900px) {
    min-height: 100%;
    min-width: 90px;
    flex-direction: column;
    border-radius: 0 20px 20px 0;
  }
  .branding {
    border-radius: 0 20px 20px 0;
    background-color: #7c5dfa;
    justify-content: center;
    padding: 24px;
    @media (min-width: 900px) {
      width: 100px;
    }
    img {
      width: auto;
      height: 30px;
    }

    .logout-img{
      transform: rotate(180deg);
    }
  }
}
</style>