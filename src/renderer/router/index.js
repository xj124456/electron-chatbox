import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Index',
      component: require('@/components/index/Index').default
    },
    {
      path: '/add',
      name: 'IndexAdd',
      component: require('@/components/index/IndexAdd').default
    },
    {
      path: '/img-viewer',
      name: 'ImageViewer',
      component: require('@/common/ImageViewer').default
    },
    {
      path: '*',
      redirect: '/'
    }
  ]
})
