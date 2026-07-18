import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  PoPageModule,
  PoWidgetModule,
  PoListViewModule,
  PoInfoModule,
  PoTagModule,
  PoButtonModule,
  PoLoadingModule,
  PoNotificationService,
  PoDialogService,
  PoPageAction,
} from '@po-ui/ng-components';
import { PedidoService } from '../../services/pedido.service';
import { PedidoBloqueado, PedidoDetalhe, ItemPedido } from '../../models/pedido.model';
import { TemaService } from '../../services/tema.service';
import { FormsModule } from '@angular/forms';
import { PoFieldModule } from '@po-ui/ng-components';
/**
 * Central de Liberação de Crédito.
 *
 * Usa componentes PO-UI que dão uma cara de "painel de operação":
 *  - po-list-view : cada pedido é um card expansível (não tabela)
 *  - po-info      : pares label/valor no detalhe
 *  - po-tag       : etiqueta colorida do motivo do bloqueio
 *  - po-widget    : blocos de resumo no topo
 *
 * O financeiro vê os pedidos travados, expande pra ver os detalhes
 * e o consumo de limite do cliente, e libera ou rejeita.
 * Filtro local por pedido, cliente (nome ou código).
 */
@Component({
  selector: 'app-liberacao',
  standalone: true,
  imports: [
    CommonModule,
    PoPageModule,
    PoWidgetModule,
    PoListViewModule,
    PoInfoModule,
    PoTagModule,
    PoButtonModule,
    PoLoadingModule,
    FormsModule,
    PoFieldModule,
  ],
  templateUrl: './liberacao.component.html',
})
export class LiberacaoComponent implements OnInit {
  pedidos: PedidoBloqueado[] = [];
  detalhes: Record<string, PedidoDetalhe> = {}; // cache de detalhe por pedido
  filtro = ''; // filtro local (pedido, nome ou código do cliente)
  carregando = false;
  processando = ''; // número do pedido em processamento

  acoesPagina: PoPageAction[] = [
    { label: 'Atualizar', icon: 'po-icon-refresh', action: () => this.carregar() },
  ];

  constructor(
    private service: PedidoService,
    private notification: PoNotificationService,
    private dialog: PoDialogService,
    private tema: TemaService
  ) {}

  ngOnInit(): void {
    this.tema.aplicarTemaSalvo();
    this.carregar();
  }

  carregar(): void {
    this.carregando = true;
    this.service.listarBloqueados().subscribe({
      next: (resp) => {
        this.pedidos = resp.items ?? [];
        this.carregando = false;
      },
      error: () => {
        this.notification.error('Erro ao carregar pedidos bloqueados.');
        this.carregando = false;
      },
    });
  }

  /** Lista exibida: aplica o filtro por pedido, nome ou código do cliente. */
  get pedidosFiltrados(): PedidoBloqueado[] {
    const termo = this.filtro.trim().toLowerCase();
    if (!termo) {
      return this.pedidos;
    }
    return this.pedidos.filter(p =>
      (p.pedido  || '').toLowerCase().includes(termo) ||
      (p.nome    || '').toLowerCase().includes(termo) ||
      (p.cliente || '').toLowerCase().includes(termo)
    );
  }

  // ----- Resumo (cards) -----

  get totalPedidos(): number {
    return this.pedidos.length;
  }

  get valorTotal(): number {
    // 'valor' vem direto na listagem (API v5)
    return this.pedidos.reduce((soma, p) => soma + (p.valor || 0), 0);
  }

  get clientesUnicos(): number {
    return new Set(this.pedidos.map((p) => p.cliente)).size;
  }

  /** Cor da po-tag conforme o tipo de bloqueio. */
  corTag(bloqueio: string): string {
    // 01 = limite insuficiente (vermelho), 04 = vencido (laranja)
    if (bloqueio === '04') return 'color-08'; // amarelo/laranja
    return 'color-07'; // vermelho
  }

  /** trackBy dos itens do pedido (resolve o aviso NG0955 de chaves duplicadas). */
  trackItem(_index: number, it: ItemPedido): string {
    return it.item + '|' + it.produto;
  }

  /** Percentual do limite consumido (para exibição). */
  percentualLimite(det: PedidoDetalhe): number {
    if (!det || !det.limite || det.limite === 0) return 0;
    const consumido = ((det.saldo + det.valor) / det.limite) * 100;
    return Math.min(Math.round(consumido), 100);
  }

  /** Carrega o detalhe ao expandir um card (lazy). */
  aoExpandir(pedido: PedidoBloqueado): void {
    const num = pedido?.pedido;

    if (!num) {
      this.notification.error('Número do pedido não encontrado.');
      return;
    }

    if (this.detalhes[num]) {
      return; // já carregado
    }

    this.service.buscarDetalhe(num).subscribe({
      next: (det) => {
        this.detalhes[num] = det;
      },
      error: () => {
        this.notification.warning(`Não foi possível carregar o detalhe do pedido ${num}.`);
      },
    });
  }

  // ----- Ações -----

  confirmarLiberacao(pedido: PedidoBloqueado): void {
    this.dialog.confirm({
      title: 'Liberar crédito',
      message: `Confirma a liberação de crédito do pedido ${pedido.pedido} — ${pedido.nome}?`,
      confirm: () => this.liberar(pedido),
    });
  }

  private liberar(pedido: PedidoBloqueado): void {
    this.processando = pedido.pedido;
    this.service.liberar(pedido.pedido).subscribe({
      next: () => {
        this.notification.success(`Pedido ${pedido.pedido} liberado com sucesso.`);
        this.processando = '';
        this.carregar();
      },
      error: (err) => {
        const msg = err?.error?.erro ?? 'Erro ao liberar o pedido.';
        this.notification.error(msg);
        this.processando = '';
      },
    });
  }

  confirmarRejeicao(pedido: PedidoBloqueado): void {
    this.dialog.confirm({
      title: 'Rejeitar liberação',
      message: `Confirma a REJEIÇÃO da liberação do pedido ${pedido.pedido}? O pedido permanecerá bloqueado.`,
      confirm: () => this.rejeitar(pedido),
    });
  }

  private rejeitar(pedido: PedidoBloqueado): void {
    this.processando = pedido.pedido;
    this.service.rejeitar(pedido.pedido).subscribe({
      next: () => {
        this.notification.success(`Liberação do pedido ${pedido.pedido} rejeitada.`);
        this.processando = '';
        this.carregar();
      },
      error: (err) => {
        const msg = err?.error?.erro ?? 'Erro ao rejeitar o pedido.';
        this.notification.error(msg);
        this.processando = '';
      },
    });
  }
}
