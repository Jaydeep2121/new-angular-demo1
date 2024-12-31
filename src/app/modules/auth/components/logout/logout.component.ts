import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth/auth.service';
import { SharedModule } from '../../helper/shared.module';

@Component({
  selector: 'app-logout',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './logout.component.html',
  styleUrls: ['./logout.component.scss'],
})
export class LogoutComponent implements OnInit {
  constructor(private authService: AuthService) {
    this.authService.logout();
  }

  ngOnInit(): void {}
}
