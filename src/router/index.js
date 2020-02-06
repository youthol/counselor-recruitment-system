import Vue from 'vue';
import Router from 'vue-router';
import Index from '@/views/Index';
import store from '../store';
import { routes, adminRoutes } from './routes';

Vue.use(Router);

const router = new Router({
  mode: 'hash',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '*',
      component: Index,
      redirect: '/home'
    },
    {
      path: '/',
      component: Index,
      children: [
        ...routes // all of routes
      ],
      redirect: '/home'
    },
    {
      path: '/admin',
      component: Index,
      children: [
        ...adminRoutes // all of routes
      ],
      beforeEnter: (to, from, next) => {
        if (to.matched.some(record => record.meta.authRequired)) {
          if (store.state.login.isAdminLogin) {
            next();
          } else {
            next({
              path: '/admin',
              query: { redirect: to.fullPath }
            });
          }
        } else {
          next();
        }
      }
    }
  ]
});

// FIXME: 检查登录后未区分是前台还是后台
router.beforeEach((to, from, next) => {
  if (to.matched.some(record => record.meta.authRequired)) {
    if (store.state.login.isLogin) {
      next();
    } else {
      next({
        path: '/home',
        query: { redirect: to.fullPath }
      });
    }
  } else {
    next();
  }
});

export default router;
