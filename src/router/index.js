import Vue from 'vue'
import Router from 'vue-router'
import HelloWorld from '@/components/HelloWorld'
import Category from '@/pages/Category'
import Article from '@/pages/Article'
import User from '@/pages/User'
import Exam from '@/pages/Exam'
import ExamCreate from '@/pages/exam/ExamCreate'
import ExamPlace from '@/pages/exam/ExamPlace'
import Customer from '@/pages/Customer'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      component: HelloWorld
    },{
      path: '/category',
      component: Category
    },{
      path: '/article',
      component: Article
    },{
      path: '/user',
      component: User
    },{
      path: '/exam',
      component: Exam,
      children:[{
        path: 'create',// /exam/create
        component: ExamCreate
      },{
        path: 'place',
        component: ExamPlace
      }]
    },{
      path: '/customer',
      component: Customer
      }
  ]
})
