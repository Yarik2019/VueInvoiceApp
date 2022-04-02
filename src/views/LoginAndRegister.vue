<template>
  <div class="login">
    <section class="formss">
      <div class="my_login_password">
        <sapn class="my_login_password_red">Password: Hellow </sapn>
        <span class="my_login_password_white">Login: hello@gmail.com</span>
      </div>
      <form class="register" @submit.prevent="register">
        <h2>Register</h2>
        <input
         class="inputs"
          type="email"
          placeholder="Email address"
          v-model="register_form.email"
        />
        <input
          class="inputs"
          type="password"
          placeholder="Password"
          v-model="register_form.password"
        />
        <input  class="inputs" type="submit" value="Register" />
      </form>

      <form class="login" @submit.prevent="login">
        <h2>Login</h2>
        <input
         class="inputs"
          type="email"
          placeholder="Email address"
          v-model="login_form.email"
        />
        <input
         class="inputs"
          type="password"
          placeholder="Password"
          v-model="login_form.password"
        />
        <input  class="inputs" type="submit" value="Login" />
      </form>
    </section>
  </div>
</template>

<script>
import {mapActions} from 'vuex'
export default {
  data() {
    return {
      register_form: {
        email: null,
        password: null,
      },
      login_form: {
        email: null,
        password: null,
      },
    };
  },
  methods:{
      ...mapActions(['LOGIN', 'REGISTER' ]),
      

      register(){
         this.REGISTER(this.register_form)
      },
      login(){
           this.LOGIN(this.login_form)
      }

  }
};
</script>

<style>
.forms {
  display: flex;
  flex-direction: row;
  min-height: 100vh;
}

form {
  flex: 1 1 0%;
  padding: 8rem 1rem 1rem;
}

.my_login_password {
  position: fixed;
  transform: translateX(50%);
  top: 2%;
  right: 50%;
}

.my_login_password_red {
  color: #fff;
  background-color: #252945;
  padding: 20px;
}

.my_login_password_white {
  background: #fff;
}

form.register {
  color: #fff;
 background-color: #252945;
}
form.login{
  color: #fff;
}

h2 {
  font-size: 2rem;
  text-transform: uppercase;
  margin-bottom: 2rem;
}

.inputs {
  appearance: none;
  border: none;
  outline: none;
  background: none;

  display: block;
  width: 100%;
  max-width: 400px;
  margin: 0 auto;
  font-size: 1.5rem;
  margin-bottom: 2rem;
  padding: 0.5rem 0rem;
}

input:not([type="submit"]) {
  opacity: 0.8;
  transition: 0.4s;
}

input:focus:not([type="submit"]) {
  opacity: 1;
}

input::placeholder {
  color: inherit;
}

form.register input:not([type="submit"]) {
  color: #fff;
  border-bottom: 2px solid #fff;
}

form.login input:not([type="submit"]) {
  color: #2c3e50;
  border-bottom: 2px solid #2c3e50;
}

form.login input[type="submit"] {
  background-color: #252945;
  color: #fff;
  font-weight: 700;
  padding: 1rem 2rem;
  border-radius: 0.5rem;
  cursor: pointer;
  text-transform: uppercase;
}

form.register input[type="submit"] {
  background-color: #fff;
  color: #252945;
  font-weight: 700;
  padding: 1rem 2rem;
  border-radius: 0.5rem;
  cursor: pointer;
  text-transform: uppercase;
}
</style>