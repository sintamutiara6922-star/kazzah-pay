'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { QUICK_AMOUNTS } from '@/lib/constants'
import { formatCurrency } from '@/lib/utils'
import { Calculator } from 'lucide-react'

interface AmountSelectorProps {
  value: number
  onChange: (value: number) => void
  minAmount?: number
  maxAmount?: number
  fee?: number
  feePercent?: number
}

export function AmountSelector({
  value,
  onChange,
  minAmount = 1000,
  maxAmount = 10000000,
  fee = 0,
  feePercent = 0,
}: AmountSelectorProps) {
  const [customAmount, setCustomAmount] = useState('')

  const handleQuickSelect = (amount: number) => {
    onChange(amount)
    setCustomAmount('')
  }

  const handleCustomChange = (val: string) => {
    const numVal = val.replace(/\D/g, '')
    setCustomAmount(numVal)
    const amount = parseInt(numVal) || 0
    onChange(amount)
  }

  const totalFee = fee + Math.floor((value * feePercent) / 100)
  const receivedAmount = value - totalFee

  return (
    <div className="space-y-4">
      <div>
        <Label>Pilih Nominal Cepat</Label>
        <div className="mt-2 grid grid-cols-3 gap-2 sm:grid-cols-5">
          {QUICK_AMOUNTS.map((amount) => (
            <Button
              key={amount}
              type="button"
              variant={value === amount ? 'default' : 'outline'}
              className="h-auto py-3"
              onClick={() => handleQuickSelect(amount)}
            >
              <div className="flex flex-col">
                <span className="text-xs text-muted-foreground">Rp</span>
                <span className="font-semibold">{(amount / 1000).toFixed(0)}K</span>
              </div>
            </Button>
          ))}
        </div>
      </div>

      <div>
        <Label htmlFor="custom-amount">Atau Masukkan Nominal</Label>
        <div className="relative mt-2">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
            Rp
          </span>
          <Input
            id="custom-amount"
            type="text"
            placeholder="0"
            value={customAmount || (value > 0 && !QUICK_AMOUNTS.includes(value as any) ? value.toString() : '')}
            onChange={(e) => handleCustomChange(e.target.value)}
            className="pl-10 text-lg font-semibold tabular-nums"
          />
        </div>
        <p className="mt-1 text-xs text-muted-foreground">
          Min: {formatCurrency(minAmount)} - Max: {formatCurrency(maxAmount)}
        </p>
      </div>

      {value > 0 && (
        <div className="rounded-lg border border-border bg-muted/50 p-4">
          <div className="flex items-center gap-2 text-sm font-medium">
            <Calculator className="h-4 w-4" />
            <span>Ringkasan Pembayaran</span>
          </div>
          <div className="mt-3 space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Nominal</span>
              <span className="font-medium tabular-nums">{formatCurrency(value)}</span>
            </div>
            {totalFee > 0 && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Biaya Admin</span>
                <span className="font-medium tabular-nums text-destructive">
                  -{formatCurrency(totalFee)}
                </span>
              </div>
            )}
            <div className="flex justify-between border-t border-border pt-2">
              <span className="font-semibold">Total Diterima</span>
              <span className="text-lg font-bold tabular-nums text-primary">
                {formatCurrency(receivedAmount)}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  )
                                                }
