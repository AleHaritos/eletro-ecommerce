export interface Produto {
    id?: number,
    preco?: number,
    nome?: string,
    precoOriginal?: number,
    descricao?: string,
    off?: number,
    categoria?: string,
    estoque?:number,
    url?: string,
    isExpand?: boolean
    imagens?: any[]
}

export interface Usuario {
    id?: number,
    email: string,
    senha: string,
    nome: string,
    telefone?: string,
    admin?: boolean
}

export interface DadosFrete {
    valor: string,
    prazo?: string
}

export interface Carrinho {
    id?: number,
    nome?: string,
    preco?: number,
    imagem?: string,
    quantidade: number,
    descricao?: string
    promocao?: boolean
}

export interface Cep {
    bairro?: string,
    logradouro?: string,
    localidade?: string,
    uf?: string,
    cep?: string,
    erro?: boolean,
}


export interface Pedido {
    emailUsuario?: string,
    produtos?: string,
    cep: string,
    logradouro: string,
    valorTotal: number,
    data?: Date
    numero: number
}