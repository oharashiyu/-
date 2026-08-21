import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup } from '@angular/forms';
import { DataService } from '../../shared/data.service';
import { ConfirmService } from 'src/app/shared/modal/confirm.service';
import { QuizSettingsService } from '../../shared/quiz-settings.service';

@Component({
  selector: 'app-quiz',
  templateUrl: './quiz.component.html',
  styleUrls: ['./quiz.component.scss'],
})
export class QuizComponent implements OnInit, OnDestroy {
  form: FormGroup;
  choices: string[] = ['ラフレシア', 'ナッシー', 'ディグダ', 'トサキント'];

  questionText = '';
  answers: string[] = [];
  correctAnswer = '';
  questionColumn ='';
  resultMessage = '';
  pokemons: any[] = [];
  isLoading = false;
  totalQuestions = 5;
  questionNumber = 0;
  correctCount = 0;
  usedNos: number[] = [];
  quizFinished = false;
  history: { questionText: string; chosen: string; correctAnswer: string; isCorrect: boolean }[] = [];
  showNameHint = false;
  showTypesHint = false;
  showEvolutionsHint = false;
  showAbilitiesHint = false;
  showHiddenAbilitiesHint = false;

  timeAttackMode = false;
  timeLimitSeconds = 10;
  timeRemaining = 0;
  private timerHandle: ReturnType<typeof setInterval> | null = null;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private dataService: DataService,
    private confirmService: ConfirmService,
    private quizSettingsService: QuizSettingsService
  ) {
    this.form = this.fb.group({
      number: [null],
      name: [null],
      types: [null],
      abilities: [null],
      hiddenAbilities: [null],
      evolutions: [null],
      status: [null],
    });
  }

   ngOnInit(): void {
    this.totalQuestions = this.quizSettingsService.getQuestionCount();
    this.timeAttackMode = this.quizSettingsService.isTimeAttackMode();
    this.timeLimitSeconds = this.quizSettingsService.getTimeLimitSeconds();
    this.dataService.getPokemons().subscribe((pokemons: any) => {
      this.pokemons = pokemons;
      this.loadNextQuestion();
    });
  }

   loadNextQuestion(): void {
    const availablePokemons = this.pokemons.filter(
      (p: any) => !this.usedNos.includes(p['no'])
    );
    const randomIndex = Math.floor(Math.random() * availablePokemons.length);
    const pokemon = availablePokemons[randomIndex];
    this.usedNos.push(pokemon['no']);
    this.questionNumber++;
    const questionTypes = [
      { column: 'types', question: 'このポケモンのタイプは？' },
      { column: 'abilities', question: 'このポケモンのとくせいは？' },
      { column: 'hiddenAbilities', question: 'このポケモンのかくれとくせいは？' },
    ];
    const questionIndex = Math.floor(Math.random() * questionTypes.length);
    const questionType = questionTypes[questionIndex];
    const correctAnswerList = pokemon[questionType.column];
    const correctAnswer = correctAnswerList[Math.floor(Math.random() *
  correctAnswerList.length)];
    const dummyCandidates = Array.from(new Set(
      this .pokemons
        .filter((p: any) => p['no'] !== pokemon['no'])
        .map((p: any) => p[questionType.column])
        .flat()
        .filter((value: string) => value !== correctAnswer)
    ));
    const shuffledDummies = dummyCandidates.sort(() => Math.random() - 0.5);
    const dummyAnswers = shuffledDummies.slice(0, 3);

    const answers = [correctAnswer, ...dummyAnswers].sort(() => Math.random() -
  0.5);
    this.questionText = questionType.question;
    this.answers = answers;
    this.correctAnswer = correctAnswer;
    this.questionColumn = questionType.column;
    this.resultMessage = '';
    this.showNameHint = false;
    this.showTypesHint = false;
    this.showEvolutionsHint = false;
    this.showAbilitiesHint = false;
    this.showHiddenAbilitiesHint = false;

    this.form.patchValue({
      number: pokemon['no'],
      name: pokemon['name'],
      types: pokemon['types'].join(','),
      abilities: pokemon['abilities'],
      hiddenAbilities: pokemon['hiddenAbilities'],
      evolutions: pokemon['evolutions'].length > 0 ? 'する' : 'しない',
      status: pokemon['status'],
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
    this.resultMessage = isCorrect
      ? '正解！'
      : `残念、正解は${this.correctAnswer}でした`;
    this.form.patchValue({ status: isCorrect ? '正解' : '不正解' });

    if (isCorrect) {
      this.correctCount++;
    }

    this.history.push({
      questionText: this.questionText,
      chosen: choice,
      correctAnswer: this.correctAnswer,
      isCorrect,
    });

    const bsModalRef = this.confirmService.show(isCorrect, this.correctAnswer, [], this.questionNumber >= this.totalQuestions);
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

  restartQuiz(): void {
    this.usedNos = [];
    this.correctCount = 0;
    this.questionNumber = 0;
    this.quizFinished = false;
    this.isLoading = true;
    this.history = [];
    this.loadNextQuestion();
  }

}