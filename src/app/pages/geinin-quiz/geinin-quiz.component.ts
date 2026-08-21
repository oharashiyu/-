import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup } from '@angular/forms';
import { DataService } from '../../shared/data.service';
import { ConfirmService } from 'src/app/shared/modal/confirm.service';
import { StampService } from '../../shared/stamp.service';
import { QuizSettingsService } from '../../shared/quiz-settings.service';

@Component({
  selector: 'app-geinin-quiz',
  templateUrl: './geinin-quiz.component.html',
  styleUrls: ['./geinin-quiz.component.scss'],
})
export class GeininQuizComponent implements OnInit, OnDestroy {
  form: FormGroup;

  genre = 'm1';
  genreTitle = '';

  questionText = '';
  answers: string[] = [];
  correctAnswer = '';

  geinins: any[] = [];
  eligibleGeinins: any[] = [];
  usedNames: string[] = [];
  totalQuestions = 5;
  questionNumber = 0;
  correctCount = 0;
  quizFinished = false;
  isLoading = false;
  history: { questionText: string; chosen: string; correctAnswer: string; isCorrect: boolean }[] = [];

  agencyRevealLength = 0;
  membersRevealLength = 0;
  silhouetteRevealPercent = 0;

  timeAttackMode = false;
  timeLimitSeconds = 10;
  timeRemaining = 0;
  private timerHandle: ReturnType<typeof setInterval> | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private dataService: DataService,
    private confirmService: ConfirmService,
    private stampService: StampService,
    private quizSettingsService: QuizSettingsService
  ) {
    this.form = this.fb.group({
      agency: [null],
      members: [null],
    });
  }

  ngOnInit(): void {
    this.totalQuestions = this.quizSettingsService.getQuestionCount();
    this.timeAttackMode = this.quizSettingsService.isTimeAttackMode();
    this.timeLimitSeconds = this.quizSettingsService.getTimeLimitSeconds();
    this.genre = this.route.snapshot.paramMap.get('genre') || 'm1';
    this.genreTitle =
      this.genre === 'm1' ? 'M-1グランプリクイズ' :
      this.genre === 'koc' ? 'キングオブコントクイズ' :
      this.genre === 'silhouette' ? 'シルエットクイズ' :
      '事務所クイズ';

    this.dataService.getGeinin().subscribe((geinins: any) => {
      this.geinins = geinins;

      if (this.genre === 'm1') {
        this.eligibleGeinins = geinins.filter((g: any) => g['m1Years'].length > 0);
      } else if (this.genre === 'koc') {
        this.eligibleGeinins = geinins.filter((g: any) => g['kocYears'].length > 0);
      } else if (this.genre === 'silhouette') {
        this.eligibleGeinins = geinins;
      } else {
        this.eligibleGeinins = geinins.filter((g: any) => g['agency']);
      }

      this.loadNextQuestion();
    });
  }

  loadNextQuestion(): void {
    const availableGeinins = this.eligibleGeinins.filter(
      (g: any) => !this.usedNames.includes(g['name'])
    );
    const randomIndex = Math.floor(Math.random() * availableGeinins.length);
    const geinin = availableGeinins[randomIndex];
    this.usedNames.push(geinin['name']);
    this.questionNumber++;

    const correctAnswer = geinin['name'];
    const dummyCandidates = Array.from(new Set(
      this.eligibleGeinins
        .filter((g: any) => g['name'] !== correctAnswer)
        .filter((g: any) => this.genre !== 'agency' || g['agency'] !== geinin['agency'])
        .filter((g: any) => this.genre !== 'agency' || !geinin['independentAgency'] || !g['independentAgency'])
        .map((g: any) => g['name'])
    ));
    const shuffledDummies = dummyCandidates.sort(() => Math.random() - 0.5);
    const dummyAnswers = shuffledDummies.slice(0, 3);

    const answers = [correctAnswer, ...dummyAnswers].sort(() => Math.random() - 0.5);
    this.answers = answers;
    this.correctAnswer = correctAnswer;

    if (this.genre === 'm1') {
      const years = geinin['m1Years'];
      const year = years[Math.floor(Math.random() * years.length)];
      this.questionText = `${year}年のM-1王者は？`;
    } else if (this.genre === 'koc') {
      const years = geinin['kocYears'];
      const year = years[Math.floor(Math.random() * years.length)];
      this.questionText = `${year}年のキングオブコント王者は？`;
    } else if (this.genre === 'silhouette') {
      this.questionText = `「${geinin['name']}」はどれ？`;
    } else if (geinin['independentAgency']) {
      this.questionText = '個人事務所に所属するコンビは？';
    } else {
      this.questionText = `「${geinin['agency']}」に所属するコンビは？`;
    }

    this.agencyRevealLength = 0;
    this.membersRevealLength = 0;
    this.silhouetteRevealPercent = 0;

    this.form.patchValue({
      agency: geinin['agency'],
      members: geinin['members'].join('、'),
    });

    this.isLoading = false;

    if (this.timeAttackMode) {
      this.startTimer();
    }
  }

  private startTimer(): void {
    this.clearTimer();
    this.timeRemaining = this.timeLimitSeconds;
    this.timerHandle = setInterval(() => {
      this.timeRemaining--;
      if (this.timeRemaining <= 0) {
        this.clearTimer();
        this.selectAnswer('（時間切れ）');
      }
    }, 1000);
  }

  private clearTimer(): void {
    if (this.timerHandle) {
      clearInterval(this.timerHandle);
      this.timerHandle = null;
    }
  }

  ngOnDestroy(): void {
    this.clearTimer();
  }

  selectAnswer(choice: string): void {
    this.clearTimer();
    const isCorrect = choice === this.correctAnswer;

    if (isCorrect) {
      this.correctCount++;
      this.stampService.addCorrectAnswer(this.correctAnswer);
    }

    this.history.push({
      questionText: this.questionText,
      chosen: choice,
      correctAnswer: this.correctAnswer,
      isCorrect,
    });

    let details: string[] = [];
    if (this.genre === 'agency') {
      details = this.answers.map((name) => {
        const g = this.eligibleGeinins.find((x: any) => x['name'] === name);
        return `${name}：${g ? g['agency'] : '不明'}`;
      });
    }

    const bsModalRef = this.confirmService.show(isCorrect, this.correctAnswer, details, this.questionNumber >= this.totalQuestions);
    bsModalRef.onHidden?.subscribe(() => {
      const action = bsModalRef.content?.action;
      if (action === 'home') {
        this.router.navigateByUrl('/');
        return;
      }
      if (action === 'restart') {
        this.restartQuiz();
        return;
      }
      if (this.questionNumber >= this.totalQuestions) {
        this.quizFinished = true;
      } else {
        this.isLoading = true;
        this.loadNextQuestion();
      }
    });
  }

  get correctGeinins(): any[] {
    return this.history
      .filter((h) => h.isCorrect)
      .map((h) => this.eligibleGeinins.find((g: any) => g['name'] === h.correctAnswer))
      .filter(Boolean);
  }

  goHome(): void {
    this.confirmService.confirm('今までの記録は無効になりますがよろしいですか？').subscribe((confirmed) => {
      if (confirmed) {
        this.router.navigateByUrl('/');
      }
    });
  }

  restartQuiz(): void {
    this.usedNames = [];
    this.correctCount = 0;
    this.questionNumber = 0;
    this.quizFinished = false;
    this.isLoading = true;
    this.history = [];
    this.loadNextQuestion();
  }

  onAgencySlide(event: Event): void {
    this.agencyRevealLength = +(event.target as HTMLInputElement).value;
  }

  onMembersSlide(event: Event): void {
    this.membersRevealLength = +(event.target as HTMLInputElement).value;
  }

  onSilhouetteSlide(event: Event): void {
    this.silhouetteRevealPercent = +(event.target as HTMLInputElement).value;
  }

  revealText(fullText: string, length: number): string {
    return (fullText || '').substring(0, length);
  }
}
