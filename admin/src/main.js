// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
require('./assets/less/base.less');

Vue.config.productionTip = false;
Vue.use(ElementUI);
Array.prototype.indexOf = function(val) {
  for (var i = 0; i < this.length; i++) {
    if (this[i] == val) return i;
  }
  return -1;
};
Array.prototype.remove = function(val) {
  var index = this.indexOf(val);
  if (index > -1) {
    this.splice(index, 1);
  }
};
router.beforeEach((to, from, next) => {
  if (to.matched.length === 0) { //匹配前往的路由不存在
    next('/error');
  } else {
    if (to.meta.active) {
      sessionStorage.setItem('active', to.meta.active);
      sessionStorage.setItem('navName', to.meta.navName);
    }

    next();
  }
});
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
});
