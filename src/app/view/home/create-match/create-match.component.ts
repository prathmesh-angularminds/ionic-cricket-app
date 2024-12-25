import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Data } from 'src/app/models/data';
import { CommonService } from 'src/app/service/common.service';

@Component({
  selector: 'app-create-match',
  templateUrl: './create-match.component.html',
  styleUrls: ['./create-match.component.scss'],
})
export class CreateMatchComponent  implements OnInit, OnDestroy {

  match!: FormGroup;
  backUrl: string = '/home/match-list';
  constructor(
    private fb: FormBuilder,
    public data: Data,
    public commonService: CommonService,
    public activatedRoute: ActivatedRoute,
    public router: Router
  ) { }

  ngOnInit() {
    this.activatedRoute.queryParams.subscribe((params: any) => {
      if(params.isNewMatch) {
        this.commonService.initDataValues();
        this.router.navigate(['/home/create-new-match'],{queryParams: {}})
      }
      this.createNewMatch();
    })
  }

  createNewMatch() {
    this.match = this.fb.group({
      overs: [this.data.overs,Validators.required],
      isTeamOverSelected: [false],
      teamName: [""]
    })
  }

  get overs() {
    return this.match.get('overs')
  }

  get isTeamOverSelected(): any {
    return this.match.get('isTeamOverSelected')
  }

  get teamName(): any {
    return this.match.get('teamName')
  }

  changeOver(changeType: boolean) {
    let overs = this.overs?.value;
    if(changeType && ((overs + 1) <= 10)) {
      this.overs?.patchValue(overs + 1);
    } else if(!changeType && ((overs - 1) >= 0)) {
      this.overs?.patchValue(overs - 1);
    }
  }

  ngOnDestroy(): void {
    this.data.overs = this.overs?.value
    this.data.tossWinningTeam = this.teamName?.value
  }

}
