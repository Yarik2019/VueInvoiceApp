import { createStore } from 'vuex';
import {
  db, collection, doc, getDocs,
  updateDoc, deleteDoc,
  auth
} from '../fitebase/fitebaseInit';

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut
} from 'firebase/auth'
import router from '../router';
export default createStore({
  state: {
    invoiceData: [],
    invoiceModal: null,
    modalActive: null,
    invoiceLoaded: null,
    currentInvoiceArray: null,
    editInvoice: null,
    user: null,

  },
  mutations: {
    TOGGLE__INVOICE(state) {
      state.invoiceModal = !state.invoiceModal;
    },
    TOGGLE__MODAL(state) {
      state.modalActive = !state.modalActive;
    },
    SET_INVOICE_DATA(state, payload) {
      state.invoiceData.push(payload);

    },
    INVOICES_LOADED(state) {
      state.invoiceLoaded = true;
    },

    SET_CURRENT_INVOICE(state, payload) {
      state.currentInvoiceArray = state.invoiceData.filter(invoice => {
        return invoice.invoiceId === payload;
      })
    },
    TOGGLE_EDIT_INVOICES(state) {
      state.editInvoice = !state.editInvoice;
    },
    DELETE_INVOICE(state, payload) {
      state.invoiceData = state.invoiceData.filter(invoice => invoice.docId !== payload);
    },
    UPDATE_STATUS_TO_PAID(state, payload) {
      state.invoiceData.forEach(invoice => {
        if (invoice.docId === payload) {
          invoice.invoicePaid = true;
          invoice.invoicePending = false;

        }
      })
    },
    UPDATE_STATUS_TO_PENDING(state, payload) {
      state.invoiceData.forEach(invoice => {
        if (invoice.docId === payload) {
          invoice.invoicePaid = false;
          invoice.invoicePending = true;
          invoice.invoiceDraft = false;

        }
      })
    },


    // login regiser

    SET_USER(state, payload) {
      state.user = payload;
    },
    CLEAR_USER(state) {
      state.user = null;
    }

  },
  actions: {
    async GET_INVOICES({ commit, state }) {
      const getData = collection(db, 'invoices');
      const results = await getDocs(getData);

      results.forEach(doc => {
        if (!state.invoiceData.some(invoice => invoice.docId === doc.id)) {
          const data = {
            docId: doc.id,
            invoiceId: doc.data().invoiceId,
            billerStreetAddress: doc.data().billerStreetAddress,
            billerCity: doc.data().billerCity,
            billerZipCode: doc.data().billerZipCode,
            billerCountry: doc.data().billerCountry,
            clientName: doc.data().clientName,
            clientEmail: doc.data().clientEmail,
            clientStreetAddress: doc.data().clientStreetAddress,
            clientCity: doc.data().clientCity,
            clientZipCode: doc.data().clientZipCode,
            clientCountry: doc.data().clientCountry,
            invoiceDateUnix: doc.data().invoiceDateUnix,
            invoiceDate: doc.data().invoiceDate,
            paymentTerms: doc.data().paymentTerms,
            paymentDueDateUnix: doc.data().paymentDueDateUnix,
            paymentDueDate: doc.data().paymentDueDate,
            productDescription: doc.data().productDescription,
            invoiceItemList: doc.data().invoiceItemList,
            invoiceTotal: doc.data().invoiceTotal,
            invoicePending: doc.data().invoicePending,
            invoiceDraft: doc.data().invoiceDraft,
            invoicePaid: doc.data().invoicePaid,
          };
          commit('SET_INVOICE_DATA', data)
        }
      });

      commit('INVOICES_LOADED');

    },
    async UPDATE_INVOICE({ commit, dispatch }, { docId, routeId }) {
      commit('DELETE_INVOICE', docId);
      await dispatch('GET_INVOICES');
      commit('TOGGLE__INVOICE');
      commit('TOGGLE_EDIT_INVOICES');
      commit('SET_CURRENT_INVOICE', routeId);
    },

    async DELETE_INVOICE({ commit }, docId) {
      const getInvoice = doc(collection(db, "invoices"), docId);
      await deleteDoc(getInvoice);
      commit('DELETE_INVOICE', docId)
    },
    async UPDATE_STATUS_TO_PAID({ commit }, docId) {
      const getInvoice = doc(collection(db, "invoices"), docId);
      await updateDoc(getInvoice, {
        invoicePaid: true,
        invoicePending: false,
      });
      commit('UPDATE_STATUS_TO_PAID', docId);
    },
    async UPDATE_STATUS_TO_PENDING({ commit }, docId) {
      const getInvoice = doc(collection(db, "invoices"), docId);
      await updateDoc(getInvoice, {
        invoicePaid: false,
        invoicePending: true,
        invoiceDraft: false,
      });
      commit('UPDATE_STATUS_TO_PENDING', docId);
    },

    // login regiser
    

    async LOGIN({ commit }, details) {
      const { email, password } = details
      console.log(email, password);

      try {
        await signInWithEmailAndPassword(auth, email, password)
      } catch (error) {
        switch (error.code) {
          case 'auth/user-not-found':
            alert("User not found")
            break
          case 'auth/wrong-password':
            alert("Wrong password")
            break
          default:
            alert("Something went wrong")
        }

        return
      }

      commit('SET_USER', auth.currentUser)

      router.push('/')
    },

   
    async REGISTER ({ commit}, details) {
      const { email, password } = details
      console.log(email, password);
     try {
       await createUserWithEmailAndPassword(auth, email, password)
     } catch (error) {
       switch(error.code) {
         case 'auth/email-already-in-use':
           alert("Email already in use")
           break
         case 'auth/invalid-email':
           alert("Invalid email")
           break
         case 'auth/operation-not-allowed':
           alert("Operation not allowed")
           break
         case 'auth/weak-password':
           alert("Weak password")
           break
         default:
           alert("Something went wrong")
       }

       return
     }

     commit('SET_USER', auth.currentUser)

     router.push('/')
   },


    async LOGOUT({ commit }) {

      await signOut(auth);

      commit('CLEAR_USER');

      router.push('/login');
    },

    FETCH_USER({commit}) {
      auth.onAuthStateChanged(async (user) =>{
        if(user === null){
          commit('CLEAR_USER');
        }else{
          commit('CLEAR_USER', user);
          if(router.isReady() && router.currentRoute.value.path === '/login'){
            router.push('/')
          }
        }
      })
    }
  },
  modules: {

  }
})
