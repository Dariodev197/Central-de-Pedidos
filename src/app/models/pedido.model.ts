// ============================================================
// pedido.model.ts  (versao final — substitui o arquivo inteiro)
// Alinhado com o JSON da API TLPP v6.
// ============================================================

export interface PedidoBloqueado {
  pedido: string;
  cliente: string;
  nome: string;
  vendedor: string;
  emissao: string;
  limite: number;
  saldo: number;
  bloqueio: string;
  valor: number;    // soma dos itens do pedido (API v5+)
  motivo: string;   // texto do bloqueio (API v5+)
  nfiscal: string;  // NF gerada — vazio enquanto bloqueado (API v6+)
  serie: string;    // serie da NF — vazio enquanto bloqueado (API v6+)
}

/**
 * Pedido já faturado (C9_BLCRED = '10').
 * O endpoint /faturados devolve os mesmos campos da listagem de
 * bloqueados, com nfiscal/serie preenchidos e motivo = "Faturado".
 */
export type PedidoFaturado = PedidoBloqueado;

export interface ItemPedido {
  item: string;
  produto: string;
  descri: string;
  qtd: number;
  preco: number;
  valor: number;
}

export interface PedidoDetalhe {
  pedido: string;
  cliente: string;
  nome: string;
  vendedor: string;
  emissao: string;
  condpag: string;
  limite: number;
  saldo: number;
  valor: number;
  itens: ItemPedido[];
}