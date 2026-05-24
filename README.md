<p align="center">
  <img src="./docs/readme/teatodo-banner.png" alt="TeaToDo - Organização leve, bonita e local-first" width="100%" />
</p>

<h1 align="center">TeaToDo 🍵</h1>

<p align="center">
  Pequenas escolhas, grandes mudanças.
</p>

<p align="center">
  <strong>TeaToDo</strong> é uma aplicação de produtividade local-first inspirada na calma do ritual do chá.
  O projeto une tarefas, listas, calendário, foco, hábitos e personalização em uma interface acolhedora,
  elegante e pensada para tornar a organização diária mais leve.
</p>

<p align="center">
  <img alt="Status" src="https://img.shields.io/badge/status-em%20desenvolvimento-4B7A6B?style=for-the-badge" />
  <img alt="Local First" src="https://img.shields.io/badge/local--first-localStorage-D8C39F?style=for-the-badge" />
  <img alt="Interface" src="https://img.shields.io/badge/UI-responsiva-F3EAD8?style=for-the-badge" />
  <img alt="Idioma" src="https://img.shields.io/badge/idioma-PT--BR-4B7A6B?style=for-the-badge" />
</p>

---

## ✨ Sobre o projeto

O **TeaToDo** nasceu com a proposta de ser mais do que uma lista de tarefas.  
A ideia é criar um ambiente de organização pessoal que combine produtividade com calma, oferecendo ferramentas para planejar o dia, acompanhar hábitos, manter o foco e organizar listas sem depender de conta, servidor ou internet.

A aplicação funciona de forma **local-first**, mantendo os dados salvos diretamente no navegador por meio do `localStorage`. Isso torna a experiência rápida, simples e acessível para uso pessoal.

---

## 🖼️ Prévia

<p align="center">
  <img src="./docs/readme/preview-dashboard.png" alt="Tela inicial do TeaToDo" width="100%" />
</p>

<p align="center">
  <em>Um painel diário com tarefas, prioridades, foco, hábitos, calendário semanal e progresso.</em>
</p>

---

## 🌿 Principais recursos

### Hoje

- Saudação dinâmica baseada no horário local.
- Criação rápida de tarefas.
- Criação detalhada por modal.
- Edição, conclusão e exclusão de tarefas.
- Suporte a subtarefas.
- Prioridade, categoria, data e horário.
- Filtros por tarefas pendentes, concluídas ou todas.
- Cards de prioridades do dia.
- Próximas tarefas.
- Calendário semanal.
- Card de foco.
- Card de hábitos.
- Card de progresso por período.
- Frase motivacional diária em português.

---

### Calendário

- Visualização mensal.
- Agenda do dia selecionado.
- Próximos sete dias.
- Prazos importantes.
- Notas de planejamento.
- Rotinas recorrentes.
- Geração automática de tarefas a partir de rotinas, evitando duplicações.

<p align="center">
  <img src="./docs/readme/preview-calendar.png" alt="Calendário do TeaToDo" width="100%" />
</p>

---

### Foco

O módulo de foco transforma sessões de produtividade em pequenos rituais.

- Timer de foco.
- Presets inspirados em chás.
- Pausa curta e pausa longa.
- Ciclos antes da pausa longa.
- Pausar, retomar, reiniciar, finalizar e interromper sessão.
- Associação de foco com uma tarefa.
- Histórico de sessões.
- Estatísticas de foco do dia.
- Meta diária de foco.
- Configurações de som, notificações e auto-início.

---

### Hábitos

- Criação de hábitos personalizados.
- Presets de hábitos.
- Frequência diária, dias úteis ou dias específicos.
- Hábitos de check ou quantidade.
- Registro por data.
- Incremento e decremento de progresso.
- Grade semanal.
- Estatísticas do dia e da semana.
- Sequências e streaks.
- Ativar, desativar, editar e excluir hábitos.

<p align="center">
  <img src="./docs/readme/preview-focus-habits.png" alt="Foco e hábitos no TeaToDo" width="100%" />
</p>

---

### Listas

O TeaToDo também permite organizar diferentes tipos de listas de forma prática.

#### Modelos disponíveis

- Lista simples.
- Lista de compras.
- Lista de estudos.

#### Funcionalidades

- Busca e filtros por tipo ou status.
- Favoritar listas.
- Arquivar listas.
- Duplicar listas.
- Excluir listas.
- Detalhe editável da lista.
- Itens com categoria, prioridade, data e observação.

#### Lista de compras

- Preço.
- Quantidade.
- Unidade.
- Categoria.
- Orçamento.
- Totais automáticos.

#### Lista de estudos

- Tópico.
- Disciplina.
- Status.
- Dificuldade.
- Tempo estimado.
- Data.

---

### Personalização

A experiência visual é uma parte importante do TeaToDo.

- Temas visuais inspirados em chás.
- Estilo dos cards.
- Escala de fonte.
- Densidade da interface.
- Forma dos ícones.
- Preset padrão de foco.
- Preferências de notificação.
- Papel de parede.
- Upload de imagem personalizada.
- Perfil local com nome, e-mail, fuso horário, idioma e avatar.
- Prévia visual do tema.

<p align="center">
  <img src="./docs/readme/preview-customization.png" alt="Personalização visual do TeaToDo" width="100%" />
</p>

---

## 🎨 Identidade visual

O TeaToDo utiliza uma estética suave, limpa e acolhedora.  
A interface foi pensada para transmitir calma, foco e organização, fugindo da sensação fria e genérica de muitos aplicativos de produtividade.

### Elementos principais

- Paleta inspirada em chás: matcha, oolong, chá preto, jasmim e chai.
- Cards arredondados com sombras leves.
- Fundos claros e textura visual delicada.
- Ícones minimalistas.
- Tipografia elegante para títulos.
- Tipografia legível para textos e ações.
- Componentes com aparência orgânica e pouco agressiva.

### Fontes

- `Fraunces` para títulos e elementos de destaque.
- `DM Sans` para textos, botões, formulários e navegação.

---

## 💾 Dados locais

O TeaToDo não depende de autenticação ou banco externo nesta fase.  
Todos os dados são armazenados localmente no navegador.

### Recursos disponíveis

- Salvamento via `localStorage`.
- Exportação de backup em JSON.
- Importação de backup em JSON.
- Limpeza completa dos dados locais.
- Normalização dos dados salvos para evitar que informações antigas ou corrompidas quebrem a aplicação.

---

## 📱 Responsividade

A interface foi planejada para funcionar tanto em desktop quanto em dispositivos móveis.

- Navegação lateral no desktop.
- Navegação inferior no mobile.
- Layout responsivo básico.
- Modal com fundo desfocado.
- Scrollbar personalizada.
- Cards adaptáveis.
- Hierarquia visual clara.

---

## 🧩 Animações e detalhes visuais

O projeto pode utilizar animações leves para reforçar a experiência acolhedora do sistema.

Uma das possibilidades é utilizar animações Lottie/dotLottie na aplicação, especialmente em elementos como:

- etiqueta animada nas telas principais;
- ícone de chá no foco;
- feedback de tarefa concluída;
- estados vazios;
- tela de boas-vindas;
- pequenas transições de produtividade.

> Observação: no README do GitHub, o ideal é usar imagens, GIFs ou SVGs compatíveis com Markdown.  
> Componentes interativos com JavaScript devem ser usados dentro da aplicação ou em uma página de documentação.

---

## 🛠️ Tecnologias

> Ajuste esta seção de acordo com a stack final do projeto.

- HTML5
- CSS3
- JavaScript / TypeScript
- React
- LocalStorage
- Responsividade
- Componentização
- Lottie/dotLottie para animações na aplicação

---

## 📂 Estrutura sugerida

```bash
TeaToDo/
├── public/
│   ├── images/
│   └── animations/
├── src/
│   ├── assets/
│   ├── components/
│   ├── contexts/
│   ├── hooks/
│   ├── pages/
│   ├── services/
│   ├── styles/
│   └── utils/
├── docs/
│   └── readme/
│       ├── teatodo-banner.png
│       ├── preview-dashboard.png
│       ├── preview-calendar.png
│       ├── preview-focus-habits.png
│       └── preview-customization.png
├── README.md
└── package.json
````

---

## 🚀 Como executar

```bash
# Clone o repositório
git clone https://github.com/seu-usuario/teatodo.git

# Acesse a pasta do projeto
cd teatodo

# Instale as dependências
npm install

# Execute o projeto
npm run dev
```

A aplicação ficará disponível localmente no endereço informado pelo terminal.

---

## 📦 Backup e restauração

Como o TeaToDo trabalha com dados locais, o usuário pode exportar e importar seus próprios dados.

### Exportar

Gera um arquivo `.json` contendo tarefas, listas, hábitos, sessões de foco, preferências e demais dados locais.

### Importar

Restaura os dados a partir de um backup `.json`.

### Limpar dados

Remove todos os dados salvos no navegador e reinicia a experiência local.

---

## 🧭 Roadmap

* [x] Tarefas com prioridade, categoria, data e horário.
* [x] Modal de criação detalhada.
* [x] Subtarefas.
* [x] Calendário mensal.
* [x] Rotinas recorrentes.
* [x] Timer de foco.
* [x] Histórico de sessões de foco.
* [x] Hábitos com check e quantidade.
* [x] Listas simples, de compras e de estudos.
* [x] Personalização visual.
* [x] Backup e restauração local.
* [ ] Melhorias avançadas de responsividade.
* [ ] Mais animações e microinterações.
* [ ] Modo instalação/PWA.
* [ ] Sincronização opcional em nuvem.
* [ ] Dashboard de estatísticas avançadas.
* [ ] Mais temas visuais.
* [ ] Testes automatizados.

---

## 🤎 Conceito

O TeaToDo parte de uma ideia simples:

> Produtividade não precisa parecer pressão.
> Ela pode ser leve, bonita e construída uma pequena tarefa por vez.

---

## 👤 Autor

Desenvolvido por **Matheus Fernandes**.

<p align="left">
  <a href="https://github.com/ChaMatteCoder">
    <img src="https://img.shields.io/badge/GitHub-Cha-Matte-4B7A6B?style=for-the-badge&logo=github&logoColor=white" />
  </a>
  <a href="mailto:chamattheus@gmail.com">
    <img src="https://img.shields.io/badge/Email-contato-D8C39F?style=for-the-badge&logo=gmail&logoColor=3A3A3A" />
  </a>
</p>

---

<p align="center">
  <strong>TeaToDo</strong> — organize seu dia com calma.
</p>
