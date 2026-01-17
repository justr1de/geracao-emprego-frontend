import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function checkCandidato() {
  const cpf = '90351797220';
  
  console.log('Buscando candidato com CPF:', cpf);
  
  const { data, error } = await supabase
    .from('candidatos')
    .select('*')
    .eq('cpf', cpf);
  
  if (error) {
    console.error('Erro:', error);
  } else {
    console.log('Candidato encontrado:', data);
  }
  
  // Também verificar no Auth
  const { data: users } = await supabase.auth.admin.listUsers();
  const user = users.users.find(u => u.email === 'ranieri.braga@teste.com');
  console.log('Usuário no Auth:', user ? { id: user.id, email: user.email } : 'Não encontrado');
}

checkCandidato().catch(console.error);
