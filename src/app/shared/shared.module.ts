import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PipeImgPipe } from './pipes/pipe-img.pipe';
import { PipeKindPipe } from './pipes/pipe-kind.pipe';

@NgModule({
  declarations: [PipeImgPipe, PipeKindPipe],
  imports: [CommonModule],
  exports: [PipeKindPipe, PipeImgPipe],
})
export class SharedModule {}
