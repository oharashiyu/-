import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../shared/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  form: FormGroup;
  isSignUp = false;
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.form = this.fb.group({
      email: [''],
      password: [''],
    });
  }

  submit(): void {
    this.errorMessage = '';
    const { email, password } = this.form.value;

    const action = this.isSignUp
      ? this.authService.signUp(email, password)
      : this.authService.signIn(email, password);

    action
      .then(() => {
        this.router.navigateByUrl('/');
      })
      .catch((error) => {
        this.errorMessage = this.toErrorMessage(error.code);
      });
  }

  toggleMode(): void {
    this.isSignUp = !this.isSignUp;
    this.errorMessage = '';
  }

  private toErrorMessage(code: string): string {
    switch (code) {
      case 'auth/email-already-in-use':
        return 'このメールアドレスは既に使われています。';
      case 'auth/invalid-email':
        return 'メールアドレスの形式が正しくありません。';
      case 'auth/weak-password':
        return 'パスワードは6文字以上にしてください。';
      case 'auth/invalid-credential':
      case 'auth/wrong-password':
      case 'auth/user-not-found':
        return 'メールアドレスまたはパスワードが正しくありません。';
      default:
        return 'エラーが発生しました。もう一度お試しください。';
    }
  }
}
