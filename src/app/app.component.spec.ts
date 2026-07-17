import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { PoToolbarModule, PoToolbarAction } from '@po-ui/ng-components';
import { TemaService } from './services/tema.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, PoToolbarModule],  // adiciona PoToolbarModule aos teus imports
  templateUrl: './app.component.html',
})
export class AppComponent implements OnInit {

  constructor(public tema: TemaService) {}   // public: o template lê tema.escuro

  ngOnInit(): void {
    this.tema.aplicarTemaSalvo();            // aplica o tema salvo na abertura do app
  }

  /** Ícone da toolbar: lua no claro (ir pra noite), sol no escuro (voltar pro dia). */
  get iconeTema(): string {
    return this.tema.escuro ? 'an an-sun' : 'an an-moon';
  }

  get acoesTema(): PoToolbarAction[] {
    return [
      {
        label: this.tema.escuro ? 'Modo claro' : 'Modo escuro',
        action: () => this.tema.alternar(),
      },
    ];
  }
}