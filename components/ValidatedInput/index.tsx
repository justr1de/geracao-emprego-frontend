'use client'

import { useState, useEffect, useCallback } from 'react'
import { Check, X, Loader2, AlertCircle } from 'lucide-react'
import { LGPDTooltip } from '@/components/LGPDTooltip'
import styles from './index.module.css'

interface ValidationResult {
  valid: boolean
  message: string
}

interface ValidatedInputProps {
  id: string
  label: string
  type?: string
  placeholder?: string
  value: string
  onChange: (value: string) => void
  mask?: (value: string) => string
  validate?: (value: string) => ValidationResult
  asyncValidate?: (value: string) => Promise<ValidationResult>
  minLength?: number
  maxLength?: number
  required?: boolean
  disabled?: boolean
  icon?: React.ReactNode
  lgpdInfo?: {
    reason: string
    legalBasis: string
    retention: string
    sensitive?: boolean
    optional?: boolean
  }
  debounceMs?: number
  showValidation?: boolean
  className?: string
}

export function ValidatedInput({
  id,
  label,
  type = 'text',
  placeholder,
  value,
  onChange,
  mask,
  validate,
  asyncValidate,
  minLength,
  maxLength,
  required = false,
  disabled = false,
  icon,
  lgpdInfo,
  debounceMs = 500,
  showValidation = true,
  className
}: ValidatedInputProps) {
  const [isTouched, setIsTouched] = useState(false)
  const [isValidating, setIsValidating] = useState(false)
  const [validationResult, setValidationResult] = useState<ValidationResult | null>(null)
  const [debouncedValue, setDebouncedValue] = useState(value)

  // Debounce para validação assíncrona
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value)
    }, debounceMs)

    return () => clearTimeout(timer)
  }, [value, debounceMs])

  // Validação síncrona
  const runSyncValidation = useCallback((val: string): ValidationResult | null => {
    if (!val && required) {
      return { valid: false, message: `${label} é obrigatório` }
    }

    if (val && minLength && val.length < minLength) {
      return { valid: false, message: `Mínimo de ${minLength} caracteres` }
    }

    if (validate && val) {
      return validate(val)
    }

    return null
  }, [validate, required, minLength, label])

  // Validação assíncrona
  useEffect(() => {
    const runAsyncValidation = async () => {
      if (!asyncValidate || !debouncedValue || !isTouched) return

      // Primeiro, executa validação síncrona
      const syncResult = runSyncValidation(debouncedValue)
      if (syncResult && !syncResult.valid) {
        setValidationResult(syncResult)
        return
      }

      setIsValidating(true)
      try {
        const result = await asyncValidate(debouncedValue)
        setValidationResult(result)
      } catch (error) {
        console.error('Erro na validação:', error)
        setValidationResult({ valid: false, message: 'Erro ao validar' })
      } finally {
        setIsValidating(false)
      }
    }

    runAsyncValidation()
  }, [debouncedValue, asyncValidate, isTouched, runSyncValidation])

  // Validação síncrona imediata
  useEffect(() => {
    if (!isTouched || asyncValidate) return

    const result = runSyncValidation(value)
    if (result) {
      setValidationResult(result)
    } else if (value) {
      setValidationResult({ valid: true, message: 'Válido' })
    } else {
      setValidationResult(null)
    }
  }, [value, isTouched, asyncValidate, runSyncValidation])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let newValue = e.target.value
    
    if (mask) {
      newValue = mask(newValue)
    }
    
    if (maxLength && newValue.length > maxLength) {
      return
    }
    
    onChange(newValue)
  }

  const handleBlur = () => {
    setIsTouched(true)
  }

  const getValidationIcon = () => {
    if (!showValidation || !isTouched) return null

    if (isValidating) {
      return <Loader2 className={styles.validatingIcon} size={18} />
    }

    if (validationResult) {
      if (validationResult.valid) {
        return <Check className={styles.validIcon} size={18} />
      }
      return <X className={styles.invalidIcon} size={18} />
    }

    return null
  }

  const inputClassName = [
    styles.input,
    icon ? styles.hasIcon : '',
    validationResult && isTouched ? (validationResult.valid ? styles.valid : styles.invalid) : '',
    className
  ].filter(Boolean).join(' ')

  return (
    <div className={styles.container}>
      <div className={styles.labelRow}>
        <label htmlFor={id} className={styles.label}>
          {label}
          {required && <span className={styles.required}>*</span>}
        </label>
        {lgpdInfo && (
          <LGPDTooltip
            reason={lgpdInfo.reason}
            legalBasis={lgpdInfo.legalBasis}
            retention={lgpdInfo.retention}
            sensitive={lgpdInfo.sensitive}
            optional={lgpdInfo.optional}
          />
        )}
      </div>

      <div className={styles.inputWrapper}>
        {icon && <span className={styles.icon}>{icon}</span>}
        <input
          id={id}
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={handleChange}
          onBlur={handleBlur}
          disabled={disabled}
          className={inputClassName}
          aria-invalid={validationResult && !validationResult.valid ? 'true' : 'false'}
          aria-describedby={validationResult ? `${id}-validation` : undefined}
        />
        <span className={styles.validationIcon}>
          {getValidationIcon()}
        </span>
      </div>

      {validationResult && isTouched && !validationResult.valid && (
        <div id={`${id}-validation`} className={styles.errorMessage} role="alert">
          <AlertCircle size={14} />
          <span>{validationResult.message}</span>
        </div>
      )}
    </div>
  )
}
