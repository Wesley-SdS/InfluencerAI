# InfluencerAI

Plataforma para criação de influenciadores digitais com IA. Gere imagens e vídeos promocionais usando os melhores modelos de IA disponíveis no Replicate.

![Next.js](https://img.shields.io/badge/Next.js-16-black?style=flat-square&logo=next.js)
![React](https://img.shields.io/badge/React-19-blue?style=flat-square&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=flat-square&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-38B2AC?style=flat-square&logo=tailwind-css)

## Funcionalidades

### Geração de Imagens
- **Nano Banana (Google Gemini 2.5)** - Modelo padrão com suporte a edição de imagens
- **Flux Pro/Schnell/Dev** - Modelos Black Forest Labs de alta qualidade
- **Stable Diffusion 3** - Modelo Stability AI
- **SDXL Lightning** - Geração ultra-rápida
- Seleção de aspect ratio (1:1, 4:3, 16:9, etc.)
- Edição de imagens geradas com prompts de refinamento
- Download das imagens em PNG

### Geração de Vídeos
- **Veo 3 (Google)** - Modelo padrão com áudio e alta qualidade
- **MiniMax Video-01 / Hailuo 2.3** - Movimentos cinematográficos
- **Wan 2.5 I2V** - Image-to-video com física realista
- **Kling 2.5 Turbo Pro** - Movimento suave
- **PixVerse V5** - Efeitos visuais aprimorados
- **Seedance Pro Fast** - Geração econômica
- **HunyuanVideo** - Open source, até 16s
- **Luma Ray 2** - Vídeo fotorrealista

### Configurações Avançadas de Vídeo (Veo 3)
- Duração: 4, 6 ou 8 segundos
- Resolução: 720p ou 1080p
- Proporção: 16:9 (paisagem) ou 9:16 (retrato)
- Toggle de áudio (com/sem som)
- Prompt negativo para excluir elementos

### Refinador de Prompts
- Integração com OpenAI (GPT-5.x, GPT-4.x, O-Series)
- Integração com Google Gemini (3.x, 2.5, 2.0)
- Melhora automaticamente seus prompts para resultados otimizados

### Outros Recursos
- Histórico de gerações
- Tema claro/escuro
- Interface responsiva
- Busca de modelos no Replicate em tempo real

## Tecnologias

- **Framework**: Next.js 16 com App Router e Turbopack
- **UI**: React 19, Tailwind CSS 4, Radix UI, shadcn/ui
- **API de IA**: Replicate SDK 1.4.0
- **Validação**: Zod
- **Formulários**: React Hook Form
- **Ícones**: Lucide React
- **Animações**: Tailwind Animate
- **Analytics**: Vercel Analytics

## Instalação

### Pré-requisitos
- Node.js 18+
- pnpm, npm ou yarn
- Conta no [Replicate](https://replicate.com) para obter API key

### Passos

1. Clone o repositório:
```bash
git clone https://github.com/seu-usuario/influencer-platform.git
cd influencer-platform
```

2. Instale as dependências:
```bash
pnpm install
# ou
npm install
```

3. Inicie o servidor de desenvolvimento:
```bash
pnpm dev
# ou
npm run dev
```

4. Acesse http://localhost:3000

5. Vá em **Configurações** e adicione sua chave API do Replicate

## Configuração de APIs

### Replicate (Obrigatório)
1. Crie uma conta em [replicate.com](https://replicate.com)
2. Vá em Account Settings > API Tokens
3. Copie seu token e cole nas Configurações do app

### OpenAI (Opcional - para refinador de prompts)
1. Crie uma conta em [platform.openai.com](https://platform.openai.com)
2. Vá em API Keys e crie uma nova chave
3. Cole nas Configurações do app

### Google AI (Opcional - para refinador de prompts)
1. Acesse [aistudio.google.com](https://aistudio.google.com)
2. Crie uma API key
3. Cole nas Configurações do app

## Estrutura do Projeto

```
influencer-platform/
├── app/                          # App Router (Next.js)
│   ├── api/                      # API Routes
│   │   └── replicate/            # Endpoints Replicate
│   │       ├── generate-image/   # Geração de imagens
│   │       ├── generate-video/   # Geração de vídeos
│   │       └── models/           # Listagem de modelos
│   ├── dashboard/                # Páginas do dashboard
│   │   ├── image-generator/      # Gerador de imagens
│   │   ├── video-generator/      # Gerador de vídeos
│   │   ├── history/              # Histórico
│   │   └── settings/             # Configurações
│   ├── layout.tsx                # Layout raiz
│   └── page.tsx                  # Landing page
├── components/                   # Componentes React
│   ├── image-generator/          # Componentes de imagem
│   │   ├── model-selector.tsx
│   │   ├── prompt-input.tsx
│   │   ├── image-preview.tsx
│   │   ├── image-edit-dialog.tsx
│   │   └── aspect-ratio-selector.tsx
│   ├── video-generator/          # Componentes de vídeo
│   │   ├── video-model-selector.tsx
│   │   ├── video-settings.tsx
│   │   ├── product-prompt-input.tsx
│   │   ├── source-image-selector.tsx
│   │   └── video-preview.tsx
│   ├── ui/                       # Componentes base (shadcn)
│   ├── providers/                # Context providers
│   └── shared/                   # Componentes compartilhados
├── lib/                          # Utilitários e lógica
│   ├── context/                  # React Contexts
│   │   ├── replicate-context.tsx
│   │   └── generation-context.tsx
│   ├── hooks/                    # Custom hooks
│   │   ├── use-image-generation.ts
│   │   ├── use-video-generation.ts
│   │   └── use-replicate-models.ts
│   └── types/                    # TypeScript types
│       ├── models.ts             # Definições de modelos
│       ├── replicate.ts          # Tipos Replicate
│       └── generation.ts         # Estados de geração
└── public/                       # Assets estáticos
    └── icon.svg                  # Favicon
```

## Modelos de IA Suportados

### Imagem

| Modelo | Provider | Descrição | Edição |
|--------|----------|-----------|--------|
| Nano Banana | Google | Gemini 2.5 multimodal | Sim |
| Flux Pro | Black Forest Labs | Alta qualidade | Não |
| Flux Schnell | Black Forest Labs | Rápido | Não |
| Flux Dev | Black Forest Labs | Desenvolvimento | Não |
| Stable Diffusion 3 | Stability AI | Última versão SD | Não |
| SDXL Lightning | ByteDance | Ultra-rápido | Não |

### Vídeo

| Modelo | Provider | Áudio | I2V | Duração |
|--------|----------|-------|-----|---------|
| Veo 3 | Google | Sim | Sim | 4-8s |
| MiniMax Video-01 | MiniMax | Não | Sim | 6s |
| MiniMax Hailuo 2.3 | MiniMax | Não | Sim | 10s |
| Wan 2.5 I2V | Wan Video | Não | Sim | - |
| Kling 2.5 Turbo Pro | Kuaishou | Não | Sim | - |
| PixVerse V5 | PixVerse | Não | Sim | 8s |
| Seedance Pro Fast | ByteDance | Não | Sim | - |
| HunyuanVideo | Tencent | Não | Sim | 16s |
| Luma Ray 2 | Luma | Não | Sim | - |

*I2V = Image-to-Video (suporta imagem de referência)*

## Scripts Disponíveis

```bash
# Desenvolvimento
pnpm dev

# Build de produção
pnpm build

# Iniciar produção
pnpm start

# Linting
pnpm lint
```

## Custos de API

Os custos variam conforme o modelo usado. Alguns exemplos:

### Veo 3 (Google)
- Com áudio: $0.40/segundo (~$3.20 para 8s)
- Sem áudio: $0.20/segundo (~$1.60 para 8s)

### Outros modelos
Consulte [replicate.com/pricing](https://replicate.com/pricing) para preços atualizados.

## Contribuindo

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/nova-feature`)
3. Commit suas mudanças (`git commit -m 'Adiciona nova feature'`)
4. Push para a branch (`git push origin feature/nova-feature`)
5. Abra um Pull Request

## Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## Suporte

Se encontrar algum problema ou tiver sugestões:
- Abra uma [issue](https://github.com/seu-usuario/influencer-platform/issues)
- Entre em contato pelo email: seu-email@exemplo.com

---

Desenvolvido com Next.js, React e Replicate API
