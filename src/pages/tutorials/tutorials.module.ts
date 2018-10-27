import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TutorialsPage } from './tutorials';

import { EscapeHtmlPipe } from '../../pipes/keep-html.pipe';

@NgModule({
  declarations: [
    TutorialsPage,
    EscapeHtmlPipe
  ],
  imports: [
    IonicPageModule.forChild(TutorialsPage),
  ],
})
export class TutorialsPageModule {}
