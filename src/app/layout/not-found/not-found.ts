import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { PageHeader } from '@shared/ui/page-header/page-header';

@Component({
  selector: 'app-not-found',
  imports: [RouterLink, ButtonModule, PageHeader],
  templateUrl: './not-found.html',
})
export class NotFound {}
