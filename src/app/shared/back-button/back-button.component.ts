import { Component, Input, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-back-button',
  templateUrl: './back-button.component.html',
  styleUrls: ['./back-button.component.scss'],
  standalone: true,
  imports: [RouterLink]
})
export class BackButtonComponent  implements OnInit {

  @Input() url!: string;
  constructor() { }

  ngOnInit() {}

}
