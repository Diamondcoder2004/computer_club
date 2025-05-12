import { createRouter, createWebHistory } from 'vue-router';
import LoginView from '@/userviews/LoginView.vue';
import RegisterView from '@/userviews/RegisterView.vue';
import HomeView from '@/userviews/HomeView.vue';
import NotFoundView from '@/userviews/NotFoundView.vue';
import ProfileView from "@/userviews/ProfileView.vue";
import SnacksView from "@/userviews/SnacksView.vue";
import BookingView from "@/userviews/BookingView.vue";
import HomeManageView from "@/managerViews/HomeManageView.vue";
import ReportsView from "@/managerViews/ReportsView.vue";
import CreateComputerView from "@/managerViews/CreateComputerView.vue";
import BalanceView from "@/managerViews/BalanceView.vue";

const routes = [
    { path: '/', redirect: '/login' }, // Редирект на страницу входа
    { path: '/login', name: 'Login', component: LoginView },
    { path: '/register', name: 'Register', component: RegisterView },
    { path: '/home', name: 'Home', component: HomeView, meta: { requiresAuth: true } }, // Защищенный маршрут
    { path: '/:pathMatch(.*)*', name: 'NotFound', component: NotFoundView }, // Страница 404

    { path: '/profile', name: 'ProfilePage', component: ProfileView },
    { path: '/snacks', name: 'SnacksPage', component: SnacksView },
    { path: '/booking', name: 'BookingPage', component: BookingView },
    { path: '/manage',  name: 'ManagePage', component: HomeManageView,  meta: { requiresAuth: true, requiresStaff: true }},
    { path: '/report',  name: 'ReportPage', component: ReportsView,  meta: { requiresAuth: true, allowedRoles: [1, 2] } },
    { path: '/manage/create-computer', name: 'CreateComputerPage', component: CreateComputerView,   meta: { requiresAuth: true, allowedRoles: [1] } },
    { path: '/manage/top-up-balance', name: 'BalancePage', component: BalanceView ,   meta: { requiresAuth: true, allowedRoles: [1] } }



];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

// Защита маршрутов
router.beforeEach((to, from, next) => {
    const isAuthenticated = !!localStorage.getItem('userId');
    const roleIdStr = localStorage.getItem('role_id');
    const roleId = roleIdStr ? parseInt(roleIdStr, 10) : null;

    if (to.meta.requiresAuth && !isAuthenticated) {
        next('/login'); // Неавторизован
    } else if (to.meta.requiresStaff && roleId === 3) {
        next('/home'); // Редирект с /manage на /home
    } else if (to.meta.allowedRoles && !to.meta.allowedRoles.includes(roleId)) {
        next('/reports'); // Нет прав → редирект на отчеты
    } else {
        next(); // Все ок
    }
});

export default router;