import { usePage } from '@inertiajs/react'

// Small hand-rolled dictionary instead of a library: this app has ~10 pages
// of static copy, not a translation pipeline with editors/exports, so a
// plain object plus a lookup function is proportionate (a library like
// react-i18next would be a lot of dependency for this scale).
const dictionaries = {
  en: {
    nav: {
      dashboard: 'Dashboard',
      users: 'Users',
      importUsers: 'Import users',
      myProfile: 'My profile',
      signOut: 'Sign out',
      toggleLanguage: 'Toggle language',
      toggleTheme: 'Toggle theme',
    },
    role: { admin: 'admin', user: 'user' },
    sessions: {
      title: 'Sign in to Umanni Admin',
      subtitle: 'Manage users, roles, and imports',
      email: 'Email',
      password: 'Password',
      submit: 'Sign in',
      createAccount: 'Create an account',
    },
    registrations: {
      title: 'Create your account',
      subtitle: 'Join as a standard user',
      fullName: 'Full name',
      email: 'Email',
      password: 'Password',
      submit: 'Register',
    },
    profile: {
      editProfile: 'Edit profile',
      changePhoto: 'Change photo',
      fullName: 'Full name',
      save: 'Save',
      deleteAccount: 'Delete my account',
      confirmDelete: 'Delete your account? This cannot be undone.',
    },
    dashboard: {
      greetingMorning: 'Good morning',
      greetingAfternoon: 'Good afternoon',
      greetingEvening: 'Good evening',
      subtitle: "Here's what's happening with your team today.",
      live: 'Live',
      totalUsers: 'Total users',
      onePerson: 'Person on the platform',
      manyPeople: 'People on the platform right now',
      administrators: 'Administrators',
      administratorsDescription: 'Can manage users, imports, and settings',
      standardUsers: 'Standard users',
      standardUsersDescription: 'Can view and edit their own profile',
    },
    users: {
      oneUser: 'user',
      manyUsers: 'users',
      newUser: 'New user',
      editUser: 'Edit user',
      name: 'Name',
      email: 'Email',
      role: 'Role',
      actions: 'Actions',
      edit: 'Edit',
      toggleRole: 'Toggle role',
      delete: 'Delete',
      // The only function-valued entry in this dictionary (needs the user's
      // name interpolated) -- call it as t('users.confirmDelete')(name), not
      // as a plain t() result.
      confirmDelete: name => `Delete ${name}?`,
      fullName: 'Full name',
      password: 'Password',
      create: 'Create',
      save: 'Save',
    },
    imports: {
      title: 'Upload a spreadsheet',
      description: 'CSV or XLSX. New users are always created with the standard role.',
      dropzone: 'Click to choose a .csv or .xlsx file, or drag it here',
      chooseAnother: 'Choose a different file',
      remove: 'Remove file',
      upload: 'Upload',
      status: 'Status',
      processed: 'Processed',
    },
  },
  'pt-BR': {
    nav: {
      dashboard: 'Painel',
      users: 'Usuários',
      importUsers: 'Importar usuários',
      myProfile: 'Meu perfil',
      signOut: 'Sair',
      toggleLanguage: 'Alternar idioma',
      toggleTheme: 'Alternar tema',
    },
    role: { admin: 'admin', user: 'usuário' },
    sessions: {
      title: 'Entrar no Umanni Admin',
      subtitle: 'Gerencie usuários, cargos e importações',
      email: 'Email',
      password: 'Senha',
      submit: 'Entrar',
      createAccount: 'Criar uma conta',
    },
    registrations: {
      title: 'Crie sua conta',
      subtitle: 'Cadastre-se como usuário padrão',
      fullName: 'Nome completo',
      email: 'Email',
      password: 'Senha',
      submit: 'Cadastrar',
    },
    profile: {
      editProfile: 'Editar perfil',
      changePhoto: 'Trocar foto',
      fullName: 'Nome completo',
      save: 'Salvar',
      deleteAccount: 'Excluir minha conta',
      confirmDelete: 'Excluir sua conta? Isso não pode ser desfeito.',
    },
    dashboard: {
      greetingMorning: 'Bom dia',
      greetingAfternoon: 'Boa tarde',
      greetingEvening: 'Boa noite',
      subtitle: 'Veja o que está acontecendo com seu time hoje.',
      live: 'Ao vivo',
      totalUsers: 'Total de usuários',
      onePerson: 'Pessoa na plataforma',
      manyPeople: 'Pessoas na plataforma agora',
      administrators: 'Administradores',
      administratorsDescription: 'Podem gerenciar usuários, importações e configurações',
      standardUsers: 'Usuários padrão',
      standardUsersDescription: 'Podem ver e editar o próprio perfil',
    },
    users: {
      oneUser: 'usuário',
      manyUsers: 'usuários',
      newUser: 'Novo usuário',
      editUser: 'Editar usuário',
      name: 'Nome',
      email: 'Email',
      role: 'Cargo',
      actions: 'Ações',
      edit: 'Editar',
      toggleRole: 'Alternar cargo',
      delete: 'Excluir',
      confirmDelete: name => `Excluir ${name}?`,
      fullName: 'Nome completo',
      password: 'Senha',
      create: 'Criar',
      save: 'Salvar',
    },
    imports: {
      title: 'Enviar uma planilha',
      description: 'CSV ou XLSX. Novos usuários são sempre criados com o cargo padrão.',
      dropzone: 'Clique para escolher um arquivo .csv ou .xlsx, ou arraste aqui',
      chooseAnother: 'Escolher outro arquivo',
      remove: 'Remover arquivo',
      upload: 'Enviar',
      status: 'Status',
      processed: 'Processados',
    },
  },
}

export function useTranslation() {
  const { locale } = usePage().props
  const dict = dictionaries[locale] || dictionaries.en

  function t(key) {
    const value = key.split('.').reduce((node, part) => node?.[part], dict)
    return value ?? key
  }

  return { t, locale: locale && dictionaries[locale] ? locale : 'en' }
}
