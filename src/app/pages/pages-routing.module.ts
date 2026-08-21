 import { NgModule } from '@angular/core';
  import { RouterModule, Routes } from '@angular/router';
  import { PagesComponent } from './pages.component';
  import { HomeComponent } from './home/home.component';
  import { QuizComponent } from './quiz/quiz.component';
  import { GeininQuizComponent } from './geinin-quiz/geinin-quiz.component';
  import { GeininSelectComponent } from './geinin-select/geinin-select.component';
  import { StampRallyComponent } from './stamp-rally/stamp-rally.component';
  import { LoginComponent } from './login/login.component';
  import { RankingComponent } from './ranking/ranking.component';
  import { SettingsComponent } from './settings/settings.component';
  import { HowToPlayComponent } from './how-to-play/how-to-play.component';

  const routes: Routes = [
    {
      path: '',
      component: PagesComponent,
      children: [
        { path: '', component: HomeComponent },
        { path: 'quiz', component: QuizComponent },
        { path: 'geinin-quiz', component: GeininSelectComponent },
        { path: 'stamp-rally', component: StampRallyComponent },
        { path: 'login', component: LoginComponent },
        { path: 'ranking', component: RankingComponent },
        { path: 'settings', component: SettingsComponent },
        { path: 'how-to-play', component: HowToPlayComponent },
        { path: 'geinin-quiz/:genre', component: GeininQuizComponent },
      ],
    },
  ];

  @NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
  })
  export class PagesRoutingModule {}