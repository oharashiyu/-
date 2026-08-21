import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { AuthService } from '../../shared/auth.service';
import { StampService } from '../../shared/stamp.service';
import { QuizSettingsService } from '../../shared/quiz-settings.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {
  form: FormGroup;
  isLoggedIn = false;
  saved = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private stampService: StampService,
    private quizSettingsService: QuizSettingsService
  ) {
    this.form = this.fb.group({
      username: [''],
      questionCount: [5],
      timeAttackMode: [false],
      timeLimitSeconds: [10],
    });
  }

  ngOnInit(): void {
    const user = this.authService.currentUser$.value;
    this.isLoggedIn = !!user;
    this.form.patchValue({
      username: user?.displayName || '',
      questionCount: this.quizSettingsService.getQuestionCount(),
      timeAttackMode: this.quizSettingsService.isTimeAttackMode(),
      timeLimitSeconds: this.quizSettingsService.getTimeLimitSeconds(),
    });
  }

  save(): void {
    this.saved = false;
    this.quizSettingsService.setQuestionCount(+this.form.value.questionCount);
    this.quizSettingsService.setTimeAttackMode(!!this.form.value.timeAttackMode);
    this.quizSettingsService.setTimeLimitSeconds(+this.form.value.timeLimitSeconds);

    const username = (this.form.value.username || '').trim();
    if (this.isLoggedIn && username) {
      this.authService.updateDisplayName(username).then(() => {
        this.stampService.syncRanking();
        this.saved = true;
      });
    } else {
      this.saved = true;
    }
  }
}
