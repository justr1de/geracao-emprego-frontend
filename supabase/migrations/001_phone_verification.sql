-- Tabela para armazenar códigos de verificação de telefone (MFA)
-- Esta tabela é usada para verificação de telefone via SMS/WhatsApp

CREATE TABLE IF NOT EXISTS phone_verification_codes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  phone VARCHAR(11) NOT NULL,
  code VARCHAR(6) NOT NULL,
  method VARCHAR(10) NOT NULL DEFAULT 'whatsapp', -- 'sms' ou 'whatsapp'
  attempts INTEGER DEFAULT 0,
  max_attempts INTEGER DEFAULT 3,
  verified BOOLEAN DEFAULT FALSE,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  verified_at TIMESTAMP WITH TIME ZONE,
  
  -- Índices para busca rápida
  CONSTRAINT valid_method CHECK (method IN ('sms', 'whatsapp'))
);

-- Índice para busca por telefone e código
CREATE INDEX IF NOT EXISTS idx_phone_verification_phone ON phone_verification_codes(phone);
CREATE INDEX IF NOT EXISTS idx_phone_verification_expires ON phone_verification_codes(expires_at);

-- Função para limpar códigos expirados (executar periodicamente)
CREATE OR REPLACE FUNCTION cleanup_expired_phone_codes()
RETURNS void AS $$
BEGIN
  DELETE FROM phone_verification_codes 
  WHERE expires_at < NOW() - INTERVAL '1 hour';
END;
$$ LANGUAGE plpgsql;

-- Política RLS para segurança
ALTER TABLE phone_verification_codes ENABLE ROW LEVEL SECURITY;

-- Apenas o serviço pode acessar esta tabela (via service_role key)
CREATE POLICY "Service role only" ON phone_verification_codes
  FOR ALL
  USING (auth.role() = 'service_role');

-- Comentários para documentação
COMMENT ON TABLE phone_verification_codes IS 'Armazena códigos de verificação de telefone para MFA';
COMMENT ON COLUMN phone_verification_codes.phone IS 'Número de telefone (apenas dígitos, sem formatação)';
COMMENT ON COLUMN phone_verification_codes.code IS 'Código de 6 dígitos enviado ao usuário';
COMMENT ON COLUMN phone_verification_codes.method IS 'Método de envio: sms ou whatsapp';
COMMENT ON COLUMN phone_verification_codes.attempts IS 'Número de tentativas de verificação';
COMMENT ON COLUMN phone_verification_codes.max_attempts IS 'Número máximo de tentativas permitidas';
