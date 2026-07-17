import { Injectable } from '@angular/core';

/**
 * Controla o tema claro/escuro do painel via CSS variables.
 *
 * CLARO  -> nenhuma alteracao: visual padrao Protheus intacto.
 * ESCURO -> classe 'tema-escuro' no <html>, que inverte os tokens
 *           neutros do PO-UI no styles.css (fundos escuros, textos
 *           claros), preservando o azul Protheus nas acoes.
 *
 * A escolha fica no localStorage.
 */
@Injectable({ providedIn: 'root' })
export class TemaService {
  private readonly CHAVE = 'pedido-credito:tema';

  get escuro(): boolean {
    return localStorage.getItem(this.CHAVE) === 'dark';
  }

  aplicarTemaSalvo(): void {
    this.aplicar(this.escuro);
  }

  alternar(): void {
    this.aplicar(!this.escuro);
  }

  private aplicar(escuro: boolean): void {
    document.documentElement.classList.toggle('tema-escuro', escuro);
    localStorage.setItem(this.CHAVE, escuro ? 'dark' : 'light');
  }
}
