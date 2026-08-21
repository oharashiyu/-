import { ConfirmModule } from '../shared/modal/confirm/confirm.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { MatToolbarModule } from '@angular/material/toolbar';

import { PagesRoutingModule } from './pages-routing.module';
import { PagesComponent } from './pages.component';
import { HeaderComponent } from './shared/header/header.component';
import { SideMenuComponent } from './shared/side-menu/side-menu.component';
import { QuizComponent } from './quiz/quiz.component';
import { HomeComponent } from './home/home.component';
import { GeininQuizComponent } from './geinin-quiz/geinin-quiz.component';
import { GeininSelectComponent } from './geinin-select/geinin-select.component';
import { StampRallyComponent } from './stamp-rally/stamp-rally.component';
import { LoginComponent } from './login/login.component';
import { RankingComponent } from './ranking/ranking.component';
import { SettingsComponent } from './settings/settings.component';
import { HowToPlayComponent } from './how-to-play/how-to-play.component';


@NgModule({
  declarations: [
    PagesComponent,
    HeaderComponent,
    SideMenuComponent,
    QuizComponent,
    HomeComponent,
    GeininQuizComponent,
    GeininSelectComponent,
    StampRallyComponent,
    LoginComponent,
    RankingComponent,
    SettingsComponent,
    HowToPlayComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ConfirmModule,
    PagesRoutingModule,
    MatToolbarModule
  ]
})
export class PagesModule { }
