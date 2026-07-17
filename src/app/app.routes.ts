import { Routes } from '@angular/router';
import { LiberacaoComponent } from './pages/liberacao/liberacao.component';
import { FaturadosComponent } from './pages/faturados/faturados.component';

export const routes: Routes = [
  { path: 'liberacao', component: LiberacaoComponent },
  { path: 'faturados', component: FaturadosComponent },
  { path: '', redirectTo: '/liberacao', pathMatch: 'full' },
];
