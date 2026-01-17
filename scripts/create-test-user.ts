import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

async function createTestUser() {
  const email = 'ranieri.braga@teste.com';
  const password = 'Teste@123';
  const cpf = '90351797220';
  const nome = 'Ranieri Braga dos Santos';
  const telefone = '69999999999';

  console.log('Criando usuário de teste...');

  // 1. Criar usuário no Supabase Auth
  const { data: authData, error: authError } = await supabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true, // Auto-confirmar email para teste
    user_metadata: {
      nome_completo: nome,
      tipo_usuario: 1,
    }
  });

  if (authError) {
    if (authError.message.includes('already registered')) {
      console.log('Usuário já existe no Auth, buscando...');
      const { data: users } = await supabase.auth.admin.listUsers();
      const existingUser = users.users.find(u => u.email === email);
      if (existingUser) {
        console.log('Usuário encontrado:', existingUser.id);
        
        // Verificar se candidato já existe
        const { data: candidato } = await supabase
          .from('candidatos')
          .select('*')
          .eq('cpf', cpf)
          .single();
        
        if (candidato) {
          console.log('Candidato já existe:', candidato);
        } else {
          // Criar candidato
          const { error: candidatoError } = await supabase
            .from('candidatos')
            .insert({
              user_id: existingUser.id,
              nome_completo: nome,
              cpf,
              telefone,
              email,
              genero: 'masculino',
            });
          
          if (candidatoError) {
            console.error('Erro ao criar candidato:', candidatoError);
          } else {
            console.log('Candidato criado com sucesso!');
          }
        }
      }
    } else {
      console.error('Erro ao criar usuário:', authError);
      return;
    }
  } else {
    console.log('Usuário criado no Auth:', authData.user.id);

    // 2. Criar registro na tabela candidatos
    const { error: candidatoError } = await supabase
      .from('candidatos')
      .insert({
        user_id: authData.user.id,
        nome_completo: nome,
        cpf,
        telefone,
        email,
        genero: 'masculino',
      });

    if (candidatoError) {
      console.error('Erro ao criar candidato:', candidatoError);
      // Rollback
      await supabase.auth.admin.deleteUser(authData.user.id);
    } else {
      console.log('Candidato criado com sucesso!');
    }
  }

  console.log('\n=== CREDENCIAIS DE TESTE ===');
  console.log('CPF: 903.517.972-20');
  console.log('Email: ranieri.braga@teste.com');
  console.log('Senha: Teste@123');
  console.log('============================');
}

createTestUser().catch(console.error);
