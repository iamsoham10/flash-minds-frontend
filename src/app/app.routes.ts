import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
    { path: "", loadComponent: () => import("./components/landing-page/landing-page.component").then((c) => c.LandingPageComponent) },
    { path: "auth", loadComponent: () => import("./components/signup/signup.component").then((c) => c.SignupComponent) },
    { path: "dashboard", loadComponent: () => import("./components/dashboard/dashboard.component").then((c) => c.DashboardComponent), canActivate: [authGuard] },
    { path: "dashboard/explore", loadComponent: () => import("./components/explore/explore.component").then((c) => c.ExploreComponent), canActivate: [authGuard] },
    { path: "dashboard/explore/study/:subject", loadComponent: () => import("./components/study/study.component").then((c) => c.StudyComponent), canActivate: [authGuard] },
    { path: "create-set", loadComponent: () => import("./components/create-set/create-set.component").then((c) => c.CreateSetComponent), canActivate: [authGuard] },
];
