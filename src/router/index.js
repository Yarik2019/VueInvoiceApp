import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import {
  auth
} from '../fitebase/fitebaseInit';
const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
    meta:{
      requiresAuth: true
    }
  },
  {
    path: '/invoice/:invoiceId',
    name: 'Invoice',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/InvoiceView.vue'),
    meta:{
      requiresAuth: true
    }
  },

  {
    path: '/login',
    name: 'login',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/LoginAndRegister.vue')
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

router.beforeEach((to, form, next)=>{
  if(to.path === '/login' && auth.currentUser){
    next('/')
    return;
    
  }

  if(to.matched.some(record => record.meta.requiresAuth) && !auth.currentUser){
    next('/login')
    return;
  }
  
  next();

})

export default router
