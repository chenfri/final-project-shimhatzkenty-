import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ReportMatchesPage } from './report-matches';

@NgModule({
  declarations: [
    ReportMatchesPage,
  ],
  imports: [
    IonicPageModule.forChild(ReportMatchesPage),
  ],
})
export class ReportMatchesPageModule {}
